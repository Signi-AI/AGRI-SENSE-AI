import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAsph7BIikUM2HHX6lMfVCSBHkv9n7ZY5s',
  authDomain: 'agri-sense-ai.firebaseapp.com',
  projectId: 'agri-sense-ai',
  storageBucket: 'agri-sense-ai.firebasestorage.app',
  messagingSenderId: '228291788370',
  appId: '1:228291788370:web:150bd571894dc98e89698b',
  measurementId: 'G-E92BZG0VYD',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export default app