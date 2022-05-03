const { json } = require('express');
const express = require('express');
const app = express.Router();
const arrJsnUsuarios = [{_id: 1, strNombre:"", strApellido:"", strEmail:""}]
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');
const {verificarAcceso} = require('../../middlewares/permisos');
const usuarioModel = require('../../models/usuario/usuario.model');
const cargaArchivo = require('../../library/cargarArchivos');
const RolModel = require('../../models/permisos/rol.model');


// const path = require('path');
//const a = require('../../assets(index.html')
//const rutaDescarga = path.resolve(__dirname, '../../assets(index.html')

// app.get('/',(req,res) => {
//   const arrUsuarios = arrJsnUsuarios;
//   if(arrJsnUsuarios.length > 0){

//       return res.status(200).json({
//           ok: true,
//           msg: 'Se recibieron los usuarios de manera exitosa',
//           cont:{arrUsuarios}
//       })

//   }else{

//       return res.status(400).json({
//           ok: true,
//           msg: 'No se encontraron usuarios',
//           cont:{arrUsuarios}
//       })

//   }



//   //return res.status(200).download(rutaDescarga,'documento.html')
 
// })

// app.get('/obtenerUsuario',(req, res)=>{
//   const _idUsuario = Number(req.query._idUsuario);
//   if(!_idUsuario){
//     return res.status(400).json({
//       ok: false,
//       msg:'No se recibio un identificador de usaurio',
//       cont:{
//         _idUsuario
//       }
//     })
//   }
//   const obtenerUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario);
//   if(!obtenerUsuario){
//     return res.status(400).json({
//       ok: false,
//       msg:`no se encontro el id del usuario ${_idUsuario}, en la base de datos`,
//       cont:{
//         _idUsuario
//       }
//     })

//   }
//   return res.status(200).json({
//     ok:true,
//     msg:'Se recibio el usuario de manera exitosa',
//     cont:{
//       obtenerUsuario
//     }
//   })
// })



app.get('/', verificarAcceso, async (req, res) => {
  const blnEstado = req.query.blnEstado == "false" ? false : true;
    //const obtenerUsuarios = await UsuarioModel.find({},{strNombre:1,strContrasena:0 });
    const obtenerUsuarios = await UsuarioModel.find({ blnEstado: blnEstado }, {});    
    if(obtenerUsuarios.length < 1){
 // if(Object.keys(obtenerUsuarios).length != 0) { 
     return res.status(400).json({
        ok: false,
         msg: 'No se encontraror los usuarios en la base de datos',
        cont: {
          obtenerUsuarios
        }
      })
  }
  return res.status(200).json({
      ok:true,
       msg: ' Se obtuvieron los datos de forma correcta',
       count: obtenerUsuarios.length,
      cont:{
       obtenerUsuarios
      }
  })
})

//  app.put('/',(req,res) => {
//         const _idUsuario = parseInt(req.query._idUsuario);
    
//          console.log(typeof _idUsuario)
//         if(_idUsuario){
//             const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
//             if(encontroUsuario){
//                 const actuaizaUsuario = {_id: _idUsuario, strNombre: req.body.strNombre, strApellido: req.body.strApellido, strEmail: req.body.strEmail};
//                 const filtraUsuario = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario)
//                 arrJsnUsuarios = filtraUsuario;
//                 arrJsnUsuarios.push(actuaizaUsuario);
    
//                 return res.status(200).json({
//                     ok: true,
//                     msg: 'El usuario se actualizo de manera exitosa',
//                     cont:{
//                        actuaizaUsuario
//                     }
//                 })
    
//             }else{
    
//                 return res.status(400).json({
//                     ok: false,
//                     msg: `El usuario con el _id: ${_idUsuario} , no se ecuentra rgistrado en la BD`,
//                     cont:{
//                         _idUsuario
//                     }
//                 })
//             }
    
//         }else{
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'El identificador del usuario no existe',
//                 cont:{
//                     _idUsuario
//                 }
//             })
//         }
    
//   })


app.put('/', verificaAcceso, async(req,res) => {
  try {
    const _idUsuario = req.query._idUsuario;
    //validamos que no enviemos in id, o que el id no tenga la longitud correcta
    if(!_idUsuario || _idUsuario.length !=24){
      return res.status(400).json({
           ok:false,
           msg: _idUsuario ? 'El identificador no es valido':'No se recibio el identifiador del Usuario',
           cont:{
               _idUsuario
           }
       })
     }
      const encontroUsuario = await usuarioModel.findOne({_id: _idUsuario, blnEstado: true});
      if(!encontroUsuario){
        return res.status(400).json({
          ok:false,
          msg:  'No se encontro el usuario registrado en la db',
          cont:{
              _idUsuario
          }
      })

    }
    const encontrarNombreUsuario = await usuarioModel.findOne({strNombreUsuario: req.body.strNombreUsuario, _id:{$ne: _idUsuario}},{strNombre: 1, strNombreUsuario: 1})
    if(encontrarNombreUsuario){
      return res.status(400).json({
        ok:false,
        msg:'El nombre de usuario ya esta registrado en l bd',
        cont:{
          encontrarNombreUsuario
        }
      })
    }
    //tambien se puede utilizar
        //findByIdAndUpdate findOneAndUpdate(_idUsuario, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}}, {new :true, upsert: true});
        //updateOne({_id:_idUsuario}, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}});
        const actualizarUsuario = await UsuarioModel.findOneAndUpdate({ _id: _idUsuario }, {
          $set: {
              strNombre: req.body.strNombre, strApellido: req.body.strApellido,
              strDireccion: req.body.strDireccion,
              strNombreUsuario: req.body.strNombreUsuario
          }
      }, { new: true, upsert: true });
      if (!actualizarUsuario) {
        return res.status(400).json(
            {
                ok: false,
                //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                msg: 'No se logro actualizar el usuario',
                cont:
                {
                    ...req.body
                }
            })

      }
    return res.status(200).json({
      ok:true,
      msg:'Se actuaizo el usuario de manera correcta',
      cont:{
        usuarioAnterior: encontroUsuario,
        usuarioActual: actualizarUsuario
      }
    })
    //  console.log(usuarioActualizado)
  } catch (error) {
  // console.log(error)
    return res.status(500).json({
      ok:false,
      msg: 'Error en el servidor',
      cont:{
          error
      }
    })
  }
})

// app.delete('/',(req,res)=> {
 
//   const _idUsuario =req.query._idUsuario;
//   if(!_idUsuario){
//     return res.status(400).json({
//       ok: false,
//       msg: 'No se recibio un identificadore de usuario',
//       cont: {
//         _idUsuario
//       }
//     })
//   }
//   const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario)
//   if(encontroUsuario){
//     return res.status(400).json({
//       ok:false,
//       msg:`No se encontro un usuario con el _id: ${_idUsuario} en la base de datos`,
//       cont: {
//         _idUsuario
//       }
//     })
//   }
//   const usuariofiltrado = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario);
//   arrJsnUsuarios = usuariofiltrado;

//   return res.status(200).json({
//     ok:true,
//     msg:'El usaurio se elimino de forma exitosa',
//     cont: {
//       encontroUsuario
//     }
//   })
// })

// app.post('/',(req, res) =>{
//     const body = {
//     strNombre: req.body.strNombre,
//     strApellido: req.body.strApellido,
//     strEmail: req.body.strEmail,
//     _id: parseInt( req.body._id)
//   }
//   if(body.strNombre && body.strApellido && body.strEmail && body._id){

//     const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == body._id || usuario.strEmail == body.strEmail)
//     console.log(encontroUsuario,'valor');

//     if(encontroUsuario){
//       res.status(400).json({
//         ok: false,
//         msg:'El usuario ya se encuentra registrado',
//         cont:{
//           encontroUsuario
//         }   
//     })
// }else{
//     arrJsnUsuarios.push(body)
//     res.status(200).json({
//     ok: true,
//     msg:'Se registro el usuario  de manera correcta',
//     cont:{
//       arrJsnUsuarios
//     }
//   })
//   }
// }else{
//   return res.status(400),json({
//     ok: false,
//     msg: 'No se recibio algun o todoslos valres requeridos',
//     cont:{
//       body
//     }
//   })
// }
// })

app.delete('/', verificaAcceso, async(req, res)=>{
  try {
  const _idUsuario = req.query._idUsuario
  const blnEstado = req.query.blnEstado == "false" ? false : true
    if(!_idUsuario || _idUsuario.length !=24 ){
      return res.status(400).json({
        ok:false,
        msg:_idUsuario ? 'No es un id valido' : 'No se ingreso un identificador de usuario',
        cont:{
          _idUsuario: _idUsuario
        }
      })
    }
    const modificarEstadoUsuario = await UsuarioModel.findOneAndUpdate({_id: _idUsuario},{$set: { blnEstado: blnEstado}},{new: true})
  
    return res.status(200).json({
      ok:true,
      msg: blnEstado == true ? 'Se activo el usuario de manera exitosa' : 'Se desactivo el usuario de manera exitosa',
      cont:{
       modificarEstadoUsuario
      }
    }) 
  } catch (error) {
    return res.status(500).json(
        {
            ok: false,
            msg: 'Error en el servidor',
            cont:
            {
                error
            }
        })
  }
})


app.post('/', verificaAcceso, async (req, res) =>{
   try {
       // existe ? (lo que pasa si existe) : (no existe);
    
     const body = { ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena, 10) : undefined };
     const bodyUsuario = new UsuarioModel(body);
     const encontrarEmailUsuario = await UsuarioModel.findOne({ strEmail: body.strEmail });
     const encontrarNombreUsuario = await UsuarioModel.findOne({ strNombreUsuario: body.strNombreUsuario })
    
     // console.log(req.files,'tiene archivo');
      const subio = await  cargaArchivo.subirArchivo(req.files.strImagen,'usuario',['image/png','image/jpg'])
    //  console.log(subio); 
     if (encontrarEmailUsuario) {
         return res.status(400).json({
             ok: false,
             msg: 'El correo ya se encuentra registrado',
             cont: {
                 body
             }
         })
     }
     if (encontrarNombreUsuario) {
         return res.status(400).json({
             ok: false,
             msg: 'El nombre de usuario ya se encuentra registrado',
             cont: {
                 body
             }
         })
     }
     const err = bodyUsuario.validateSync();
     if (err) {
         return res.status(400).json({
             ok: false,
             msg: 'Uno o mas campos no se registrarón favor de ingresarlos',
             cont: {
                 err
             }
         })
     }
     if(req.files){
        if(req.files.strImagen){
            return res.status(400).json({
              ok: false,
              msg: 'No se recibio un archivo strImagen. favor enviarlo',
              cont: {
              
                    }
            })
        }
        bodyUsuario.strImagen = await cargaArchivo.subirArchivo(req.files.strImagen,'usuario',['image/png','image/jpg','image/jpeg'])
      }
      if(!req.body._idObjRol){
        const encontroRolDefault = await RolModel.findOne({blnRolDefault:true})
       bodyUsuario._idObjRol = encontroRolDefault._id;
      }
        const usuarioRegistrado = await bodyUsuario.save();
        return res.status(200).json({
            ok: true,
            msg: 'Se registro el usuario de manera exitosa',
            cont: {
             usuarioRegistrado
            }
        })
     } catch (error) {
        return res.status(500).json({
           ok: false,
          msg: 'Uno o mas campos no se registrarón favor de ingresarlos',
          cont: {
            err
          }
        })       
     }


    })
 







module.exports = app;
