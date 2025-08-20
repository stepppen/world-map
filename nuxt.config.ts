// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxt/ui',
    '@nuxtjs/supabase',
    'nuxt-maplibre'
  ],
  supabase: {
    redirect: false
  },
    plugins: [
    '~/plugins/firebase.client.js'
  ],
    runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      firebaseDatabaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL,
    }
  },
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