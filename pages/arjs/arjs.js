  
  document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
      const modelPath = new URL('../../assets/models/monkey.gltf', import.meta.url).href;
      const targetPath= new URL('../../assets/targets/arjs/marker', import.meta.url).href;
    
      document.querySelector('a-nft').setAttribute('url', targetPath);
      document.querySelector('a-entity').setAttribute('gltf-model', modelPath);
      console.log(targetPath);
    
    });
});
  