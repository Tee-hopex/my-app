const express = require("express");
const route = express.Router();
const User = require('../models/');
// const uuid = require('uuid');
// const app = express()


// In-memory storage for users
// let users = [];

// Signup endpoint
route.post('/sign_up', async (req,res) => {
    const {username, password, email} = req.body;

    if (!username || !password || !email) {
        return res.status(400).send({'status':'Error', 'msg': 'Fill in your details'})
    }

    
    
    try{
        const checkUsername = await Completed.find({username: username}).lean();
    if (checkUsername.length > 0) {
        return res.status(400).send({'status':'error', msg: 'Username already exist, try another one'})
    }

        const user = new Completed;
        user.username = username;
        user.password = password;
        user.email = email;
        user.is_online = true
        await user.save();

        return res.status(200).send({'status': 'Success', 'msg': 'sign up successful', user})
    } catch (error) {
        console.error(error)
        return res.status(500).send({'status': 'error', 'msg': '' })
    }

    
})


// Login endpoint
route.post('/login', async (req, res) => {
    const {username,password } = req.body;
    if (!username || !password) {
        res.status(400).send({'status': 'error', 'msg': 'enter your username and password'})
    }

    // Find user by username
    try{
        const myprofile = await Completed.findOne({username:username, password:password});
        
    if (myprofile.password !== password || myprofile.username !== username) {
        res.status(400).send({'status': 'error', 'msg': 'Invalid username or password'})
    } else {res.status(200).send({'status': 'successful', 'msg': 'login successful', myprofile})}

    // const check = await Completed.findOne({username:username, password:password}).lean();
    // if (!check){
    //     console.log ("it worked")
    //     res.status(400).send({'msg': 'User does not exist'})
    // } 
        
    
    } catch (error) {
        return res.status(500).send({"status": "Error", "msg": "Error Occured from the server side"})
    }
    


    // Check if user exists and password matches
    // if (user && user.password === password) {
    //     res.json({ message: 'Login successful', user });
    // } else {
    //     res.status(401).json({ error: 'Invalid username or password' });
    // }
});

// View profile endpoint
// logout endpoint
// Edit profile endpoint
;

module.exports = route
