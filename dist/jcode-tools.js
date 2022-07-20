(()=>{var v=Object.defineProperty;var R=(n,t)=>{for(var o in t)v(n,o,{get:t[o],enumerable:!0})};var N={};R(N,{CodeXClient:()=>b,getCustomCode:()=>x,getURL:()=>B,logger:()=>O});var x=async()=>{let n;do{if(n=document.querySelector("body>script:last-of-type"),n&&/^text\/.*/.test(n.type))return n.textContent;await new Promise(t=>setTimeout(t,50))}while(1)};function T(n){return new Promise((t,o)=>{try{let s=new WebSocket(n);s.addEventListener("message",l=>{let r=JSON.parse(l.data);r.type==="init"&&(s.clientID=r.message),t(s)})}catch(s){o(s.message)}})}function M(){let n,t,o=new Promise((s,l)=>{n=s,t=l});return{resolve:n,reject:t,promise:o}}var _="https://codex.juejin.fun",J="wss://ws.juejin.fun",b=class{constructor(t=_,o=J){this.url=t,this.wsURL=o,this.socket=null,this.onmessage=null,this.onerror=null,this.socketReady=M()}async input(t){await this.socketReady.promise,this.socket.send(JSON.stringify({type:"stdin",message:t}))}async runCode({code:t,language:o,input:s,timeout:l=8}={}){t||(t=await x()),o==null&&(o=document.querySelector("body>script:last-of-type").type.split("/")[1]),o==="node"&&(o="js"),o==="python"&&(o="py"),o==="golang"&&(o="go");let r={code:t,language:o,input:s,timeout:l},d={method:"POST",headers:{"Content-Type":"application/json"}};try{return this.socket||(this.socket=await T(this.wsURL),this.socket.addEventListener("message",e=>{let c=JSON.parse(e.data);c.type==="ready"?this.socketReady.resolve():c.type==="stdout"?this.onmessage&&this.onmessage(c.message):c.type==="stderr"&&this.onerror&&this.onerror(c.message)})),this.socket&&(r.wsID=this.socket.clientID),d.body=JSON.stringify(r),await(await fetch(this.url,d)).json()}catch(f){this.socket&&this.socket.close(),this.socket=null,console.error(f)}}};typeof BigInt=="function"&&!BigInt.prototype.toJSON&&(BigInt.prototype.toJSON=function(){return`${this}n`});function w(n,t,o,s){n[t]=n[t]||[],n[t][s]=o}function H(n){let t={};if(n){let o=0,s=Object.keys(n).every(l=>l===Number(l).toString());for(let[l,r]of Object.entries(n))if(typeof r!="function"){if(w(t,"(index)",s?Number(l):l,o),r==null||typeof r!="object"||r instanceof RegExp)w(t,"Value",r,o);else for(let[d,f]of Object.entries(r))w(t,d,f,o);o++}return t}return n}function U(n,t){let o=n["(index)"].length;if(o){let s=document.createElement("table"),l=document.createElement("thead");s.appendChild(l),s.className="jcode-logger__table";let r=Object.keys(n);t&&(r=r.filter(i=>i==="(index)"||i==="Value"||t.includes(i)));let d=document.createElement("tr");d.innerHTML=r.map((i,e)=>`<th data-index="${e}">${i}</th>`).join(""),l.appendChild(d);let f=document.createElement("tbody");s.appendChild(f);for(let i=0;i<o;i++){let e=document.createElement("tr");f.appendChild(e);for(let c=0;c<r.length;c++){let a=r[c],p=document.createElement("td");if(i in n[a]){let u=n[a][i];typeof u=="string"&&a!=="(index)"&&(u=`'${u}'`),Array.isArray(u)?u.length>3&&(p.textContent=`${u.slice(0,3)}... (total: ${u.length})`):typeof u=="bigint"?p.textContent=`${u}n`:typeof u=="symbol"?p.textContent=u.toString():p.textContent=u,p.className=E(u).toLowerCase()}e.appendChild(p)}}return s}}function L(n){return Object.prototype.toString.call(n)==="[object Object]"?JSON.stringify(n):n}function $(n){let t=L(n[0]),o=[],s=/%[cdfios]/,l=0;for(let r=1;r<n.length;r++){let d=L(n[r]);if(s.test(t))t=t.replace(s,f=>{if(f==="%c"){let i=`${l?"</span>":""}<span style="${d}">`;return l++,i}if(f==="%d"||f==="%i")return parseInt(d,10);if(f==="%f")return parseFloat(d);if(f==="%s")return d.toString();if(f==="%o")return JSON.stringify(d)});else{o.push(...n.slice(r).map(L));break}}return o=[t,...o],l&&o.push("</span>"),o}function E(n){return Object.prototype.toString.call(n).slice(8,-1)}function j(n,t=0){let o=document.createElement("ul");o.className="jcode-logger__dir";let s=E(n),l=document.createElement("div");l.textContent=n instanceof HTMLElement?n.tagName.toLowerCase():s,l.addEventListener("click",()=>{l.classList.toggle("expand")}),o.appendChild(l);let r=[];for(let d in n)typeof n[d]!="function"&&r.push([d,n[d]]);Array.isArray(n)&&r.push(["length",n.length]),r.sort((d,f)=>d[0]>f[0]?1:d[0]<f[0]?-1:0);for(let d=0;d<r.length;d++){let[f,i]=r[d];typeof i=="string"&&(i=`"${i}"`);let e=document.createElement("li"),c=document.createElement("em");c.textContent=f;let a=document.createElement("span");if(a.className=E(i).toLowerCase(),Array.isArray(i)&&i.length<=0?a.textContent="Array(0)":i instanceof NodeList?a.textContent=`NodeList(${i.length})`:i instanceof HTMLCollection?a.textContent=`HTMLCollection(${i.length})`:i instanceof DOMTokenList?a.textContent=`DOMTokenList(${i.length})`:i instanceof HTMLElement?a.textContent=`${i.tagName.toLowerCase()}${i.id?`#${i.id}`:""}`:a.textContent=i,t<2&&i&&typeof i=="object"&&!(i instanceof Window)){let p=j(i,t+1);p.children[0].innerHTML="",p.children[0].appendChild(c),p.children[0].appendChild(a),e.appendChild(p)}else e.appendChild(c),e.appendChild(a);o.appendChild(e)}return o}var A={log:console.log,info:console.info,warn:console.warn,error:console.error,dir:console.dir,table:console.table,group:console.group,groupCollapsed:console.groupCollapsed,groupEnd:console.groupEnd,count:console.count,countReset:console.countReset,time:console.time,timeEnd:console.timeEnd,assert:console.assert,clear:console.clear},O=(n,t=A)=>{let o=document.createElement("div");o.className="jcode-logger",n.append(o);let s=(e,c="info")=>{let a=document.createElement("pre");a.className=`jcode-logger__${c}`,a.innerHTML=e,o.appendChild(a)},l=e=>(...c)=>{t&&t[e](...c),c=$(c);let a=c.map(p=>p&&p.toString?p.toString():Object.prototype.toString.call(p)).join(" ");s(a,e)},r=[],d=(e,c=!1)=>{let a=document.createElement("div");a.className="jcode-logger__group",o.appendChild(a);let p=document.createElement("div");p.textContent=e,c||(p.className="expand"),a.appendChild(p),p.addEventListener("click",()=>{p.classList.toggle("expand")}),r.push(o),o=a},f={},i={};return{log:l("log"),info:l("info"),warn:l("warn"),error:l("error"),assert:(e,...c)=>{if(t&&t.assert(e,...c),!e){let a=$(c).join(" ");s(`Assertion failed: ${a}`,"error")}},clear:()=>{t&&t.clear(),r.length>0&&(o=r[0],r.length=0),o.innerHTML=""},group:e=>{t&&t.group(e),d(e)},groupCollapsed:e=>{t&&t.groupCollapsed(e),d(e,!0)},groupEnd:()=>{t&&t.groupEnd(),r.length>0&&(o=r.pop())},count:(e="default")=>{t&&t.count(e),e=e.toString(),f[e]=f[e]||0,f[e]++,s(`${e}: ${f[e]}`)},time:(e="default")=>{t&&t.time(e),e=e.toString(),e in i?s(`Timer '${e}' already exists`,"warn"):i[e]=performance.now()},countReset:(e="default")=>{t&&t.countReset(e),e=e.toString(),e in f?delete f[e]:s(`Count for '${e}' does not exist`,"warn")},timeEnd:(e="default")=>{t&&t.timeEnd(e),e=e.toString(),e in i?(s(`${e}: ${performance.now()-i[e]} ms`),delete i[e]):s(`Timer '${e}' does not exist`,"warn")},dir:e=>{t&&t.dir(e);let c=j(e);o.appendChild(c)},table:(e,c)=>{t&&t.table(e,c);let a=H(e),p=U(a,c);p.addEventListener("click",u=>{let g=u.target;if(g.tagName==="TH"){let k=Number(g.dataset.index),S=[...p.querySelectorAll("tr")].slice(1);S.sort((m,C)=>{m=m.children[k],C=C.children[k];let y=m.textContent,h=C.textContent;return m.className==="number"&&(y=Number(y)),C.className==="number"&&(h=Number(h)),m.className==="bigint"&&(y=BigInt(y.slice(0,-1))),C.className==="bigint"&&(h=BigInt(h.slice(0,-1))),y>h?g.dataset.sort==="asc"?-1:1:y<h?g.dataset.sort==="asc"?1:-1:0}),S.forEach(m=>{p.appendChild(m)}),g.dataset.sort=g.dataset.sort==="asc"?"desc":"asc"}}),o.appendChild(p)}}};function I(n){let t=new Blob([n],{type:"text/javascript"});return URL.createObjectURL(t)}var B=async()=>{let n=await x();return I(n)};window.JCode=window.JCode||N;})();
