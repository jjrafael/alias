import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyB4eLZRhTMJbwCqbLDiwYnF2xPj8QTwLpI",
  authDomain: "chambr-play.firebaseapp.com",
  databaseURL: "https://chambr-play.firebaseio.com",
  projectId: "chambr-play",
  storageBucket: "chambr-play.appspot.com",
  messagingSenderId: "200436995068",
  appId: "1:200436995068:web:4871ccf8d3550a9f561879",
  measurementId: "G-YLM18Q8S20"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const baseURL = {
	users: firebase.firestore().collection('users'),
	apps: firebase.firestore().collection('apps'),
	rooms: firebase.firestore().collection('rooms'),
	events: firebase.firestore().collection('events'),
}

// Functions or utilities
export const functions = {
	timestamp: firebase.firestore.Timestamp,
	deleteFn: firebase.functions().httpsCallable('recursiveDelete')
}

export const collection = {
	users: 'users',
	apps: 'apps',
	rooms: 'rooms',
	events: 'events',
}

export default firebase;