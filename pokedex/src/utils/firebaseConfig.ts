import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2TdYzQuxmhcxwnWomeArGjN7qKICWgb4",
  authDomain: "pokedex-3d459.firebaseapp.com",
  projectId: "pokedex-3d459",
  storageBucket: "pokedex-3d459.appspot.com",
  messagingSenderId: "601433709393",
  appId: "1:601433709393:web:90e5ff423b67720c1e1170",
  measurementId: "G-3HQS0E5P58"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const pokemonListRef = collection(firebaseDB, "pokemonList");