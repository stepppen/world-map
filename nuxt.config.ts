// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts', '@nuxt/ui'],
  ui: {
    tabs: {
      variant: {
        pill: {
          list: 'bg-elevated rounded-3xl',
          trigger: 'grow',
          indicator: 'rounded-3xl shadow-xs'
        }
      }
    }
  }
})