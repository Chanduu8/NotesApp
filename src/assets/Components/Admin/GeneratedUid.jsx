// import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
// import { db } from '../../../auth/FireBaseConfig'; // Make sure your Firebase config is set up

// // Generate custom UID
// const generateCustomUID = async () => {
//   // Reference to the counter document
//   const counterDocRef = doc(db, 'counters', 'userUID');

//   try {
//     // Get the current counter value
//     const counterDoc = await getDoc(counterDocRef);

//     if (counterDoc.exists()) {
//       // If the document exists, increment the counter and generate the UID
//       const currentUID = counterDoc.data().currentUID;
//       const newUID = `_0${currentUID + 1}`;

//       // Update the counter in Firestore
//       await updateDoc(counterDocRef, {
//         currentUID: increment(1), // Increment by 1 for the next user
//       });

//       return newUID;
//     } else {
//       // If no counter document exists, create one with initial value
//       await updateDoc(counterDocRef, {
//         currentUID: 1, // Starting at 1
//       });
//       return '_01';
//     }
//   } catch (error) {
//     console.error('Error generating custom UID:', error);
//     throw error;
//   }
// };
// export default {generateCustomUID};


import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../auth/FireBaseConfig'; // Make sure your Firebase config is set up

// Generate custom UID
const generateCustomUID = async () => {
  // Reference to the counter document
  const counterDocRef = doc(db, 'counters', 'userUID');

  try {
    // Get the current counter value
    const counterDoc = await getDoc(counterDocRef);

    if (counterDoc.exists()) {
      // If the document exists, increment the counter and generate the UID
      const currentUID = counterDoc.data().currentUID;
      const newUID = `_0${currentUID + 1}`.slice(-3); // Ensure the UID is always 3 characters, like _01, _02, etc.

      // Update the counter in Firestore
      await updateDoc(counterDocRef, {
        currentUID: increment(1), // Increment by 1 for the next user
      });

      return newUID;
    } else {
      // If no counter document exists, create one with initial value
      await updateDoc(counterDocRef, {
        currentUID: 1, // Starting at 1
      });
      return '_01';
    }
  } catch (error) {
    console.error('Error generating custom UID:', error);
    throw error;
  }
};

export default generateCustomUID ;
