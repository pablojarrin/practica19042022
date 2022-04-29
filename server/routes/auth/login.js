const { json } = require('express');
const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');



app.post('/login',async (req,res)=> {
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
  console.log(encontroEmail.strContrasena);
})



module.exports = app;

