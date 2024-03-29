const {sign, verify} = require ('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = sign({name: user.name}, "SECRET")
    return accessToken;
}
const validateToken = (req,res, next) =>{
    const accessToken = req.cookies['accessToken']
    console.log(accessToken);
    if (!accessToken) return res.status(400).json({error: 'User not Authenticated'});
    try{
        const validToken = verify(accessToken, "SECRET");
        if (validToken){
            req.authentificated = true;
            return next();
        }
    }
    catch(err){
        return res.status(400).json({error:error});
    }
} 
module.exports = {createTokens, validateToken};
