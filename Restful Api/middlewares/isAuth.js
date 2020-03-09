const Jwt = require('jsonwebtoken');
const secret = 'MoviesSecretAndItIsSoLong';
//token must be included in each header of any request as value of key Authorization
//Bearer <the Token>

module.exports = (req,res,next) => {
    const token = req.get('Authorization').split(' ')[1];
    const authHeader = req.get('Authorization').split(' ')[1];
    let decodedToken;

    if(!authHeader){
        const error = new Error('Not Authenticated');
        error.statusCode=401;
        throw error;
    }
    console.log("Auth Token",authHeader);
    try{
        decodedToken = Jwt.verify(token,secret);
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not Authenticated');
        error.statusCode=401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}