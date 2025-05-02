import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from './FireBaseConfig';
const admin = require('firebase-admin');
admin.initializeApp();

//  Step 1: Generate custom UID like _01, _02...
const generateCustomUID = async () => {
  const counterDocRef = doc(db, 'counters', 'userUID');
  try {
    const newUID = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);

      if (!counterDoc.exists()) {
        transaction.set(counterDocRef, { currentUID: 1 });
        return '_01';
      }

      const currentUID = counterDoc.data().currentUID;
      const newUID = `_0${currentUID + 1}`;

      transaction.update(counterDocRef, {
        currentUID: increment(1),
      });

      return newUID;
    });

    return newUID;
  } catch (error) {
    console.error('Error generating custom UID:', error);
    throw error;
  }
};

// Step 2: Register user and store custom UID
export const registerUser = async (email, password, name, role = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const customUID = await generateCustomUID();

    // Save user data to 'users' collection
    await setDoc(doc(db, 'users_', user.uid), {
      uid: user.uid,
      customUID: customUID,           // Your custom-generated UID (e.g., _01)
      customUsername: name,           // User's name
      email,
      role,
    });

    // Save custom UID lookup
    await setDoc(doc(db, 'customUIDs', customUID), {
      firebaseUID: user.uid,
    });

    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

//  Step 3: Login user
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

//  Step 4: Logout user
export const logoutUser = () => {
  return signOut(auth);
};

//  Step 5: Get user data using custom UID
export const getUserByCustomUID = async (customUID) => {
  try {
    const customUIDDoc = await getDoc(doc(db, 'customUIDs', customUID));

    if (!customUIDDoc.exists()) {
      throw new Error('Custom UID not found');
    }

    const firebaseUID = customUIDDoc.data().firebaseUID;

    const userDoc = await getDoc(doc(db, 'users', firebaseUID));

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user by custom UID:', error);
    throw error;
  }
};

//  Step 6 (Optional): Get Firebase UID from Custom UID
export const getFirebaseUIDFromCustomUID = async (customUID) => {
  try {
    const docRef = doc(db, 'customUIDs', customUID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().firebaseUID;
    } else {
      throw new Error('Custom UID does not exist.');
    }
  } catch (error) {
    console.error('Error fetching Firebase UID from custom UID:', error);
    throw error;
  }
};

// Admin SDK: Set custom UID as custom claim
const setCustomUID = async (uid) => {
  try {
    const userDocRef = doc(db, 'users_01', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const customUID = userDoc.data().customUID;
      await admin.auth().setCustomUserClaims(uid, { customUID });
      console.log(`Custom UID set for user ${uid}: ${customUID}`);
    } else {
      console.error(`User with UID ${uid} not found`);
    }
  } catch (error) {
    console.error('Error setting custom UID:', error);
  }
};
