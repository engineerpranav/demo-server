let { User } = require("../database/User")

const jwt = require('jsonwebtoken')

const { config } = require("../config/config")
const axios=require('axios');

function generateToken(user) {

    
    const { _id, name, email, image } = user;

    return jwt.sign({

        _id, name, email, image

    }, config.JWT_SECRET)
}

async function register(req, res) {
    

    try {

        const { name, email, password } = req.body;

        if(!name || !email || !password){

            return res.status(400).send({
                error:"Incomplete data" 
            })
        }

        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).send({
                error: "User With email already exists   "
            })
        }

        user = await User.create({ name, email, password })

        res.send('Register Succesful')


    } catch (err) {

        return res.status(500).send({
            error: 'Something went wrong'
        })

    }

}
async function login(req, res) {

    try {
        const { email, password } = req.body;
        console.log(email, password);
        let user = await User.findOne({ email })
        console.log(user);

        if (!user) {
            return res.status(400).send({
                error: "User With email does not exists"
            })
        }

        if (user.password !== password) {
            return res.status(400).send({
                error: "Wrong Password"
            })

        }

        const token = generateToken(user);
        const {_id,name,image}=user;    
         

        return res.send({
            message: 'Login Successful',
            data: {
                token,
                user:{
                _id,name,email,image
            }
            }
        })



    } catch (err) {

        return res.status(500).send({
            error: 'Something went wrong'
        })

    }

}
async function signinWithGithub(req, res) {

    try { 
        console.log(1)

        const code=req.params.code;
        
        console.log(code);
        console.log(config.client_id);
        console.log(config.client_secret);
      


        // exchange code with token

        const url=`https://github.com/login/oauth/access_token`;

       let response=await axios.post(url,null,{

        params:{
            
            client_id:config.client_id,
            client_secret:config.client_secret,
            code:code

        },
        headers:{
            'Accept':'application/json'
        }

        });


        let accessToken=response.data.access_token;

        if(!accessToken)
        {
            console.log(response.data);
            throw new Error('Something went wrong')
        }
       

        let url2=`https://api.github.com/user`;

        response=await axios.get(url2,{
            headers:{
                'authorization':`Bearer ${accessToken}`
            }
        });
      
        const user=response.data;

        let existingUser=await User.findOne({
            signinMethod:'github-oauth',
            githubUsername:user.login
        });
        
        if(!existingUser){
            existingUser=await User.create({
                name:user.name,
                email:user.email,
                image:user.avatar_url,
                signinMethod:'github-oauth',
                githubUsername:user.login
            })
        }

        const token = generateToken(existingUser);
        const {_id,name,email,image}=existingUser;    
         

        return res.send({
            message: 'Login With Github Successful',
            data: {
                token,
                user:{
                _id,name,email,image
            }
            }
        })

    } catch (err) {

        return res.status(500).send({
            error: 'Something went wrong'
        })

    }

}
async function getLoggedInUser(req, res) {
 
  try{
    const user=req.user;

    return res.send({
        data:user
    })

  }
  catch(err){

  res.status(500).send({
    error:'Something Went Wrong'
  })

  }

}

module.exports = {

    register,
    login,
    signinWithGithub,
    getLoggedInUser

}