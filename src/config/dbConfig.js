const mongoose = require('mongoose');

const { DATABASE_URL } = process.env;

const connection = mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = connection;