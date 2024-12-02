const mongoose = require('mongoose'); 
const FootballData = require('./footballSchema'); 
const MONGO_URI = 'mongodb://localhost:27017/coursework';

mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', function(err) {
    console.log("Error occurred during connection: " + err);
});

db.once('connected', function() {
    console.log(`Connected to ${MONGO_URI}`); 
});

module.exports = db;
