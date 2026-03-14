export const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? 'AIzaSyBrsyiDDfjU_scnLkw1bQZzNEcG5LXKSAE',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? 'studio-2501373231-a63f6.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? 'studio-2501373231-a63f6',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? 'studio-2501373231-a63f6.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '868086002133',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? '1:868086002133:web:77c75ae83fb2ff2c0d8d5c',
};
