const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcryptjs'); //allows for encrypting specific data
const jwt = require('jsonwebtoken'); // allows us to generate a new token from a given information entered

require('dotenv').config();

const User = require('../models/user');
const Post = require('../models/post')

const route = express.Router();

//endpoint for new post
route.post('/newPost', async (req,res)=>{
    const {post_url, post_text, token } = req.body;
    
    // check if post url was passed as the main criteria to make a post
    if (!post_url) {
        return res.status(400).send({'Status': 'Error', "msg": 'All field must be field',})
    }

    try {
        // verify the user making the post using the token passed from the front end guys
    const profile = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({_id:profile._id});
    

    // creating a new post document with the data entered
    const post = new Post();
    post.post_url = post_url;
    post.post_id = uuid.v1();
    post.post_text = post_text;
    post.username = user.username;
    post.user_id = user._id;
    post.user_img_url = user.user_img_url;
    post.comments = [];
    post.likes = [];
    post.timestamp = Date.now();  

    await post.save();

    await User.updateOne(
        {_id:user._id}, 
        {
            $push: {posts: post.post_id},
            $inc: {post_count: 1}
        },
    )
    return res.status(200).send({'status': 'success', 'msg':'User Post Updated Successfully', post})

    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})

// endpoint for liking a post
route.post('/likePost', async(req,res) => {
    const{post_id, token} = req.body;

    // check if required inputs are entered
    if (!token || !post_id){
        return res.status(400).send({'status': 'Error', 'msg': 'token required for action.'})
    }
    
    try{
        // verify token to get user details...
    const profile = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({_id:profile._id}); //retrieve user object using the user id 
    const post = await Post.findOne({post_id:post_id});  // retrieve post object using the post_url  

    if (!profile) return res.status(400).send({'msg': 'invalid token passed'}) //just incase the token passed is invalid
    if (!post) return res.status(400).send({'msg': 'invalid post_id passed'}) //just incase the post_id passed is invalid
    
    // check if the user has already liked the post
    const check = (post.likes).some((array)=>{
        return array === profile._id
    })  
               
    // if the user has not liked it before then update the like_count and likes else throw already liked
    if (check !== true){
        await Post.updateOne(
            {post_id:post.post_id},
            {
                $inc: {like_count: 1},
                $push: {likes: user._id}
            }
        )        
        res.status(200).send({'status': 'Success', 'msg': 'Success'} )
        
    } else {return res.status(400).send({'status': 'Error', 'msg': 'already liked this post ones'})        }
        
    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})

// endpoint for deleting a post
route.post('/deletePost', async(req,res)=>{
    const {post_id, token} = req.body;

    if(!post_id || !token){
        return res.status(400).send({'status': 'Error', 'msg': 'token required for action.'})
    }
    
    try{
        const profile = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findOne({_id : profile._id});
    const post = await Post.findOne({post_id:post_id});

    if (!post){
        return res.status(400).send({'status': 'error', 'msg': 'post does not exist'})
    }

    await Post.deleteOne({post_id:post.post_id});

    await User.updateOne(
        {_id:profile._id},
        {
            $pull: {posts: post_id},
            $inc: {post_count: -1}            
        }
    )
    return res.status(200).send({'Status': 'Success', "msg": 'Post has been deleted'})

    }  catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})




module.exports = route;