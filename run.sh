
# Runs the Spotify server and then Mutter
cd server && npm install
cd authorization_code && node app.js &
cd .. && npm install
npm start
