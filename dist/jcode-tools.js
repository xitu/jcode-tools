(()=>{var v=Object.defineProperty;var R=(n,t)=>{for(var o in t)v(n,o,{get:t[o],enumerable:!0})};var N={};R(N,{CodeXClient:()=>b,getCustomCode:()=>x,getURL:()=>B,logger:()=>O});var x=async()=>{let n;do{if(n=document.querySelector("body>script:last-of-type"),n&&/^text\/.*/.test(n.type))return n.textContent;await new Promise(t=>setTimeout(t,50))}while(1)};function T(n){return new Promise((t,o)=>{try{let s=new WebSocket(n);s.addEventListener("message",a=>{let r=JSON.parse(a.data);r.type==="init"&&(s.clientID=r.message),t(s)})}catch(s){o(s.message)}})}function M(){let n,t,o=new Promise((s,a)=>{n=s,t=a});return{resolve:n,reject:t,promise:o}}var _="https://codex.juejin.fun",J="wss://ws.juejin.fun",b=class{constructor(t=_,o=J){this.url=t,this.wsURL=o,this.socket=null,this.onmessage=null,this.onerror=null,this.socketReady=M()}async input(t){await this.socketReady.promise,this.socket.send(JSON.stringify({type:"stdin",message:t}))}async runCode({code:t,language:o,input:s,timeout:a=8}={}){t||(t=await x()),o==null&&(o=document.querySelector("body>script:last-of-type").type.split("/")[1]),o==="node"&&(o="js"),o==="python"&&(o="py"),o==="golang"&&(o="go");let r={code:t,language:o,input:s,timeout:a},f={method:"POST",headers:{"Content-Type":"application/json"}};try{return this.socket||(this.socket=await T(this.wsURL),this.socket.addEventListener("message",e=>{let c=JSON.parse(e.data);c.type==="ready"?this.socketReady.resolve():c.type==="stdout"?this.onmessage&&this.onmessage(c.message):c.type==="stderr"&&this.onerror&&this.onerror(c.message)})),this.socket&&(r.wsID=this.socket.clientID),f.body=JSON.stringify(r),await(await fetch(this.url,f)).json()}catch(p){this.socket&&this.socket.close(),this.socket=null,console.error(p)}}};typeof BigInt=="function"&&!BigInt.prototype.toJSON&&(BigInt.prototype.toJSON=function(){return`${this}n`});function w(n,t,o,s){n[t]=n[t]||[],n[t][s]=o}function H(n){let t={};if(n){let o=0,s=Object.keys(n).every(a=>a===Number(a).toString());for(let[a,r]of Object.entries(n))if(typeof r!="function"){if(w(t,"(index)",s?Number(a):a,o),r==null||typeof r!="object"||r instanceof RegExp)w(t,"Value",r,o);else for(let[f,p]of Object.entries(r))w(t,f,p,o);o++}return t}return n}function U(n,t){let o=n["(index)"].length;if(o){let s=document.createElement("table"),a=document.createElement("thead");s.appendChild(a),s.className="jcode-logger__table";let r=Object.keys(n);t&&(r=r.filter(i=>i==="(index)"||i==="Value"||t.includes(i)));let f=document.createElement("tr");f.innerHTML=r.map((i,e)=>`<th data-index="${e}">${i}</th>`).join(""),a.appendChild(f);let p=document.createElement("tbody");s.appendChild(p);for(let i=0;i<o;i++){let e=document.createElement("tr");p.appendChild(e);for(let c=0;c<r.length;c++){let d=r[c],l=document.createElement("td");if(i in n[d]){let u=n[d][i];typeof u=="string"&&d!=="(index)"&&(u=`'${u}'`),Array.isArray(u)?u.length>3&&(l.textContent=`${u.slice(0,3)}... (total: ${u.length})`):typeof u=="bigint"?l.textContent=`${u}n`:typeof u=="symbol"?l.textContent=u.toString():l.textContent=u,l.className=E(u).toLowerCase()}e.appendChild(l)}}return s}}function L(n){return Object.prototype.toString.call(n)==="[object Object]"?JSON.stringify(n):n}function $(n){let t=L(n[0]),o=[],s=/%[cdfios]/,a=0;for(let r=1;r<n.length;r++){let f=L(n[r]);if(s.test(t))t=t.replace(s,p=>{if(p==="%c"){let i=`${a?"</span>":""}<span style="${f}">`;return a++,i}if(p==="%d"||p==="%i")return parseInt(f,10);if(p==="%f")return parseFloat(f);if(p==="%s")return f.toString();if(p==="%o")return JSON.stringify(f)});else{o.push(...n.slice(r).map(L));break}}return o=[t,...o],a&&o.push("</span>"),o}function E(n){return Object.prototype.toString.call(n).slice(8,-1)}function j(n,t=0){let o=document.createElement("ul");o.className="jcode-logger__dir";let s=E(n),a=document.createElement("div");a.textContent=n instanceof HTMLElement?n.tagName.toLowerCase():s,a.addEventListener("click",()=>{a.classList.toggle("expand")}),o.appendChild(a);let r=[];for(let f in n)typeof n[f]!="function"&&r.push([f,n[f]]);Array.isArray(n)&&r.push(["length",n.length]),r.sort((f,p)=>f[0]>p[0]?1:f[0]<p[0]?-1:0);for(let f=0;f<r.length;f++){let[p,i]=r[f];typeof i=="string"&&(i=`"${i}"`);let e=document.createElement("li"),c=document.createElement("em");c.textContent=p;let d=document.createElement("span");if(d.className=E(i).toLowerCase(),Array.isArray(i)&&i.length<=0?d.textContent="Array(0)":i instanceof NodeList?d.textContent=`NodeList(${i.length})`:i instanceof HTMLCollection?d.textContent=`HTMLCollection(${i.length})`:i instanceof DOMTokenList?d.textContent=`DOMTokenList(${i.length})`:i instanceof HTMLElement?d.textContent=`${i.tagName.toLowerCase()}${i.id?`#${i.id}`:""}`:d.textContent=i,t<2&&i&&typeof i=="object"&&!(i instanceof Window)){let l=j(i,t+1);l.children[0].innerHTML="",l.children[0].appendChild(c),l.children[0].appendChild(d),e.appendChild(l)}else e.appendChild(c),e.appendChild(d);o.appendChild(e)}return o}var A={log:console.log,info:console.info,warn:console.warn,error:console.error,dir:console.dir,table:console.table,group:console.group,groupCollapsed:console.groupCollapsed,groupEnd:console.groupEnd,count:console.count,countReset:console.countReset,time:console.time,timeEnd:console.timeEnd,assert:console.assert,clear:console.clear},O=(n,t=A)=>{let o=document.createElement("div");o.className="jcode-logger",n.append(o);let s=(e,c="info")=>{let d=document.createElement("pre");d.className=`jcode-logger__${c}`,d.innerHTML=e,o.appendChild(d)},a=e=>(...c)=>{t&&t[e](...c),c=$(c);let d=c.map(l=>l==null?String(l):l&&l.toString?l.toString():Object.prototype.toString.call(l)).join(" ");s(d,e)},r=[],f=(e,c=!1)=>{let d=document.createElement("div");d.className="jcode-logger__group",o.appendChild(d);let l=document.createElement("div");l.textContent=e,c||(l.className="expand"),d.appendChild(l),l.addEventListener("click",()=>{l.classList.toggle("expand")}),r.push(o),o=d},p={},i={};return{log:a("log"),info:a("info"),warn:a("warn"),error:a("error"),assert:(e,...c)=>{if(t&&t.assert(e,...c),!e){let d=$(c).join(" ");s(`Assertion failed: ${d}`,"error")}},clear:()=>{t&&t.clear(),r.length>0&&(o=r[0],r.length=0),o.innerHTML=""},group:e=>{t&&t.group(e),f(e)},groupCollapsed:e=>{t&&t.groupCollapsed(e),f(e,!0)},groupEnd:()=>{t&&t.groupEnd(),r.length>0&&(o=r.pop())},count:(e="default")=>{t&&t.count(e),e=e.toString(),p[e]=p[e]||0,p[e]++,s(`${e}: ${p[e]}`)},time:(e="default")=>{t&&t.time(e),e=e.toString(),e in i?s(`Timer '${e}' already exists`,"warn"):i[e]=performance.now()},countReset:(e="default")=>{t&&t.countReset(e),e=e.toString(),e in p?delete p[e]:s(`Count for '${e}' does not exist`,"warn")},timeEnd:(e="default")=>{t&&t.timeEnd(e),e=e.toString(),e in i?(s(`${e}: ${performance.now()-i[e]} ms`),delete i[e]):s(`Timer '${e}' does not exist`,"warn")},dir:e=>{t&&t.dir(e);let c=j(e);o.appendChild(c)},table:(e,c)=>{t&&t.table(e,c);let d=H(e),l=U(d,c);l.addEventListener("click",u=>{let g=u.target;if(g.tagName==="TH"){let k=Number(g.dataset.index),S=[...l.querySelectorAll("tr")].slice(1);S.sort((m,C)=>{m=m.children[k],C=C.children[k];let y=m.textContent,h=C.textContent;return m.className==="number"&&(y=Number(y)),C.className==="number"&&(h=Number(h)),m.className==="bigint"&&(y=BigInt(y.slice(0,-1))),C.className==="bigint"&&(h=BigInt(h.slice(0,-1))),y>h?g.dataset.sort==="asc"?-1:1:y<h?g.dataset.sort==="asc"?1:-1:0}),S.forEach(m=>{l.appendChild(m)}),g.dataset.sort=g.dataset.sort==="asc"?"desc":"asc"}}),o.appendChild(l)}}};function I(n){let t=new Blob([n],{type:"text/javascript"});return URL.createObjectURL(t)}var B=async()=>{let n=await x();return I(n)};window.JCode=window.JCode||N;})();
