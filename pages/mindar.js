
import { loadAudio, loadGLTF, loadTexture } from "../libs/loader.js";
import { MindARThree } from '../../node_modules/mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from "../../node_modules/three/build/three.module.js";

document.addEventListener('DOMContentLoaded', async () => {
    startAR();
});
function startAR() {

    const start = async () => {
        const mindarThree = new MindARThree({
            container: document.body,
            imageTargetSrc: "../assets/targets/mindAR-conchiglia.mind",
            maxTrack: 30,
          });
        

        const { renderer, scene, camera } = mindarThree;
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        const anchor = mindarThree.addAnchor(0);
        const gltf = await loadGLTF("../assets/models/monkey.gltf");
        gltf.scene.scale.set(0.3, 0.3, 0.3); // da rivedere in caso

        //setup anchor and gltf scene
        anchor.group.add(gltf.scene);
        scene.add(light);
        //on target found
        anchor.onTargetFound = () => {

        };
        //on target lost, pause audio
        anchor.onTargetLost = () => {
        }

        //start ar engine
        await mindarThree.start();

        //animation update loop
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    };

    start();
}