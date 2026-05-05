// Cole aqui suas configuraçoes de conexão do firebase

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "Exemplo",
    authDomain: "Exemplo",
    projectId: "Exemplo",
    storageBucket: "Exemplo",
    messagingSenderId: "Exemplo",
    appId: "Exemplo"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }

