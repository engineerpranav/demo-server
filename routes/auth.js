const express =require("express");

const {register, login, getLoggedInUser, signinWithGithub}=require("../Controller/auth");
const { auth } = require("../Middlewares/auth");

const authRouter=express.Router();
 
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/github-signin/:code',signinWithGithub);

authRouter.get('/loggedInUser',auth,getLoggedInUser);

module.exports=authRouter;

