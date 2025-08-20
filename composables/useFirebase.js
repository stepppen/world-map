// ~/composables/useFirebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

let firebaseApp = null;
let firebaseDb = null;

export const useFirebase = () => {
  if (!firebaseApp || !firebaseDb) {
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

    firebaseApp = initializeApp(firebaseConfig);
    firebaseDb = getDatabase(firebaseApp);
  }

  return {
    app: firebaseApp,
    database: firebaseDb
  };
};