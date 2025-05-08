import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Auto import components on-demand
    Components({
      dts: true, // default: `true` if package typescript is installed
      dirs: ['src/components'],
      resolvers: [ 
        BootstrapVueNextResolver(),
       ],
    }),
    // Auto import APIs on-demand
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        // 'vue/macros',
        // '@vueuse/head',
        // '@vueuse/core',
      ],
      // dts: true, // default: `true` if package typescript is installed),

  }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

})
