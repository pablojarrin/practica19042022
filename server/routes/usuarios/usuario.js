const { json } = require('express');
const express = require('express');
const app = express.Router();
const arrJsnUsuarios = [{_id: 1, strNombre:"", strApellido:"", strEmail:""}]
// const path = require('path');
//const a = require('../../assets(index.html')
//const rutaDescarga = path.resolve(__dirname, '../../assets(index.html')

app.get('/',(req,res) => {
  const arrUsuarios = arrJsnUsuarios;
  if(arrJsnUsuarios.length > 0){

      return res.status(200).json({
          ok: true,
          msg: 'Se recibieron los usuarios de manera exitosa',
          cont:{arrUsuarios}
      })

  }else{

      return res.status(400).json({
          ok: true,
          msg: 'No se encontraron usuarios',
          cont:{arrUsuarios}
      })

  }



  //return res.status(200).download(rutaDescarga,'documento.html')
 
})
  app.put('/',(req,res) => {
        const _idUsuario = parseInt(req.query._idUsuario);
    
         console.log(typeof _idUsuario)
        if(_idUsuario){
            const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
            if(encontroUsuario){
                const actuaizaUsuario = {_id: _idUsuario, strNombre: req.body.strNombre, strApellido: req.body.strApellido, strEmail: req.body.strEmail};
                const filtraUsuario = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario)
                arrJsnUsuarios = filtraUsuario;
                arrJsnUsuarios.push(actuaizaUsuario);
    
                return res.status(200).json({
                    ok: true,
                    msg: 'El usuario se actualizo de manera exitosa',
                    cont:{
                       actuaizaUsuario
                    }
                })
    
            }else{
    
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario con el _id: ${_idUsuario} , no se ecuentra rgistrado en la BD`,
                    cont:{
                        _idUsuario
                    }
                })
            }
    
        }else{
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del usuario no existe',
                cont:{
                    _idUsuario
                }
            })
        }
    
  })

app.delete('/',(req,res)=> {
  const _idUsuario =req.query._idUsuario;
  if(!_idUsuario){
    return res.status(400).json({
      ok: false,
      msg: 'No se recibio un identificadore de usuario',
      cont: {
        _idUsuario
      }
    })
  }
  const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario)
  if(encontroUsuario){
    return res.status(400).json({
      ok:false,
      msg:`No se encontro un usuario con el _id: ${_idUsuario} en la base de datos`,
      cont: {
        _idUsuario
      }
    })
  }
  const usuariofiltrado = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario);
  arrJsnUsuarios = usuariofiltrado;

  return res.status(200).json({
    ok:true,
    msg:'El usaurio se elimino de forma exitosa',
    cont: {
      encontroUsuario
    }
  })
})

app.post('/',(req, res) =>{
    const body = {
    strNombre: req.body.strNombre,
    strApellido: req.body.strApellido,
    strEmail: req.body.strEmail,
    _id: parseInt( req.body._id)
  }
  if(body.strNombre && body.strApellido && body.strEmail && body._id){

    const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == body._id || usuario.strEmail == body.strEmail)
    console.log(encontroUsuario,'valor');

    if(encontroUsuario){
      res.status(400).json({
        ok: false,
        msg:'El usuario ya se encuentra registrado',
        cont:{
          encontroUsuario
        }   
    })
}else{
    arrJsnUsuarios.push(body)
    res.status(200).json({
    ok: true,
    msg:'Se registro el usuario  de manera correcta',
    cont:{
      arrJsnUsuarios
    }
  })
  }
}else{
  return res.status(400),json({
    ok: false,
    msg: 'No se recibio algun o todoslos valres requeridos',
    cont:{
      body
    }
  })
}
})


module.exports = app;
