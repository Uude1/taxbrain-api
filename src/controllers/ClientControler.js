const ClientModel = require('../models/ClientModel');
const IncomeModel = require("../models/IncomeModel");

require('dotenv').config();

module.exports = {

    async create(req, res) {
        const { name, email, telephone, cpf } = req.body;
        const clientExists = await ClientModel.findOne({ email, cpf });

        if (clientExists) {
            return res.status(400).json("Cliente já existe!");
        }

        try {
            const client = await ClientModel.create({
                name,
                email,
                telephone,
                cpf
            });
            res.status(201).json(client);
        } catch (error) {
            res.status(400).json(error);
        }
    },

    async read(req, res) {
        try {
            const clients = await ClientModel.find({});
            res.status(200).json(clients);
        } catch (error) {
            res.status(400).json(error);
        }
    },

    async delete(req, res) {
        try {
            const { ids } = req.body;

            const result = await ClientModel.deleteMany({ _id: { $in: ids } });

            const resultIncome = await IncomeModel.deleteMany({ client: { $in: ids } });

            if (result.deletedCount === 0) {
                res.status(404).send('Clientes não encontrados');
                return;
            }
            res.send('Clientes excluídos com sucesso');
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },

    async update(req, res) {
        try {
            const { _id, name, email, telephone, cpf } = req.body;

            const client = await ClientModel.findByIdAndUpdate(_id, {
                name: name,
                email: email,
                telephone: telephone,
                cpf: cpf
            });

            if (!client) {
                return res.status(404).send('Client not found');
            }
            res.send('success updated');
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
}