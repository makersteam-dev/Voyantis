"use strict";(()=>{var a=new URL(window.location.href),s=a.searchParams.get("gated");function m(e,t){document.cookie=`${e}=${t}; path=/`,console.log(`Cookie set: ${e}=${t}`)}function c(e){let t=`${e}=`,o=document.cookie.split(";");for(let n of o)if(n=n.trim(),n.startsWith(t))return n.substring(t.length,n.length);return null}function r(e){l?l.loadVideoById(e):l=new YT.Player("player",{height:"590",width:"100%",videoId:e,playerVars:{playsinline:1},events:{onReady:u}})}var l;function d(e){let t=`formSubmitted_${e}`;m(t,e);let o=document.querySelector(".gated-video-dummy-wrap");if(o?.parentNode?.removeChild(o),typeof YT<"u"&&YT.loaded)r(e);else{let n=document.createElement("script");n.src="https://www.youtube.com/iframe_api";let i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(n,i),window.onYouTubeIframeAPIReady=()=>{r(e)}}}if(s==="skip"){let e=document.getElementById("videoId").value;console.log("Gated skip detected with videoId:",e),d(e)}else{let t=`formSubmitted_${document.getElementById("videoId").value}`,o=c(t);o&&(console.log("Form already submitted with videoId:",o),d(o))}document.getElementById("wf-form-Gated-Form").addEventListener("submit",function(e){e.preventDefault(),document.querySelector('[mt-el="webinar-modal"]').classList.remove("show"),document.querySelector("#video-section").scrollIntoView({behavior:"smooth"});let t=document.getElementById("videoId").value;d(t)});function u(e){e.target.playVideo()}document.querySelectorAll('[mt-el="webinar-trigger"]').forEach(e=>{e.addEventListener("click",function(t){let o=document.getElementById("videoId").value,n=`formSubmitted_${o}`,i=c(n);console.log("Webinar trigger clicked. Cookie value:",i),i?(t.preventDefault(),document.querySelector("#video-section").scrollIntoView({behavior:"smooth"})):s==="skip"?(d(o),document.querySelector("#video-section").scrollIntoView({behavior:"smooth"})):document.querySelector('[mt-el="webinar-modal"]').classList.toggle("show")})});document.querySelectorAll('[mt-el="webinar-close"]').forEach(e=>{e.addEventListener("click",function(){document.querySelector('[mt-el="webinar-modal"]').classList.remove("show")})});})();
