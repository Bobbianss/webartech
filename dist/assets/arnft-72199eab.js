import"./googlear-3cfb730f.js";import{G as h,s as m,D as p}from"./GLTFLoader-9a58939f.js";let s=640,l=480,n;const v=new h;v.load("${baseUrl}assets/models/monkey.gltf",function(e){n=e.scene,n.position.z=90,n.scale.set(500,500,500),R()},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("An error happened")});function R(){ARnft.ARnft.init(s,l,[["${baseUrl}assets/targets/arjs/marker"]],[["marker"]],"${baseUrl}assets/configurations/config.json",!0).then(e=>{document.addEventListener("containerEvent",function(T){let d=document.getElementById("canvas"),c=.8*180/Math.PI,u=s/l,f={renderer:{alpha:!0,antialias:!0,context:null,precision:"mediump",premultipliedAlpha:!0,stencil:!0,depth:!0,logarithmicDepthBuffer:!0},camera:{fov:c,ratio:u,near:.01,far:1e3}},t=new ARnftThreejs.SceneRendererTJS(f,d,e.uuid,!0);t.initRenderer();const r=t.getRenderer(),g=t.getScene();r.outputEncoding=m,r.physicallyCorrectLights=!0;let o=new p("#fff",.4);o.position.set(.5,0,.866),g.add(o);let i=new ARnftThreejs.NFTaddTJS(e.uuid);i.oef=!0,i.add(n,"marker",!1);const a=()=>{t.draw(),window.requestAnimationFrame(a)};a()})}).catch(e=>{console.log(e)})}document.addEventListener("onInitThreejsRendering",e=>{console.log("onInitThreejsRendering is available only outside containerEvent!")});