require("dotenv").config()

const jwt = require("jsonwebtoken")

const secret =process.env.SECRET_KEY;


// const verifyToken=(req,res,next)=>{


//     const authHeader=req.headers.authorization;
//      console.log(authHeader,"kkkk")

//     if(!authHeader||!authHeader.startsWith('Bearer')){
//         console.log("gg")

//        return res.status(401).json({error:"No Token provided"})

//     }

//  console.log(authHeader,"hed")
//     const token=authHeader.split(" ")[1];

//     try{
//         const decoded = jwt.verify(token,secret)
//         console.log(decoded,"hh")
//         req.user = decoded
//         next();

//     }catch{
//         return res.status(403).json({error:"Invalid or expired token"})
//     }

// }

const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ error: "Missing or invalid token" });
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token,secret, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      req.user = decoded;
      next();
    });
  };
  

const isAdmin =(req,res,next)=>{
  //  console.log(req,res,"jj",req.user.role)
    // if(req.user.role!=="user"){
    //     return res.status(403).json({error:"Admins only allowed"})
    // }
    next();
}

const isUser = (req, res, next) => {
    // console.log(req,res,"userrrrrr")
    console.log("req.user in isUser middleware:", req.user);
    // if (req.user.role !== "admin") {
    //     return res.status(403).json({ error: "Users only" });
    // }

    const tokenEmail = req.user.email;
    // const targetEmail = req.params.email || req.body.email;
    console.log("tokenEmail:", tokenEmail, "targetEmail:");

    // if (tokenEmail !== targetEmail) {
    //     return res.status(403).json({ error: "Unauthorized user access." });
    // }

    
    next();
};

module.exports={verifyToken,isAdmin,isUser}