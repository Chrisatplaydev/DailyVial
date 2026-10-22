const VIEWPORT_META='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
const VIEWPORT_CSS='html,body{overscroll-behavior:none;touch-action:pan-x pan-y;-webkit-text-size-adjust:100%}input,select,textarea{font-size:max(16px,1em)!important}button,a,[role="button"]{touch-action:manipulation}';
const VIEWPORT_LOCK=`(() => {
 if(window.__dailyvialViewportLocked)return;
 window.__dailyvialViewportLocked=true;
 const lock=()=>{
  let meta=document.querySelector('meta[name="viewport"]');
  if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta);}
  meta.content=${JSON.stringify(VIEWPORT_META)};
 };
 if(document.head)lock();else document.addEventListener('DOMContentLoaded',lock,{once:true});
 const prevent=e=>{if(e.cancelable)e.preventDefault();};
 for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,prevent,{passive:false});
 // Leave one-finger scrolling and ordinary form input untouched.
 const stopPinch=e=>{if(e.touches?.length>1)prevent(e);};
 document.addEventListener('touchstart',stopPinch,{passive:false});
 document.addEventListener('touchmove',stopPinch,{passive:false});
})();`;
module.exports={VIEWPORT_META,VIEWPORT_CSS,VIEWPORT_LOCK};
