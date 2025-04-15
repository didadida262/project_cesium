import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

/** @type {import('vite').UserConfig} */
export default {
  plugins: [vue(), cesium()],
  build: {
    commonjsOptions: {
      strictRequires: true, // 兼容commonjs
    },
    outDir: 'docs',
    rollupOptions: {
      plugins: {
        // 重写静态资源路径
        name: 'rewrite-paths',
        generateBundle(_, bundle) {
          for (const fileName in bundle) {
            const chunk = bundle[fileName]
            if (chunk.type === 'chunk' && chunk.code) {
              chunk.code = chunk.code.replace(
                /\/json\//g,
                '/cesium-vue3-vite/json/',
              )
              chunk.code = chunk.code.replace(
                /\/images\//g,
                '/cesium-vue3-vite/images/',
              )
              chunk.code = chunk.code.replace(
                /\/models\//g,
                '/cesium-vue3-vite/models/',
              )
            }
          }
        },
      },
    },
  },
}
