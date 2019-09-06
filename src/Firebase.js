import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/database';

//alias-2399d firebase config
const firebaseConfig = {
    apiKey: "AIzaSyANK72PRG_bYJRIHXBghfDpeovTzB9HEQs",
    authDomain: "alias-2399d.firebaseapp.com",
    databaseURL: "https://alias-2399d.firebaseio.com",
    projectId: "alias-2399d",
    storageBucket: "alias-2399d.appspot.com",
    messagingSenderId: "1034482005991",
    appId: "1:1034482005991:web:4bbd88b1426bf91c"
};

//aliasdecks firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyCDom3zNrokLi_x-OzFF5FHyzjEJo-wnD8",
//   authDomain: "aliasdecks.firebaseapp.com",
//   databaseURL: "https://aliasdecks.firebaseio.com",
//   projectId: "aliasdecks",
//   storageBucket: "aliasdecks.appspot.com",
//   messagingSenderId: "216179747976",
//   appId: "1:216179747976:web:09215a6a11ee60ec1fc33d"
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const baseURL = {
	users: firebase.firestore().collection('users'),
	app: firebase.firestore().collection('app'),
	games: firebase.firestore().collection('games'),
	decks: firebase.firestore().collection('decks'),
	teams: firebase.firestore().collection('teams'),
	db: firebase.database(),
}

export const collection = {
	users: 'users',
	app: 'app',
	games: 'games',
	decks: 'decks',
	teams: 'teams',
}

export default firebase;