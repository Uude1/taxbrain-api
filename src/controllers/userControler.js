const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {

    async create(req, res) {
        const { name, email, password } = req.body;
        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            res.status(400).json("Usuário já existe!");
        }

        try {
            const user = await UserModel.create({
                name,
                email,
                password,
            })
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json(error);
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(422).json({ msg: 'O email é obrigatório' });
        }

        if (!password) {
            return res.status(422).json({ msg: 'A senha é obrigatória' });
        }

        const user = await UserModel.findOne({ email: email });
        console.log(user)
        if (!user) {
            return res.status(404).json("Usuário não existe!");;
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json("E-mail ou senha inválidos!");
        }

        try {
            const secret = process.env.SECRET;
            const token = jwt.sign(
                {
                    id: user._id,
                },
                secret,
            );

            res.status(200).json({ msg: "Autenticação realizada com sucesso!", token, _id: user._id, name: user.name, email: user.email});
        } catch (error) {
            res.status(400).json({ msg: "Erro ao realizar autenticação." });
        }

    },

    async findUser(req, res) {
        const { id } = req.query;
        try {
            const user = await UserModel.findById(id);
            const response = {
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password
            }

            res.status(200).json(response);
        } catch (error) {
            res.status(400).json(error);
        }
    },

    async update(req, res) {
        const { id, name, email, password } = req.body;
    
        try {
            const user = await UserModel.findById(id);
    
            if (!user) {
                return res.status(404).json("Usuário não encontrado!");
            }
    
            if (name) {
                user.name = name;
            }
    
            if (email) {
                user.email = email;
            }
    
            if (password) {
                user.password = password;
            }
    
            const updatedUser = await user.save();
    
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json(error);
        }
    }
    

}


