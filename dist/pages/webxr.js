import * as THREE from "../../node_modules/three/build/three.module.js";
import { ARButton } from "../../node_modules/three/examples/jsm/webxr/ARButton.js"
import { loadAudio, loadGLTF, loadTexture } from "../libs/loader.js";


document.addEventListener('DOMContentLoaded', async () => {
  startAR();
});


var portalModelLoaded, envModelLoaded;
var bBoxEnv, bBoxPortal;
 // raycaster
 let isPortalTouched=false;
 let isEnter=false;

 const groupModels = new THREE.Group();

 const raycaster = new THREE.Raycaster();
 const TOUCH_DISTANCE=0.009;
 const OUT_DISTANCE=1.3;
 var distanceToCenterEnv;

 //TEST RENDERER TARGET
const rtWidth = 1024;
const rtHeight = 1024;
const renderTarget = new THREE.WebGL3DRenderTarget(rtWidth, rtHeight);
var portalePiano;


var XRCamera;
let hitTestResults;
var isPortalPositioned = false;

//XR GLOBAL
var XRCamGlobalPosition=new THREE.Vector3();
var EnvModelGlobalPosition= new THREE.Vector3();
var isModelReady = {
  aInternal: false,
  aListener: function (val) { },
  set value(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get value() {
    return this.aInternal;
  },
  registerListener: function (listener) {
    this.aListener = listener;
  }
} // VARIABLE WITH LISTENER DECLARATION
const sceneGLTF = await loadGLTF("../../assets/models/monkey.gltf");
const normalizeModel = (obj, height) => {
  // scale it according to height
  const bbox = new THREE.Box3().setFromObject(obj);
  const size = bbox.getSize(new THREE.Vector3());
  obj.scale.multiplyScalar(height);
  console.log("Mesure" + height)
  // reposition to center
  const bbox2 = new THREE.Box3().setFromObject(obj);
  const center = bbox2.getCenter(new THREE.Vector3());
  obj.position.set(-center.x, -center.y, -center.z);
}

function startAR() {
  //SCENE
  const scene = new THREE.Scene();
  //VIRTUAL CAMERA
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
  //CREATE LIGHT FOR VIRTUAL AMBIENT
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 4);
  scene.add(light);

  //POINTER MESH 
  const pointerGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2);
  const pointerMaterial = new THREE.MeshBasicMaterial({ color: "white" });
  const pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial);
  pointerMesh.matrixAutoUpdate = false;
  pointerMesh.visible = false;
  scene.add(pointerMesh);

  //EMPTY GORUP FOR MODELS
  scene.add(groupModels);

  //RENDERER
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true, stencil: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
 // renderer.setRenderTarget(renderTarget);
 
  //active xr to render
  renderer.xr.enabled = true;

  
  //AR BUTTON
  const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } });
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(arButton);

  //Get Controller, require xr.enabled=true
  const controller = renderer.xr.getController(0);
  scene.add(controller);

  //tap schermo giu
  controller.addEventListener('selectstart', (e) => {

    console.log("Test selectSTART");
    if (!isPortalPositioned && portalModelLoaded) {
      isPortalPositioned = true;
      scene.add(groupModels);
    }
   

  });
  //tap schermo su
  controller.addEventListener('selectend', (e) => {
    console.log("TEST SELECT END");
  });

  // SESSION AR START
  renderer.xr.addEventListener("sessionstart", async (e) => {
    const session = renderer.xr.getSession();
    // local space sono le coordinate di dove ho iniziato la sesione
    const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
    // viewerReferenceSpace è la posizione corrente del viewer
    const hitTestSource = await session.requestHitTestSource({ space: viewerReferenceSpace});
    XRCamera= renderer.xr.getCamera(); 
    let distance;
   
    renderer.setAnimationLoop((timestamp, frame) => {
      if (!frame) return;

      setTimeout(()=>{
         //array di risultati 
         hitTestResults = frame.getHitTestResults(hitTestSource); // ARRAY

         if (hitTestResults.length > 0 && !isPortalPositioned) {
           const hitResult = hitTestResults[0];
           const referenceSpaceLocal = renderer.xr.getReferenceSpace(); 
           const hitPose = hitResult.getPose(referenceSpaceLocal);
   
           pointerMesh.visible = true;
           groupModels.visible = true;
   
           pointerMesh.matrix.fromArray(hitPose.transform.matrix);
           groupModels.position.setFromMatrixPosition(new THREE.Matrix4().fromArray(hitPose.transform.matrix));
           updateRotationObject(XRCamera,groupModels);
         
           
           
         } else {
           pointerMesh.visible = false;
           if (!isPortalPositioned)
             groupModels.visible = false;
         }
 
         if(isPortalPositioned){
           
           XRCamera.getWorldPosition(XRCamGlobalPosition);
           envModelLoaded.getWorldPosition(EnvModelGlobalPosition)
           distanceToCenterEnv= EnvModelGlobalPosition.distanceTo(camera.position);
          console.log("Distanza da cubo=" + distanceToCenterEnv);
          var testGlobalPosition;
          raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
          var intersects = raycaster.intersectObjects(scene.children);
          isPortalTouch(intersects);
 
         //envModelLoaded.getWorldPosition(EnvModelGlobalPosition);
         //XRCamera.getWorldPosition(XRCamGlobalPosition);
         // distance to XR CAM FROM CUBE
         // distance= XRCamGlobalPosition.distanceTo(EnvModelGlobalPosition);
           
        
         }
      },0);
         
     
      
     //console.log("DISTANZA TRA CUBO E XRCAM=" + JSON.stringify(distance));
     //renderer.setRenderTarget(renderTarget);
     //renderer.render(scene,arrayCamera);
     // renderer.setRenderTarget(null);
     //distanceFromPhone(arrayCamera );
 
      renderer.render(scene, camera);
    });
  });

  // SESSION AR FINISH
  renderer.xr.addEventListener("sessionend", async () => {
    hitTestSource=null;
    hitTestResults=null;

  });
}

async function loadModel(pathModel) {
  // analizza i dati del modello glTF utilizzando il metodo load dell'oggetto GLTFLoader e passa una funzione di callback
  const gltf = await new Promise((resolve, reject) => {
    loadGLTF.load(pathModel, (gltf) => resolve(gltf), (event) => {
      // calcola il progresso in percentuale
      const progress = Math.round((event.loaded / event.total) * 100);

    }, (error) => reject(error));
  });
  gltf.scene.traverse(function (node) {
    if (node.isMesh) {
      if (node.name === "Environment") {
        envModelLoaded = node;
        stencilMaterialEnv(envModelLoaded.material, true);
       
      } else if (node.name === "Portal") {
        portalModelLoaded = node;
        stenciMaterialPortal(portalModelLoaded.material, true);
        
      }
    }
  });
  groupModels.add(portalModelLoaded,envModelLoaded);
  groupModels.scale.set(0.5,0.5,0.5);
  groupModels.visible=false;
  isModelReady.value = true;

 
  return gltf;
}

function stencilMaterialEnv(material, active) {
  if (active) {
    material.stencilWrite = true;
    material.stencilRef = 1; // metti a 1
    material.stencilFunc = THREE.EqualStencilFunc;
  } else {
    material.stencilWrite = true;
    material.stencilRef = 0;
    material.stencilFunc = THREE.EqualStencilFunc;
  }

}//[m] stencilMaterialEnv(material,active)

function stenciMaterialPortal(material, active) {
  if (active) {
    material.stencilWrite = true; // abilito la scrittura
    material.stencilRef = 1; //
    material.depthWrite = false;
    // serve per non creare arteffatti di z-index, non ci saranno effetti nel momento del cambio della z value
    material.stencilFunc = THREE.AlwaysStencilFunc; // tutti i pixel di questa mesh sono a 1
    material.stencilZPass = THREE.ReplaceStencilOp;
    material.colorWrite = false
  } else {

  }
}// [m] stenciMaterialPortal(material,active)


function isPortalTouch(intersects){
  intersects.forEach(portalTouched);

}
function portalTouched(item,index,arr){
  let isTouched=false;
  if(item.object.name=="Portal"&& item.distance<TOUCH_DISTANCE){
    console.log("PORTALE TOCCATO");
    isTouched=true;
    if(isTouched && !isEnter ){
      stencilMaterialEnv(envModelLoaded.material,false);
      isTouched=false;
      isEnter=true;
    }else if(isTouched && isEnter && distanceToCenterEnv>OUT_DISTANCE){
      stencilMaterialEnv(envModelLoaded.material,true);
      isEnter=false;
      isTouched=false;
      console.log("USCITO DAL CUBO");
    }
  }
}


function updateRotationObject(camera,model){
  const objTempPos = new THREE.Vector3();
  objTempPos.setFromMatrixPosition(model.matrixWorld);
  const cameraGlobalPosition = new THREE.Vector3();
  cameraGlobalPosition.setFromMatrixPosition(camera.matrixWorld);
  const direction = cameraGlobalPosition.sub(objTempPos).normalize();
  // plane (x,z)
  const angle = Math.atan2(direction.x, direction.z);
  model.rotation.y = angle;
}
