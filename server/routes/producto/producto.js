const { json, query } = require('express');
const express = require('express');
const app = express.Router();

app.get('/',(req,res)=>{
const arrProducto = arrJsnProducto;
    if(arrJsnProducto.length < 1) {
        return res.status(400).json({
            ok:true,
            msg: 'se recibío el producto',
            cont:{
                arrProducto
            }
        })
    }
    if(arrJsnProducto.length == 0) {
        return res.status(400).json({
            ok:false,
            msg: 'no Se recibío el producto',
            cont:{
                arrProducto
            }
        })
    }

})

app.post('/',(req, res) => {
    const body = {
        strNombre:req.body.strNombre,
        strDescripcion:req.body.strDescripcion,
        nbmCantidad: req.body.nbmCantidad,
        nmbPrecio: req.body.nmbPrecio,
        _id: parseInt(req.body._id)
    }
    if(body.strNombre && body.strDescripcion && body.nbmCantidad && body.nmbPrecio && body._id){
        const encontroProducto = arrJsnProducto.find(producto => producto._id == body._id)
        if(encontroProducto){
            res.status(400).json({
                ok: false,
                msg:'El producto ya se encuentra registrado',
                cont:{
                    encontroProducto
                }
            })
        }else{
            arrJsnProducto.push(body)
            res.status(200).json({
                ok:true,
                msg:'Se registro el producto de manera correcta',
                cont: {
                    arrJsnProducto
                }
            })
        }
    } else {
        return res.status(400).json({
            ok: false,
            msg: 'No se recibio algun o todos los valores requeridos',
            cont:{
                body
            }
        })
    }
})

app.delete('/',(req, res)=> {
  const _idProducto = req.query._idProducto;
  if(!_idProducto){
    return res.status(400).json({
      ok: false,
      msg: ' No se recibio un identificador del Producto',
      cont: {
        _idProducto
      }
    })
  }
  const encontroProducto = arrJsnProducto.find(producto => producto._id == _idProducto)
  if (encontroProducto){
    return res.status(400).json({
      ok: false,
      msg:`No se encontro el producto ${_idProducto} en la base de datos`,
      cont: {
        _idProducto
      }
    })
  }
  const productofiltrado = arrJsnProducto.filter(producto => producto._id != _idProducto);
  arrJsnProducto = productofiltrado;
  return res.status(200).json({
    ok:true,
    msg:'El producto se elimino exitosamente',
    cont: {
      encontroProducto
    }
  })
})


app.put('/',(req, res) => {
    const _idProducto = parseInt(req.query._idProducto);
    if(_idProducto){
        const encontroProducto = arrJsnProducto.find(producto => producto._id === _idProducto);
        if(encontroProducto){
            const actualizaProducto = {_id: _idProducto, strNombre: RegExp.body.strNombre, strDescripcion: req.body.strDescripcion,nbmCantidad: req.body.nbmCantidad,nmbPrecio: req.body.nmbPrecio};
            const filtraProducto = arrJsnProducto.filter(producto=> producto._id != _idProducto)
            arrJsnProducto = filtraProducto;
            arrJsnProducto.push(actualizaProducto);
            return res.status(200).json({
               ok: true,
               msg:'El Producto fue se actulizo exitosamente',
               cont: {
                   actualizaProducto
               } 
            })
        }else {
            return res.status(400).json({
                ok: false,
                msg: `El producto con id ${_idProducto}, no se encuetra registrado en la BD`,
                cont:{
                    _idProducto
                }
            })
        }
    }else{
        return res.status(400).json({
            ok: false,
            msg: ' El id del Producto no existe',
            cont:{
                _idProducto
            }
        })
    }
})

module.exports =  app;
