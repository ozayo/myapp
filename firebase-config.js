import { initializeApp } from 'firebase/app';
import { 
  signInWithEmailAndPassword, 
  initializeAuth, 
  getReactNativePersistence, 
  createUserWithEmailAndPassword,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore'; // Firestore işlevleri için ek import
import { getStorage } from 'firebase/storage'; // Storage modülü
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'; // Platformu kontrol etmek için ekleyin


// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_API_KEY,
//   authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBkTjDm1BNg32Mrm3g721c9-Gz8sj6KHOY",
  authDomain: "myapp-609f2.firebaseapp.com",
  projectId: "myapp-609f2",
  storageBucket: "myapp-609f2.appspot.com",
  messagingSenderId: "542319139206",
  appId: "1:542319139206:web:4eeeb4028a25d8ccaa3407"
};

const app = initializeApp(firebaseConfig);

// Auth'ı kalıcı bir şekilde başlat
// Auth'ı başlatırken platform kontrolü ekleyin
const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' ? browserLocalPersistence : getReactNativePersistence(AsyncStorage), 
});

const db = getFirestore(app);
const storage = getStorage(app); // Firebase Storage nesnesi oluşturulur

// Yeni kullanıcıları kaydetme fonksiyonu, ek bilgilerle genişletilmiş
export const registerWithEmailPassword = async (email, password, username, fullName, location) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered: ", userCredential.user);

    // Firestore'a kullanıcı ek bilgilerini kaydet
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username,
      fullName,
      location,
      email,  // Email adresini de kaydediyoruz
      admin: false // Varsayılan admin durumunu false olarak ekle
    });

    return userCredential;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;  // Hata yönetimi için hatayı fırlat
  }
};

export const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in: ", userCredential.user);
    return userCredential;
  } catch (error) {
      console.error("Error logging in: ", error);
      throw error;  // Hata yönetimi için hatayı fırlat
  }
};

export { auth, db, storage, doc, setDoc, updateDoc }; // Storage nesnesi dışa aktarılır