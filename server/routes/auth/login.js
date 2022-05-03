const { json } = require('express');
const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../../config/config')

app.post('/login',async (req,res)=> {
    try {
        const strEmail = req.body.strEmail;
        const strContrasena = req.body.strContrasena;
        if(!strEmail || !strContrasena){
            return res.status(400).json({
                ok:false,
                msg:!strEmail && !strContrasena ? 'No se recibio un strEmail y strContrasena favor ingresarla' :
                (!strEmail ? 'No se recibio el strEmail , favor de ingresa' : 'No se recibio el strContrasena, favor de ingrsarlo'),
                cont:{
                    strEmail,
                    strContrasena
                }
            })
        }
       
        const encontroEmail = await UsuarioModel.findOne({strEmail: strEmail});
        //console.log(encontroEmail);
        if(!encontroEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo o la contrasena son incorrectas , verificarlas',
                cont:{
                  strEmail,
                  strContrasena
               }  
            })
        }
         //console.log(encontroEmail.strContrasena);
         
         const compararContrasena = bcrypt.compareSync(strContrasena, encontroEmail.strContrasena);
         bcrypt.compareSync(strContrasena, encontroEmail.strContrasena)
         if(!compararContrasena){
           return res.status(400).json({
               ok:false,
               msg:'El contrasena o la contrasena son incorrectas , verificarlas',
               cont:{
                 strEmail,
                 strContrasena
              }  
           })
         }
         const token = jwt.sign({encontroEmail},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})
         return res.status(200).json({
             ok:true,
             msg: 'Se loguo el usuario de manera exitosa',
             cont:{
                 usuario: encontroEmail,
                 token
             }
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
    

})



module.exports = app;

