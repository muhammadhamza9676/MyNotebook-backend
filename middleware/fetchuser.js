var jwt = require('jsonwebtoken');
const JWT_sec = "ABC123";

const fetchuser = (req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Invalid Token"});
    }
    try {
        const data = jwt.verify(token,JWT_sec);
    req.user = data.user;
    next();
    } catch (error) {
        res.status(401).send({error: "Invalid Token"});
    }
   
}
module.exports = fetchuser;