const baseUrl = import.meta.env.VITE_BASE_URL;
import * as THREE from "three";
import { loadAudio, loadGLTF, loadTexture } from "../../public/libs/loader.js";
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
// Usa `import.meta.url` per ottenere l'URL corrente del modulo
const modelPath = new URL('../../public/assets/models/monkey.gltf', import.meta.url).href;
const targetPath= new URL('../../public/assets/targets/mindAR-conchiglia.mind', import.meta.url).href;
document.addEventListener('DOMContentLoaded', async () => {
    startAR();
});
function startAR() {

    const start = async () => {
        const mindarThree = new MindARThree({
            container: document.body,
            imageTargetSrc: targetPath,
            maxTrack: 30,
            filterMinCF:0.1,
            filterBeta: 10,
            warmupTolerance:2,
            missTolerance:2

          });
        

        const { renderer, scene, camera } = mindarThree;
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        const anchor = mindarThree.addAnchor(0);
        const gltf = await loadGLTF(modelPath);
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