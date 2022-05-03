const express = require('express');
const app = express.Router();
const ApiModel = require('../../models/permisos/api.model')


app.post('/',(req,res)=>{
    try {
        const body = req.body;
        const bodyApi = new ApiModel(body)
        const err = bodyApi.validateSync();
        if(err) {
          return res.status(400).json({
            ok: false,
            msg:'Uno o mas campos no se registraron favor ingresarlos',
            cont:{err}
          })
    }
    if(!(bodyApi.strMetodo == 'GET'|| bodyApi.strMetodo == 'POST' || bodyApi == 'PUT' || bodyApi.strMetodo == 'DELETE'))
        return res.status(400).json({
            ok:false,
            msg:'El strMetodo no es valido',
            cont:{ metodoPermitidos:['GET','POST','PUT','DELETE']}
        })
    }
    const encontroApi = await ApiModel.findOne({strRuta: bodyApi.strRuta,strMetodo:bodyApi.strMetodo})
    if(encontroApi){
        return res.status(400).json({
            ok:false,
            msg:'El Api ya se encuentra registrado',
            cont:{ encontroApi}
        })
    }
    const registroApi = await bodyApi.save();
    return res.status(400).json({
        ok:true,
        msg:'La Api se registro de forma exitosa',
        cont:{
            registroApi
        }
    })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:'Error del servidor',
            cont:{err}
        
    })
}



module.exports = app;
