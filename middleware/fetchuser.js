import jwt from 'jsonwebtoken';
const JWT_SECRET = "Harryisagoodb$oy";


const fetchuser = (req,res,next)=>{
    //get the user form JWT token and add id to req  object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
    }

    try{
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).send({error:"Please authenticate using valid token"})
    }
}

export default fetchuser;




