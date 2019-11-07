import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDVV6yNQpJCOy3j4WBpdeKD2QRDldQ-bBY",
  authDomain: "mutter-ucla.firebaseapp.com",
  databaseURL: "https://mutter-ucla.firebaseio.com",
  projectId: "mutter-ucla",
  storageBucket: "mutter-ucla.appspot.com",
  messagingSenderId: "603613146271",
  appId: "1:603613146271:web:2af294a94d1bc6745c46aa",
  measurementId: "G-N54TCZ0F8J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase