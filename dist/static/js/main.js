!function(){"use strict";var e,t,n={},r={};function o(e){var t=r[e];if(void 0!==t)return t.exports;var i=r[e]={exports:{}};return n[e](i,i.exports,o),i.exports}o.m=n,o.f={},o.e=function(e){return Promise.all(Object.keys(o.f).reduce((function(t,n){return o.f[n](e,t),t}),[]))},o.u=function(e){return"static/js/"+e+".main.js"},o.miniCssF=function(e){},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e={},t="webpack5test:",o.l=function(n,r,i,c){if(e[n])e[n].push(r);else{var u,a;if(void 0!==i)for(var l=document.getElementsByTagName("script"),s=0;s<l.length;s++){var f=l[s];if(f.getAttribute("src")==n||f.getAttribute("data-webpack")==t+i){u=f;break}}u||(a=!0,(u=document.createElement("script")).charset="utf-8",u.timeout=120,o.nc&&u.setAttribute("nonce",o.nc),u.setAttribute("data-webpack",t+i),u.src=n),e[n]=[r];var d=function(t,r){u.onerror=u.onload=null,clearTimeout(p);var o=e[n];if(delete e[n],u.parentNode&&u.parentNode.removeChild(u),o&&o.forEach((function(e){return e(r)})),t)return t(r)},p=setTimeout(d.bind(null,void 0,{type:"timeout",target:u}),12e4);u.onerror=d.bind(null,u.onerror),u.onload=d.bind(null,u.onload),a&&document.head.appendChild(u)}},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e+"../../"}(),function(){var e={179:0};o.f.j=function(t,n){var r=o.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else{var i=new Promise((function(n,o){r=e[t]=[n,o]}));n.push(r[2]=i);var c=o.p+o.u(t),u=new Error;o.l(c,(function(n){if(o.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var i=n&&("load"===n.type?"missing":n.type),c=n&&n.target&&n.target.src;u.message="Loading chunk "+t+" failed.\n("+i+": "+c+")",u.name="ChunkLoadError",u.type=i,u.request=c,r[1](u)}}),"chunk-"+t,t)}};var t=function(t,n){var r,i,c=n[0],u=n[1],a=n[2],l=0;if(c.some((function(t){return 0!==e[t]}))){for(r in u)o.o(u,r)&&(o.m[r]=u[r]);if(a)a(o)}for(t&&t(n);l<c.length;l++)i=c[l],o.o(e,i)&&e[i]&&e[i][0](),e[i]=0},n=self.webpackChunkwebpack5test=self.webpackChunkwebpack5test||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var i=(e,t)=>e+t;console.log(2*3),console.log(i(4,6)),document.getElementById("btnForLazyload").onclick=function(){o.e(14).then(o.bind(o,14)).then((e=>{console.log("module loading success",e.default(2,1))})).catch((e=>{console.log("module loading fail",e)}))}}();
//# sourceMappingURL=main.js.map