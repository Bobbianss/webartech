// vite.config.js

import Inspect from 'vite-plugin-inspect'
import {resolve} from 'path'

export default{
  base:'/webartech/',
  plugins:[Inspect()],
  server: {
    host: true
  },
  build:{
    base:'/webartech/',
    rollupOptions:{
      input:{
        main: resolve(__dirname,'index.html'),
        mindar: resolve(__dirname, 'pages/mindar/mindar.html'),
        arnft: resolve(__dirname,'pages/arnft/arnft.html'),
        arjs:resolve(__dirname, 'pages/arjs/arjs.html'),
        googlear:resolve(__dirname,'pages/googlear/googlear.html'),
        webxr:resolve (__dirname,'pages/webxr/webxr.html')
      }
    }

  }
}

// export default defineConfig({
  
//   base:'/webartech/',
//   build: {base:'/webartech/',
//     rollupOptions:{
//       external: ['public/*'], // specifica il file da escludere dalla build
//       inpy
//     },
//   },
// });
