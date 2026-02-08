// Firebase Configuration
// Keys are public (from .env.local), but typically you'd secure usage via Firebase Console rules.
// For this static site demo, we expose them directly.

const firebaseConfig = {
    apiKey: "AIzaSyDjSZdJXhHH1LcSUETNuTJFPfA2aYqD_04",
    authDomain: "debate-forge.firebaseapp.com",
    projectId: "debate-forge",
    storageBucket: "debate-forge.firebasestorage.app",
    messagingSenderId: "622218745975",
    appId: "1:622218745975:web:72273428a965d4004d0e72"
};

// Initialize Firebase (will be called in auth.js)
// We rely on the global 'firebase' object from the CDN scripts.
