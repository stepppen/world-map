import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

export default defineNuxtPlugin(() => {
    const firebaseConfig = {
        apiKey: useRuntimeConfig().public.firebaseApiKey,
        authDomain: useRuntimeConfig().public.firebaseAuthDomain,
        projectId: useRuntimeConfig().public.firebaseProjectId,
        storageBucket: useRuntimeConfig().public.firebaseStorageBucket,
        messagingSenderId: useRuntimeConfig().public.firebaseMessagingSenderId,
        appId: useRuntimeConfig().public.firebaseAppId
    };
    const app = initializeApp(firebaseConfig);


  const database = getDatabase(app);
  return {
    provide: {
      firebaseApp: app,
      firebaseDb: database
    }
  }
});