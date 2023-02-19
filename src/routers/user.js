const express = require('express');
const User = require('../models/user.js');
const auth = require('../middleware/auth');
const verifyRoles = require('../middleware/verifyRoles.js');

const router = new express.Router();

router.get('/', (req, res) => {
    if(req.cookies.token){
        return res.redirect('/user/home');
    }

    res.render('index');
});

router.get('/edit/:id', auth, verifyRoles('admin', 'manager'), async (req, res) => {
    const _id = req.params.id;

    const user = await User.findOne({ _id }).exec();

    res.render('editUser', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: (req.user.role === 'admin') ? true : false
    });
});

router.get('/updatePassword', auth, async (req, res) => {
    res.render('updatePassword', {
        updatePassword: true
    });
});

router.patch('/updatePassword', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).exec();
        user.password = req.body.password;
        await user.save();
        res.send();
    } catch (error) {
        res.status(404).send({ 'Error': error.message });
    }
});

router.get('/info', auth, verifyRoles('admin', 'manager', 'employee'), async (req, res) => {
    if(req.user.role === 'admin'){
        const users = await User.find({ role: ['manager', 'employee'] }).exec();
        return res.status(200).render('home', {
            home: true,
            name: req.user.name,
            user: users,
            admin: true
        });
    }

    if(req.user.role === 'manager'){
        const users = await User.find({ role: 'employee'}).exec();
        return res.status(200).render('home', {
            home: true,
            name: req.user.name,
            user: users,
            manager: true
        });
    }

    const user = await User.findOne({ _id: req.user._id }).exec();
    res.status(200).render('employee', {
        name: user.name,
        email: user.email,
        role: user.role
    });
});

router.patch('/updateInfo/:id', auth, verifyRoles('admin', 'manager'), async (req, res) => {
    try {
        const id = req.params.id;
        const updates = Object.keys(req.body);

        const allowedUpdates1 = ['name', 'email', 'role'];
        const allowedUpdates2 = ['name', 'email'];
        const allowedUpdates = (req.user.role === 'admin') ? allowedUpdates1 : allowedUpdates2;

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if(!isValidOperation){
            throw new Error('Invalid Updates!');
        }

        const user = await User.findOne({ _id: id }).exec();
        
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(404).send({ 'Error': error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        req.user = user;
        res.cookie('token', 'Bearer ' + token);
        res.status(200).send();
    } catch (error) {
        if(error.message === 'Email is not registered!')
            res.status(404).send({ 'Error': error.message });
        else
            res.status(400).send({ 'Error': error.message });
    }
});

router.get('/createUser', auth, (req, res) => {
    res.render('createUser');
});

router.post('/createUser', auth, verifyRoles('admin'), async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();
        res.redirect('/user/info');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send('Some Error!');
    }
});

router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send('Some Error!');
    }
});

router.delete('/deleteuser/:id', auth, verifyRoles('admin'), async (req, res) => {
    try {
        const _id = req.params.id;

        const user = await User.findOne({ _id});

        if(!user){
            return res.status(404).send();
        }

        await user.remove();
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;