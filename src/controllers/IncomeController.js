const IncomeModel = require("../models/IncomeModel");
const ClientModel = require("../models/ClientModel");
require('dotenv').config();

module.exports = {

    async create(req, res) {
        const { fixedIncome, extraIncome, client, month, year } = req.body;
        const clientId = await ClientModel.findById(client);

        if (!clientId) {
            return res.status(400).json({ error: 'Cliente não encontrado!' });
        }

        function INSSCalculate(salario) {
            if (salario <= 1320) {
                return salario * 0.075;
            } else if (salario <= 2571.29) {
                return salario * 0.09 - 19.8;
            } else if (salario <= 3856.94) {
                return salario * 0.12 - 96.94;
            } else if (salario <= 7507.49) {
                return salario * 0.14 - 174.08;
            } else {
                return 1051.41; // Valor máximo de contribuição do INSS em 2023
            }
        }

        function IncomeCalculate(salario) {
            const inss = INSSCalculate(salario);
            const rendaLiquida = salario - inss;

            return {
                salario: salario,
                inss: inss,
                rendaLiquida: rendaLiquida,
            };
        }

        const salario = fixedIncome; // Valor do salário bruto
        const resultado = IncomeCalculate(salario);

        // console.log("Salário: R$", resultado.salario.toFixed(2));
        // console.log("INSS: R$", resultado.inss.toFixed(2));
        // console.log("Renda Líquida: R$", resultado.rendaLiquida.toFixed(2));

        function IRRFCalculate(salario) {

            const aliquotas = [0, 0.075, 0.15, 0.225, 0.275];    // aliquotas de IR
            const bases = [2112.00, 2826.65, 3751.06, 4664.68, Infinity]; // bases de calculo

            // calcula tamanho das faixas de tributacao conforme salario
            const faixas = bases.map(function (b, i, arr) {

                // a faixa atual eh no maximo o valor da base de calculo
                var faixa = Math.min(salario, b)

                // se a base nao for a primeira, precisamos subtrair o valor da base anterior
                if (i !== 0) {
                    faixa -= arr[i - 1];
                }

                // bases maiores que salario podem resultar em faixas negativas, por isso zeramos essas
                faixa = Math.max(faixa, 0);

                return faixa;
            });

            // calcula imposto conforme a aliquota de cada faixa e soma ao valor total
            const imposto = faixas.reduce(function (sum, f, i) {
                // calcula imposto da faixa multiplicando sua aliquota
                const impFaixa = (f * aliquotas[i]);
                return sum += impFaixa;
            }, 0);

            // imposto a pagar sobre rendimentos
            return imposto;
        }

        try {
            const inssDiscount = parseFloat(resultado.inss.toFixed(2));
            const irDiscount = parseFloat(IRRFCalculate(resultado.rendaLiquida.toFixed(2) + extraIncome));
            const netIncome = fixedIncome - (inssDiscount + irDiscount);
            const totalDiscount = inssDiscount + irDiscount;
            const monthYear = year * 100 + month;

            const income = await IncomeModel.create({
                fixedIncome,
                extraIncome,
                client,
                month,
                year,
                monthYear: monthYear,
                inssDiscount: inssDiscount,
                irDiscount: irDiscount,
                totalDiscount: totalDiscount,
                netIncome: netIncome,
            });

            res.status(201).json(income);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    },

    async findAll(req, res) {
        try {
            const incomes = await IncomeModel.find({}).populate('client', 'name');

            const response = incomes.map(income => {
                let name = income.client.name;
                return {
                    _id: income._id,
                    clientName: name,
                    fixedIncome: income.fixedIncome,
                    extraIncome: income.extraIncome,
                    month: income.month,
                    year: income.year,
                    inssDiscount: income.inssDiscount,
                    irDiscount: income.irDiscount,
                    totalDiscount: income.totalDiscount,
                    netIncome: income.netIncome,
                };
            });

            res.status(200).json(response);
        } catch (error) {
            res.status(400).json(error);
        }
    },

    async getIncomesByClientAndPeriod(req, res) {
        const { client, startDate, endDate } = req.body;
        const clientId = await ClientModel.findById(client);

        if (!clientId) {
            return res.status(400).json({ error: 'Cliente não encontrado!' });
        }
        try {
            const incomes = await IncomeModel.find({
                client: clientId,
                $and: [
                    { monthYear: { $gte: parseInt(startDate) } },
                    { monthYear: { $lte: parseInt(endDate) } }
                ]
            }).populate('client', 'name');

            const response = incomes.map(income => {
                let name = income.client.name;
                return {
                    _id: income._id,
                    clientName: name,
                    fixedIncome: income.fixedIncome,
                    extraIncome: income.extraIncome,
                    month: income.month,
                    year: income.year,
                    inssDiscount: income.inssDiscount,
                    irDiscount: income.irDiscount,
                    totalDiscount: income.totalDiscount,
                    netIncome: income.netIncome,
                };
            });


            res.status(200).json(response);
        } catch (error) {
            res.status(400).json(error);
        }
    },

    async delete(req, res) {
        const { ids } = req.body;
        try {
            const result = await IncomeModel.deleteMany({ _id: { $in: ids } });
            if (result.deletedCount === 0) {
                res.status(404).send('Renda não encontrada');
                return;
            }
            res.send('Valores excluídos com sucesso');
        } catch (error) {
            res.status(500).send(error);
        }
    },

};
