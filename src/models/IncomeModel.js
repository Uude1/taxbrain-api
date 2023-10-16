const mongoose = require('mongoose');

const IncomeDataSchema = new mongoose.Schema({

    fixedIncome: {
        type: Number,
        required: true,
    },
    extraIncome: {
        type: Number,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clients",
        required: true,
    },
    month: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} must be an integer.',
        },
    },
    year: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} must be an integer.',
        },
    },
    monthYear: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} must be an integer.',
        },
    },
    inssDiscount: {
        type: Number,
    },
    irDiscount: {
        type: Number,
    },
    totalDiscount: {
        type: Number,
    },
    netIncome: {
        type: Number,
    },

});

const Income = mongoose.model('Income', IncomeDataSchema);

module.exports = Income;