const jwt = require('jsonwebtoken');
require('../config/config')
require('colors')

const verificarAcceso = async (req, res, next) => {
    try {
      //  console.log('Estoy en el middleware');
    const token = req.get('token')
    if(!token){
        return res.status(400).json({
            ok:false,
            msg:'NO se recibio un token valido',
            cont:{
                token
            }
        })
    }
    
    jwt.verify(token,process.SEED,(err,decode)=>{
        if(err){
           return res.status(400).json({
               ok:false,
               msg: err.name == "JsonWebTokenError" ? ' El token es invalido' : ' El token Expiro',
               cont: {
                   token
               }
           })
        }
        console.log(decode);
        next();
    })
    
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
           msg: 'Error en el servidor',
           cont: {
             error
           }
         }) 
    }
}

module.exports = { verificarAcceso}