const mongoose = require('mongoose');

const clientDataSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
    telephone: {
        type: String,
    },
    cpf: {
        type: String,
        required: true,
    },
});

const Client = mongoose.model('Clients', clientDataSchema);

module.exports = Client;