import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [
      vue(),
      Components({
        resolvers: [
          BootstrapVueNextResolver(),
        ],
      }),
      AutoImport({
        imports: [
          'vue',
          // 'vue-router',
          // 'vue-i18n',
          // 'vue/macros',
          // '@vueuse/head',
          // '@vueuse/core',
        ],
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  };


  return config;
})
