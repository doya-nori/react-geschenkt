import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCzBp4T92d9hd3iVlwneNfKdA9jKAZLOCs",
    authDomain: "tsuchiya-no-game.firebaseapp.com",
    databaseURL: "https://tsuchiya-no-game.firebaseio.com",
    projectId: "tsuchiya-no-game",
    storageBucket: "tsuchiya-no-game.appspot.com",
    messagingSenderId: "125304387542",
    appId: "1:125304387542:web:deac473f1c1b1e3100d677",
    measurementId: "G-3STTQ4BZVB"
};

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()

export const loginGoogle = () => {
    let provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithRedirect(provider)
}

export const logout = () => {
    auth.signOut()
}