import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export default defineNuxtPlugin((nuxtApp) => {
  // Runtime Config sauber holen
  const runtimeConfig = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: runtimeConfig.public.firebaseApiKey,
    authDomain: runtimeConfig.public.firebaseAuthDomain,
    projectId: runtimeConfig.public.firebaseProjectId,
    storageBucket: runtimeConfig.public.firebaseStorageBucket,
    messagingSenderId: runtimeConfig.public.firebaseMessagingSenderId,
    appId: runtimeConfig.public.firebaseAppId,
    databaseURL: runtimeConfig.public.firebaseDatabaseURL,
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  // Über Nuxt bereitstellen
  nuxtApp.provide("firebaseApp", app);
  nuxtApp.provide("firebaseDb", database);
});