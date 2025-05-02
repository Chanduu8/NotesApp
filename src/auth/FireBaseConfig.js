// // FireBaseConfig.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Your Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyDL-G_P0fyros3jqf6CT_TV19aQsMY3nDY",
//   authDomain: "project-1-77b74.firebaseapp.com",
//   projectId: "project-1-77b74",
//   storageBucket: "project-1-77b74.firebasestorage.app",
//   messagingSenderId: "1017927317373",
//   appId: "1:1017927317373:web:6329ded7d7b46b690dbe14",
//   measurementId: "G-8G0H28P9KW"
// };

// // Main app instance
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // 🔄 Secondary app instance to avoid auto-login after creating user
//  export const secondaryApp = initializeApp(firebaseConfig, "Secondary");
// export const secondaryAuth = getAuth(secondaryApp);

// export default app;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDL-G_P0fyros3jqf6CT_TV19aQsMY3nDY",
  authDomain: "project-1-77b74.firebaseapp.com",
  projectId: "project-1-77b74",
  storageBucket: "project-1-77b74.firebasestorage.app",
  messagingSenderId: "1017927317373",
  appId: "1:1017927317373:web:6329ded7d7b46b690dbe14",
  measurementId: "G-8G0H28P9KW"
};

// Main app instance
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
