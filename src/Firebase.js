import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyANK72PRG_bYJRIHXBghfDpeovTzB9HEQs",
    authDomain: "alias-2399d.firebaseapp.com",
    databaseURL: "https://alias-2399d.firebaseio.com",
    projectId: "alias-2399d",
    storageBucket: "alias-2399d.appspot.com",
    messagingSenderId: "1034482005991",
    appId: "1:1034482005991:web:4bbd88b1426bf91c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const baseURL = {
	users: firebase.firestore().collection('users'),
	app: firebase.firestore().collection('app'),
	games: firebase.firestore().collection('games'),
	decks: firebase.firestore().collection('decks'),
	teams: firebase.firestore().collection('teams') 
}

export default firebase;