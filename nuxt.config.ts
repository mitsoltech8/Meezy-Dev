import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}, // ✅ ye sahi plugin hai
      autoprefixer: {},
    },
  },
  components: [
    {
      path: '~/components',
      extensions: ['vue'], // sirf .vue import hoga
      pathPrefix: false,
    },
  ],


   runtimeConfig: {
    public: {
      baseURL: 'http://localhost:4000/api', // Your backend API
    },
  },

})