import {GLTFLoader} from "three/examples/jsm//loaders/GLTFLoader.js";
import * as THREE from "three/build/three.module.js";

let width = 640;
let height = 480;
let model;
const gltfLoader = new GLTFLoader();
// Load a glTF resource
gltfLoader.load(
	// resource URL
	'../assets/models/monkey.gltf',
	// called when the resource is loaded
	function ( gltf ) {
        model=gltf.scene;
        model.position.z = 90;
		model.scale.set(500 , 500, 500);
        initAR();
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}//../libs/ARnft-0.14.5/examples/DataNFT/pinball
);
function initAR(){
    ARnft.ARnft.init(width, height, [['../assets/targets/arjs/marker']], [['marker']], 'config.json', true)
    .then((nft) => {
        document.addEventListener('containerEvent', function (ev) {

            let canvas = document.getElementById('canvas');
            let fov = 0.8 * 180 / Math.PI;
            let ratio = width / height;
            let config = {
                "renderer": {
                    "alpha": true,
                    "antialias": true,
                    "context": null,
                    "precision": "mediump",
                    "premultipliedAlpha": true,
                    "stencil": true,
                    "depth": true,
                    "logarithmicDepthBuffer": true
                },
                "camera": {
                    "fov": fov,
                    "ratio": ratio,
                    "near": 0.01,
                    "far": 1000
                }
            }

            let sceneThreejs = new ARnftThreejs.SceneRendererTJS(config, canvas, nft.uuid, true);
            sceneThreejs.initRenderer();

            const renderer = sceneThreejs.getRenderer();
            const scene = sceneThreejs.getScene();
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.physicallyCorrectLights = true;

            let directionalLight = new THREE.DirectionalLight('#fff', 0.4);
            directionalLight.position.set(0.5, 0, 0.866);
            scene.add(directionalLight);

            let nftAddTJS = new ARnftThreejs.NFTaddTJS(nft.uuid);
            nftAddTJS.oef = true;
            nftAddTJS.add(model, "marker", false);
            console.log( "STAMPAAA,",model);
            const tick = () => {
                sceneThreejs.draw();
                window.requestAnimationFrame(tick);
            }
            tick();
        })
    }).catch((error) => {
        console.log(error);
    });
}


document.addEventListener('onInitThreejsRendering', (ev) => {
    console.log('onInitThreejsRendering is available only outside containerEvent!');
});
