//Imports
const express = require('express');
const router = express.Router();

//Models
const User = require('../models/User');
const Admin = require('../models/Admin');


//Routes
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.render('register', { error: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render('register', { error: 'El correo ya está registrado' });
    }

    const newUser = new User({ fullname, email, password });
    await newUser.save();

    req.session.user = newUser;
    res.redirect('/');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });
    const account = user || admin;

    if (!account || !(await account.matchPassword(password))) {
        return res.render('login', { error: 'Correo o contraseña incorrectos' });
    }
    req.session.user = {
        _id: account._id,
        fullname: account.fullname,
        email: account.email,
        role: admin ? 'admin' : 'user'
    };

    if (admin) {
        return res.redirect('/dashboard'); 
    }

    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});


module.exports = router;
