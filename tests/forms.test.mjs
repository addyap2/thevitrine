import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, originOk, send } from '../api/_email.js';
import { issueToken, checkToken, limited } from '../api/_guard.js';
import contact from '../api/contact.js';
import devis from '../api/devis.js';
process.env.FORM_SECRET = 'test-only-secret';
process.env.RESEND_API_KEY = 'test-only-key';
for (const name of ['KV_REST_API_URL','KV_REST_API_TOKEN','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN']) delete process.env[name];
const matureToken = () => {const original=Date.now;Date.now=()=>original()-6000;try{return issueToken();}finally{Date.now=original;}};
const response = () => ({ code:0, body:null, setHeader(){}, status(code){this.code=code;return this;},json(body){this.body=body;return this;} });
const request = (email) => ({ method:'POST',headers:{origin:'https://thevitrine.fr','content-type':'application/json','x-forwarded-for':email}, body:{token:matureToken(),name:'Test Person',email,consent:true,message:'A valid request',submissionId:'fixed-request-id'} });
test('body limit covers parsed JSON and UTF-8 bytes',async()=>{await assert.rejects(readJson({body:{text:'é'.repeat(50)}},60));await assert.rejects(readJson({body:'{"value":"'+'a'.repeat(100)+'"}'},30));assert.deepEqual(await readJson({body:{ok:true}},20),{ok:true});});
test('reject unrelated preview origins',()=>{assert.equal(originOk({headers:{origin:'https://unrelated.vercel.app'}}),false);assert.equal(originOk({headers:{origin:'https://thevitrine-abc-addyap2.vercel.app'}}),true);});
test('signed tokens enforce maturity, tampering and replay',async()=>{assert.equal(await checkToken(issueToken(),3000),'young');const token=matureToken();assert.equal(await checkToken(token+'x',3000),'invalid');assert.equal(await checkToken(token,3000),'ok');assert.equal(await checkToken(token,3000),'invalid');});
test('rate limit counts hits',async()=>{assert.equal(await limited('test','one',1,10000),false);assert.equal(await limited('test','one',1,10000),true);});
test('mail requests carry duplicate protection and a deadline',async()=>{const original=globalThis.fetch;globalThis.fetch=async(url,options)=>{assert.equal(options.headers['Idempotency-Key'],'stable-id');assert.ok(options.signal instanceof AbortSignal);return new Response('{"id":"test"}',{status:200});};try{assert.deepEqual(await send('dummy',{to:['test@example.com']},'stable-id'),{id:'test'});}finally{globalThis.fetch=original;}});
for(const [name,handler] of [['contact',contact],['quote',devis]]){
 test(`${name}: team failure is retryable; confirmation failure is truthful`,async()=>{const original=globalThis.fetch;try{
  globalThis.fetch=async()=>new Response('unavailable',{status:503});let res=response();await handler(request(`${name}-failed@example.com`),res);assert.equal(res.code,502);assert.equal(res.body.ok,false);
  let calls=0;globalThis.fetch=async()=>++calls===1?new Response('{"id":"team"}',{status:200}):new Response('unavailable',{status:503});res=response();await handler(request(`${name}-partial@example.com`),res);assert.equal(res.code,200);assert.deepEqual(res.body,{ok:true,confirmationSent:false});assert.equal(calls,2);
 }finally{globalThis.fetch=original;}});
}
test('shared replay claims are atomic and shared limits use expiring hashed keys',async()=>{process.env.KV_REST_API_URL='https://example.invalid';process.env.KV_REST_API_TOKEN='dummy';const original=globalThis.fetch;let claims=0;globalThis.fetch=async(url,options)=>{const cmd=JSON.parse(options.body);assert.ok(!JSON.stringify(cmd).includes('private@example.com'));return new Response(JSON.stringify({result:cmd[0]==='SET'?(claims++===0?'OK':null):2}),{status:200});};try{const t=matureToken();assert.equal(await checkToken(t,3000),'ok');assert.equal(await checkToken(t,3000),'invalid');assert.equal(await limited('test','private@example.com',1,10000),true);}finally{globalThis.fetch=original;delete process.env.KV_REST_API_URL;delete process.env.KV_REST_API_TOKEN;}});
