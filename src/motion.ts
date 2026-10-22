// One reveal controller for all page layouts. No scroll loop or animation library.
const pending = new Set<HTMLElement>();
const accordions = new Set<Animation>();
let observer: IntersectionObserver | undefined;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function show(el: HTMLElement, order = 0, instant = false) {
  if(!pending.delete(el)) return;
  observer?.unobserve(el);
  el.style.setProperty("--i", String(order));
  el.classList.add("in");
  el.dataset.motionSeen = "true";
  el.querySelectorAll<HTMLElement>(".rule").forEach(rule => rule.classList.add("light-pass"));
  const finish = () => { el.removeAttribute("data-reveal"); el.style.removeProperty("--i"); };
  if(instant || reduced()) finish();
  else setTimeout(finish, 620 + order * 45);
}

export function revealAll(scope: Node = document) { [...pending].filter(el => scope.contains(el)).forEach(el => show(el, 0, true)); }

export function initSiteMotion() {
  const root = document.documentElement;
  if(root.dataset.motionReady) return;
  root.dataset.motionReady = "true";
  // Case studies introduce the heading before their content, not the whole block at once.
  document.querySelectorAll<HTMLElement>("main section[data-reveal]").forEach(section => {
    section.removeAttribute("data-reveal");
    [...section.children].forEach(el => {
      if(el instanceof HTMLElement) el.dataset.reveal = el.matches("h2") ? "heading" : "";
    });
  });
  document.querySelectorAll<HTMLElement>(".prose h2").forEach(el => el.dataset.reveal = "heading");
  // Only major chapter changes receive a lit divider. No looping decoration.
  document.querySelectorAll<HTMLElement>("main > .services, main > .faq, .about > .shared").forEach(section => {
    const line = document.createElement("span");
    line.className = "motion-rule"; line.dataset.reveal = "line"; line.setAttribute("aria-hidden","true");
    section.prepend(line);
  });
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el => pending.add(el));
  (window as Window & { __vitrine?: boolean }).__vitrine = true;
  if(!("IntersectionObserver" in window) || reduced()) revealAll();
  else {
    observer = new IntersectionObserver(entries => {
      let order = 0;
      for(const entry of entries) if(entry.isIntersecting) show(entry.target as HTMLElement, Math.min(order++, 4));
    }, {rootMargin:"0px 0px -5% 0px",threshold:0.05});
    pending.forEach(el => observer!.observe(el));
  }
  const atEnd = () => {if(innerHeight + scrollY >= document.documentElement.scrollHeight - 4) revealAll();};
  addEventListener("scroll",atEnd,{passive:true});
  addEventListener("pageshow",event => {if(event.persisted) revealAll();});
  document.addEventListener("focusin",event => {
    if(!(event.target instanceof Element)) return;
    let el = event.target.closest<HTMLElement>("[data-reveal]");
    while(el) {show(el,0,true);el = el.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;}
  });
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",event => {
    if(event.matches) {revealAll();accordions.forEach(animation => animation.finish());}
  });
  atEnd();

  document.querySelectorAll<HTMLDetailsElement>("details.qa").forEach(details => {
    const summary = details.querySelector("summary")!;
    let expanded = details.open, animation: Animation | null = null;
    details.dataset.motionAccordion = "true";
    summary.addEventListener("click",event => {
      if(reduced()) {expanded = !details.open;return;}
      event.preventDefault();
      expanded = !expanded;
      const from = details.getBoundingClientRect().height;
      if(animation) {accordions.delete(animation);animation.onfinish = null;animation.cancel();}
      details.open = true;
      const style = getComputedStyle(details);
      const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      const to = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + border;
      details.style.overflow = "hidden";
      const current = details.animate([{height:`${from}px`},{height:`${to}px`}],{duration:240,easing:"cubic-bezier(.16,1,.3,1)"});
      animation = current; accordions.add(current);
      current.onfinish = () => {details.open = expanded;details.style.removeProperty("overflow");accordions.delete(current);animation = null;};
    });
  });
}
