let { User } = require("../database/User")

const jwt = require('jsonwebtoken')

const { config } = require("../config/config")


async function auth(req,res,next){
    console.log(1);

    const authorization = req.headers['authorization'];

     
    if (authorization) {

        const token = authorization.split(' ').pop();
 
        if (token) {

            try {
                jwt.verify(token, config.JWT_SECRET)

            } catch (err) {

              return res.status(401).send({
                  message: 'Invalid Token Provided'
              })

            }
          
              let user=jwt.decode(token)

              user=await User.findById(user._id);

             
              user=user.toJSON();


              delete user.password;

               req.user=user;

               next();
        }
        else {

            return res.status(401).send({
                message: 'No Auth Token Present'
            })
    
        }

    }

    else {

        return res.status(401).send({
            message: 'User is not LoggedIn'
        })

    }

}
module.exports={
    auth
}