import"./googlear-3cfb730f.js";import{a as b,R,W as E,V as v,S as T,P as A,H as L,b as C,M,c as O,d as P,e as B}from"./GLTFLoader-9a58939f.js";import{l as H}from"./loader-243c0004.js";class F{static createButton(c,n={}){const t=document.createElement("button");function m(){if(n.domOverlay===void 0){const s=document.createElement("div");s.style.display="none",document.body.appendChild(s);const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("width",38),a.setAttribute("height",38),a.style.position="absolute",a.style.right="20px",a.style.top="20px",a.addEventListener("click",function(){e.end()}),s.appendChild(a);const l=document.createElementNS("http://www.w3.org/2000/svg","path");l.setAttribute("d","M 12,12 L 28,28 M 28,12 12,28"),l.setAttribute("stroke","#fff"),l.setAttribute("stroke-width",2),a.appendChild(l),n.optionalFeatures===void 0&&(n.optionalFeatures=[]),n.optionalFeatures.push("dom-overlay"),n.domOverlay={root:s}}let e=null;async function p(s){s.addEventListener("end",y),c.xr.setReferenceSpaceType("local"),await c.xr.setSession(s),t.textContent="STOP AR",n.domOverlay.root.style.display="",e=s}function y(){e.removeEventListener("end",y),t.textContent="START AR",n.domOverlay.root.style.display="none",e=null}t.style.display="",t.style.cursor="pointer",t.style.left="calc(50% - 50px)",t.style.width="100px",t.textContent="START AR",t.onmouseenter=function(){t.style.opacity="1.0"},t.onmouseleave=function(){t.style.opacity="0.5"},t.onclick=function(){e===null?navigator.xr.requestSession("immersive-ar",n).then(p):e.end()}}function r(){t.style.display="",t.style.cursor="auto",t.style.left="calc(50% - 75px)",t.style.width="150px",t.onmouseenter=null,t.onmouseleave=null,t.onclick=null}function o(){r(),t.textContent="AR NOT SUPPORTED"}function h(e){r(),console.warn("Exception when trying to call xr.isSessionSupported",e),t.textContent="AR NOT ALLOWED"}function d(e){e.style.position="absolute",e.style.bottom="20px",e.style.padding="12px 6px",e.style.border="1px solid #fff",e.style.borderRadius="4px",e.style.background="rgba(0,0,0,0.1)",e.style.color="#fff",e.style.font="normal 13px sans-serif",e.style.textAlign="center",e.style.opacity="0.5",e.style.outline="none",e.style.zIndex="999"}if("xr"in navigator)return t.id="ARButton",t.style.display="none",d(t),navigator.xr.isSessionSupported("immersive-ar").then(function(e){e?m():o()}).catch(h),t;{const e=document.createElement("a");return window.isSecureContext===!1?(e.href=document.location.href.replace(/^http:/,"https:"),e.innerHTML="WEBXR NEEDS HTTPS"):(e.href="https://immersiveweb.dev/",e.innerHTML="WEBXR NOT AVAILABLE"),e.style.left="calc(50% - 90px)",e.style.width="180px",e.style.textDecoration="none",d(e),e}}}document.addEventListener("DOMContentLoaded",async()=>{q()});const N="/assets/models/monkey.gltf",u=new b;new R;const W=1024,D=1024;new E(W,D);var x;let f;var G=!1;new v;new v;let k;X(k,N).catch(i=>{console.error("Error during loading of the model")});function q(){const i=new T,c=new A(70,window.innerWidth/window.innerHeight,.01,100),n=new L(16777215,12303359,4);i.add(n);const t=new C(.15,.2,32).rotateX(-Math.PI/2),m=new M({color:"white"}),r=new O(t,m);r.matrixAutoUpdate=!1,r.visible=!1,i.add(r),i.add(u);const o=new P({antialias:!0,alpha:!0,stencil:!0});o.setPixelRatio(window.devicePixelRatio),o.setSize(window.innerWidth,window.innerHeight),o.xr.enabled=!0;const h=F.createButton(o,{requiredFeatures:["hit-test"],optionalFeatures:["dom-overlay"],domOverlay:{root:document.body}});document.body.appendChild(o.domElement),document.body.appendChild(h);const d=o.xr.getController(0);i.add(d),d.addEventListener("selectstart",e=>{console.log("Test selectSTART")}),d.addEventListener("selectend",e=>{console.log("TEST SELECT END")}),o.xr.addEventListener("sessionstart",async e=>{const p=o.xr.getSession(),y=await p.requestReferenceSpace("viewer"),s=await p.requestHitTestSource({space:y});x=o.xr.getCamera(),o.setAnimationLoop((a,l)=>{l&&(setTimeout(()=>{if(f=l.getHitTestResults(s),f.length>0&&!G){const g=f[0],S=o.xr.getReferenceSpace(),w=g.getPose(S);r.visible=!0,u.visible=!0,r.matrix.fromArray(w.transform.matrix),u.position.setFromMatrixPosition(new B().fromArray(w.transform.matrix)),updateRotationObject(x,u)}else r.visible=!1,u.visible=!1},0),o.render(i,c))})}),o.xr.addEventListener("sessionend",async()=>{hitTestSource=null,f=null})}async function X(i,c){await H(c)}
