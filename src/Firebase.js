import * as firebase from 'firebase';

var firebaseConfig = {
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

export default firebase;