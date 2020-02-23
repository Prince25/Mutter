import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBMD75FP14e3VvxTRllOrc26K9vds7WHBs",
  authDomain: "runtime-terror-web.firebaseapp.com",
  databaseURL: "https://runtime-terror-web.firebaseio.com",
  projectId: "runtime-terror-web",
  storageBucket: "runtime-terror-web.appspot.com",
  messagingSenderId: "714361214200",
  appId: "1:714361214200:web:81690bccecf7b7ce18570d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase