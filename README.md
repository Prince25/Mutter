# Mutter
Our mission is to bring people together through music and provide anyone a platform to express
themselves in their own music review blog. Become a music critic and see what others have to
say about top music.


### Technologies
* [React](https://reactjs.org/) - Frontend: JavaScript library for creating web apps!
* [node.js](http://nodejs.org) - evented I/O for the backend
* [Firebase](https://firebase.google.com/) - Backend: Database and Authorization
* [Jsdoc](https://devdocs.io/jsdoc/) - Documentation
* [Selenium](https://selenium-python.readthedocs.io/) - Unit Testing


### Installation
Mutter requires [node.js](https://nodejs.org/) to run.
Clone repository, install the dependencies and start the server.

Clone and Run the Script
```sh
$ git clone https://github.com/PrinceS25/Mutter.git
$ cd cs130-mutter
$ ./run.sh
```

**OR**

Clone and install dependencies
```sh
$ git clone https://github.com/PrinceS25/Mutter.git
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


### Running Unit Tests Using Python Selenium
This test requires [Chromedriver](https://chromedriver.chromium.org/downloads) and [Chrome](https://www.google.com/chrome/) to be installed on your machine 
```sh
$ pip install selenium
$ cd test
$ python MutterTest.py
```
### Running JavaScript Unit Tests
The unit tests are specific for Spotify API, you need to fetch the response from Spotify offical console, the access token needs to be replaced with the up-to-date one. There are 5 test files totally. Use the same commands, just change file names.
```sh
$ cd test
$ node Stest.js
```


### Team
* Aaron Van Doren
* Ka U Ieong
* Xiaoran Mei
* Prabhjot Singh
* Ege Tanboğa
* Fuwei Zhang


### Directory Structure
    CS130-Mutter
    ├── ...
    ├── server      # Spotify Auhentication Server
    │   └── ...
    ├── src
    │   ├── components      # All frontend components used to display web pages 
    |   |   ├── ...
    |   |   ├── discover            # Discover Page
    |   |   ├── feed                # Feed Page
    |   |   ├── groups              # Groups Page
    |   |   ├── layout              # Splash and Navbar
    |   |   ├── profile             # Profile Page
    |   |   ├── home.js             # Home Page
    |   |   ├── notifications.js    # Handles notifications on the home page
    |   |   └── ...
    │   ├── config
    |   |   └── fbConfig.js # Firebase configuration
    │   ├── store
    |   |   ├── actions     # Backend methods used to communicate with Firebase
    |   |   |   ├── authActions.js  # User Authentication
    |   |   |   ├── groupActions.js # Groups Database
    |   |   |   └── postActions.js  # Posts Database
    │   |   ├── reducers    # Backend reducers keeping track of state changes
    |   |   |   ├── authReducer.js  
    |   |   |   ├── groupReducer.js 
    |   |   |   ├── postReducer.js 
    |   |   |   └── rootReducer.js  # Combines Other Reducers
    │   ├── App.js      # Main Component responsible for routing
    │   ├── index.css   # Main CSS File
    │   ├── loading.js  # Component That Displays While Page is Loading
    │   └── ...
    ├── test
    │   └── MutterTest.py # Python Unit Tests Using Selenium 
    ├── README.md   # The file you are currently reading 
    ├── run.sh      # Script used to easily launch Mutter
    └── ...
