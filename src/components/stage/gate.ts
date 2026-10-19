/**
 * Runs in <head> before the first paint. Every time the page loads it marks it so the hero starts on its
 * opening state: the logo frame shows and the hero copy waits to come in.
 * Skipped for reduced motion, Save-Data, deep links (#section), the CMS preview iframe and tool routes.
 * Failsafe: if the scene never takes over, the hero copy appears after 7 s anyway.
 */
export const OPENING_GATE = `(function(){try{var d=document.documentElement,l=location,c=navigator.connection;if(window.self!==window.top||/^\\/(studio|stage-capture)/.test(l.pathname))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches||(c&&c.saveData)||!window.WebGL2RenderingContext)return;if(!l.hash){d.setAttribute("data-opening","play");setTimeout(function(){if(d.getAttribute("data-opening")==="play")d.setAttribute("data-opening","done")},7000)}}catch(e){}})()`;
