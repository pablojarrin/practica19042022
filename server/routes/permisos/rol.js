const express = require('express');
const app = express.Router();
const RolModel = require('../../models/permisos/rol.model')


app.get('/', async (req, res) => {
    const blnEstado = req.query.blnEstado == "false" ? false : true;
    let n = { strNombre : '' }
    const obtenerRol = await RolModel.aggregate([
        {
            $match:{blnEstado: blnEstado}
        },
        {
            $lookup:{
               from: 'apis' ,
               let:  { arrObjIdApis : '$arrObjIdApis'},
               pipeline:[
               //  { $match: {blnEstado:true} }  
                {$match:{$expr:{$in:['$_id','$$arrObjIdApis']}}},
                  {
                      $project:{
                          strRuta : 1,
                          strMetodo : 1
                      }
                  }
               ],
               as: 'apis'

            }
        }
    ]);

    res.status(200).json({
        ok:true,
        msg:'Se Obtuvo losroles exitosamente',
        cont:{
            obtenerRol
        }
    })
})






// app.post('/', async (req,res)=>{
// const body = req.body;
// const bodyRol = new RolModel(body);
// const err = bodyRol.validateSync();
// if(err){
//     return res.status(400).json({
//         ok:false,
//         msg:'Uno om as campos no se registrarorn foavr ingrrsalros',
//         cont:{
//             err
//         }
//     })
// }
// if(!body.arrObjIdApis){
//     return res.status(400).json({
//         ok:false,
//         msg:'Uno om as campos no se registrarorn foavr ingrrsalros',
//         cont:{
//             arrObjIdApis:null
//         }
//     })
// }
// const encontroRol = await RolModel.findOne({strNombre:bodyRol.strNombre},)
// if(encontroRol){
// return res.status(400).json({
//     ok:true,
//     msg:'El rol se registro de manera existosa',
//     cont:{
//         encontroRol
//     }
// })
// }
// const registroRol = await bodyRol.save();
// return res.status(200).json({
//     ok:true,
//     msg:'El rol se registro de manera existosa',
//     cont:{
//         registroRol
//     }
// })
// })

module.exports = app;