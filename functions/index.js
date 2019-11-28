const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello, Mutterers!");
});


const createNotification = notification => admin.firestore().collection('notifications')
  .add(notification)
  .then(doc => console.log('Notification added!', doc));


exports.projectCreated = functions.firestore
  .document('projects/{projectId}')
  .onCreate((doc) => {
    const project = doc.data();
    const notification = {
      content: 'added a new project',
      user: `${project.author}`,
      time: admin.firestore.FieldValue.serverTimestamp(),
    };

    return createNotification(notification);
  });


exports.userJoined = functions.auth.user()
  .onCreate(user => admin.firestore().collection('users')
    .doc(user.uid).get()
    .then((doc) => {
      const newUser = doc.data();
      const notification = {
        content: 'has joined',
        user: `${newUser.name}`,
        id: `${user.uid}`,
        time: admin.firestore.FieldValue.serverTimestamp(),
      };

      return createNotification(notification);
    }));

