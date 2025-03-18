// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDfezD7cxwbkVO4oDoO64bFM21VNBh0kfY",
  authDomain: "when-4c75c.firebaseapp.com",
  projectId: "when-4c75c",
  storageBucket: "when-4c75c.firebasestorage.app",
  messagingSenderId: "854425111043",
  appId: "1:854425111043:web:e96a8d20ca411e9649dc36",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore and make it globally available
window.db = firebase.firestore();

console.log("Firebase initialized successfully");
