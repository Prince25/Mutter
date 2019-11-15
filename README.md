# Mutter
Our mission is to bring people together through music and provide anyone a platform to express
themselves in their own music review blog. Become a music critic and see what others have to
say about top music.


### Technologies
* [React](https://reactjs.org/) - Frontend: JavaScript library for creating web apps!
* [node.js](http://nodejs.org) - evented I/O for the backend
* [Firebase](https://firebase.google.com/) - Backend: Database and Authorization
* [Jsdoc](https://devdocs.io/jsdoc/) - To help with documentation, we have used JSDoc


### Installation
Mutter requires [node.js](https://nodejs.org/) to run.
Clone repository, install the dependencies and start the server.

Clone and install dependencies
```sh
$ git clone git@gitlab.com:etanboga/cs130-mutter.git
$ cd cs130-mutter
$ npm install
```

Run Spotify Server
```sh
$ cd server
$ npm install
$ cd authorization_code
$ node app.js
```

Run Mutter
```sh
$ cd ../..
$ npm start
```


### Running Unit Tests
```sh
$ npm start
$ npm run s-test
```


### Todos
* Make App


### Team
* Aaron Van Doren
* Ka U Ieong
* Xiaoran Mei
* Prabhjot Singh
* Ege Tanboğa
* Fuwei Zhang


### Directory Structure
    .
    ├── ...
    ├── server      # Spotify Auhentication Server
    │   └── ...
    ├── src
    │   ├── components      # All frontend components used to display web pages 
    |   |   ├── ...
    |   |   ├── discover    # Discover Page
    |   |   ├── feed        # Feed Page
    |   |   ├── groups      # Groups Page
    |   |   ├── layout      # Splash and Navbar
    |   |   ├── profile     # Profile Page
    |   |   └── ...
    │   ├── config
    |   |   └── fbConfig.js # Firebase configuration
    │   ├── store
    |   |   ├── actions     # Backend methods used to communicate with Firebase
    |   |   |   ├── authActions.js  # User Authentication
    |   |   |   ├── groupActions.js # Groups Database
    |   |   |   ├── postActions.js  # Posts Database
    |   |   |   └── ...
    │   |   ├── reducers    # Backend reducers keeping track of state changes
    |   |   |   ├── authReducer.js  
    |   |   |   ├── groupReducer.js 
    |   |   |   ├── postReducer.js 
    |   |   |   ├── rootReducer.js  # Combines Other Reducers
    |   |   |   └── ...
    │   ├── App.js      # Main Component responsible for routing
    │   ├── index.css   # Main CSS File
    │   ├── loading.js  # Component That Displays While Page is Loading
    │   └── ...
    ├── test
    │   └── test.js # Unit Test Cases Using Selenium 
    ├── README.md   # This file
    └── ...

