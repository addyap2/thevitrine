import test from 'node:test';
import assert from 'node:assert/strict';
import { analyse } from '../api/audit.js';
import { auditScore } from '../src/audit-model.mjs';
const meta = {https:true,total:200,size:1000,url:'https://example.com/services/'};
const check = (html, id, headers={}) => analyse(html,{...meta,headers}).checks.find((c)=>c.id===id);

test('detects noindex and none across combined robots tags, including conflicting instructions',()=>{
  for(const content of ['noindex','NONE','nofollow, noindex','all; none']) {
    assert.equal(check(`<meta name="robots" content="${content}">`,'indexability').status,'bad');
  }
  assert.equal(check('<meta name="robots" content="index"><meta name="googlebot" content="noindex">','indexability').reason,'conflict');
  assert.equal(check('<meta name="robots" content="nofollow">','indexability').status,'good');
  assert.equal(check('<meta name="googlebot-news" content="noindex"><meta name="otherbot" content="none">','indexability').status,'good');
  assert.equal(check('<!-- <meta name="robots" content="noindex"> --><script>const s=\'<meta name="robots" content="noindex">\';</script>','indexability').status,'good');
});

test('combines server directives without applying another crawler’s restrictions to Google',()=>{
  assert.equal(check('','indexability',{'x-robots-tag':'noindex'}).status,'bad');
  assert.equal(check('','indexability',{'x-robots-tag':'otherbot: noindex, googlebot: index'}).status,'good');
  assert.equal(check('','indexability',{'x-robots-tag':['otherbot: noindex','noindex']}).status,'bad');
  assert.equal(check('<meta name="robots" content="all">','indexability',{'x-robots-tag':'Googlebot: noindex, follow'}).reason,'conflict');
  assert.equal(check('','indexability',{'x-robots-tag':'unavailable_after: 25 Jun 2030 15:00:00 PST, noindex'}).status,'bad');
});

test('canonical checks respect the head, relative addresses, base elements and intentional alternate pages',()=>{
  assert.equal(check('<head><link rel="canonical" href="/services/"></head>','canonical').status,'good');
  assert.equal(check('<head><base href="https://example.com/"><link rel="canonical" href="services/"></head>','canonical').status,'good');
  assert.equal(check('<head><link rel="canonical" href="/other/"></head>','canonical').reason,'other');
  assert.equal(check('<body><link rel="canonical" href="/services/"></body>','canonical').reason,'missing');
  assert.equal(check('<head><link rel="canonical" href="javascript:alert(1)"></head>','canonical').reason,'invalid');
  assert.equal(check('<head><link rel="canonical" href="/services/#section"></head>','canonical').reason,'invalid');
  assert.equal(check('<head><link rel="canonical" href="/services/" hreflang="en"></head>','canonical').reason,'invalid');
});

test('finds canonical declarations in Link headers and flags conflicting HTML and HTTP targets',()=>{
  assert.equal(check('','canonical',{link:'<https://example.com/services/>; rel="canonical"'}).status,'good');
  assert.equal(check('<head><link rel="canonical" href="/services/"></head>','canonical',{link:'<https://example.com/other/>; rel="canonical"'}).reason,'conflict');
  assert.equal(check('<head><link rel="canonical" href="/services/"></head>','canonical',{link:'<https://example.com/services/>; rel="canonical"'}).status,'good');
  assert.equal(check('','canonical',{link:'<https://example.com/a,b>; rel="preload"; title="a,b", <https://example.com/services/>; rel="canonical"'}).status,'good');
  assert.equal(check('','canonical',{link:'<https://example.com/services/>; title="ignore; rel=canonical"'}).reason,'missing');
});

test('an indexing exclusion becomes the first priority even when other basics pass',()=>{
  const report=auditScore([{id:'https',status:'good'},{id:'indexability',status:'bad'},{id:'canonical',status:'bad'},{id:'title',status:'bad'}]);
  assert.equal(report.indexingBlocked,true);
  assert.equal(report.priorities[0].id,'indexability');
  assert.equal(report.priorities[1].id,'canonical');
  assert.equal(report.count,3);
  const optional=auditScore([{id:'https',status:'good'},{id:'canonical',status:'warn'}]);
  assert.equal(optional.score,100);
  assert.equal(optional.priorities[0].id,'canonical');
});
