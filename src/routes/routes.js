const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const validateTokenJWT = require('../utils/validateToken');

const userController = require('../controllers/userControler');
const clientController = require('../controllers/ClientControler');
const incomeController = require('../controllers/IncomeController');

// Rota usuários
router.route("/users").post(userController.create);
router.route("/login").post(userController.login);
router.route("/user-location").get(userController.findUser);
router.route("/user-update").put(bodyParser.json(), userController.update);

// Rota clientes
router.route("/client-new").post(clientController.create);
router.route("/clients").get(clientController.read);
router.route("/clients/delete").delete(bodyParser.json(), clientController.delete);
router.route("/clients/update").put(bodyParser.json(), clientController.update);

// Rota Renda
router.route("/income").post(bodyParser.json(), incomeController.create)
router.route("/income/filter").post(bodyParser.json(), incomeController.getIncomesByClientAndPeriod)
router.route("/income/find-all").get(incomeController.findAll)
router.route("/income/delete").delete(incomeController.delete)


module.exports = router;

