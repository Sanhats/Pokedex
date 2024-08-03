import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhXBqIRE5AKclG6BcXBpMTDX_r4krEaR0",
  authDomain: "pokedexfb.firebaseapp.com",
  projectId: "pokedexfb",
  storageBucket: "pokedexfb.appspot.com",
  messagingSenderId: "196460015984",
  appId: "1:196460015984:web:1831531d0b4c7893fbdfb5",
  measurementId: "G-LVBG19HQGY"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const pokemonListRef = collection(firebaseDB, "pokemonList");