const { json, query } = require('express');
const express = require('express');
const app = express.Router();
const {verificaAcceso} = require('../../middlewares/permisos');
const ProductoModel = require('../../models/producto/producto.model');

// app.get('/',(req,res)=>{
// const arrProducto = arrJsnProducto;
//     if(arrJsnProducto.length < 1) {
//         return res.status(400).json({
//             ok:true,
//             msg: 'se recibío el producto',
//             cont:{
//                 arrProducto
//             }
//         })
//     }
//     if(arrJsnProducto.length == 0) {
//         return res.status(400).json({
//             ok:false,
//             msg: 'no Se recibío el producto',
//             cont:{
//                 arrProducto
//             }
//         })
//     }

// })

// app.post('/',(req, res) => {
//     const body = {
//         strNombre:req.body.strNombre,
//         strDescripcion:req.body.strDescripcion,
//         nbmCantidad: req.body.nbmCantidad,
//         nmbPrecio: req.body.nmbPrecio,
//         _id: parseInt(req.body._id)
//     }
//     if(body.strNombre && body.strDescripcion && body.nbmCantidad && body.nmbPrecio && body._id){
//         const encontroProducto = arrJsnProducto.find(producto => producto._id == body._id)
//         if(encontroProducto){
//             res.status(400).json({
//                 ok: false,
//                 msg:'El producto ya se encuentra registrado',
//                 cont:{
//                     encontroProducto
//                 }
//             })
//         }else{
//             arrJsnProducto.push(body)
//             res.status(200).json({
//                 ok:true,
//                 msg:'Se registro el producto de manera correcta',
//                 cont: {
//                     arrJsnProducto
//                 }
//             })
//         }
//     } else {
//         return res.status(400).json({
//             ok: false,
//             msg: 'No se recibio algun o todos los valores requeridos',
//             cont:{
//                 body
//             }
//         })
//     }
// })

// app.delete('/',(req, res)=> {
//   const _idProducto = req.query._idProducto;
//   if(!_idProducto){
//     return res.status(400).json({
//       ok: false,
//       msg: ' No se recibio un identificador del Producto',
//       cont: {
//         _idProducto
//       }
//     })
//   }
//   const encontroProducto = arrJsnProducto.find(producto => producto._id == _idProducto)
//   if (encontroProducto){
//     return res.status(400).json({
//       ok: false,
//       msg:`No se encontro el producto ${_idProducto} en la base de datos`,
//       cont: {
//         _idProducto
//       }
//     })
//   }
//   const productofiltrado = arrJsnProducto.filter(producto => producto._id != _idProducto);
//   arrJsnProducto = productofiltrado;
//   return res.status(200).json({
//     ok:true,
//     msg:'El producto se elimino exitosamente',
//     cont: {
//       encontroProducto
//     }
//   })
// })


// app.put('/',(req, res) => {
//     const _idProducto = parseInt(req.query._idProducto);
//     if(_idProducto){
//         const encontroProducto = arrJsnProducto.find(producto => producto._id === _idProducto);
//         if(encontroProducto){
//             const actualizaProducto = {_id: _idProducto, strNombre: RegExp.body.strNombre, strDescripcion: req.body.strDescripcion,nbmCantidad: req.body.nbmCantidad,nmbPrecio: req.body.nmbPrecio};
//             const filtraProducto = arrJsnProducto.filter(producto=> producto._id != _idProducto)
//             arrJsnProducto = filtraProducto;
//             arrJsnProducto.push(actualizaProducto);
//             return res.status(200).json({
//                ok: true,
//                msg:'El Producto fue se actulizo exitosamente',
//                cont: {
//                    actualizaProducto
//                } 
//             })
//         }else {
//             return res.status(400).json({
//                 ok: false,
//                 msg: `El producto con id ${_idProducto}, no se encuetra registrado en la BD`,
//                 cont:{
//                     _idProducto
//                 }
//             })
//         }
//     }else{
//         return res.status(400).json({
//             ok: false,
//             msg: ' El id del Producto no existe',
//             cont:{
//                 _idProducto
//             }
//         })
//     }
// })

app.get('/', verificaAcceso,async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == "false" ? false : true;
        const obtenerProductos = await ProductoModel.find({blnEstado:blnEstado});
       
        //funcion con aggregate
        const obtenerProductosConAggregate = await ProductoModel.aggregate([
           // {$project:{strNombre: 1 ,strPrecio: 1}},
           // { $match:{$expr:{ $eq:["blnEstado", blnEstado]}}},
           { $match: { blnEstado: blnEstado } },
        ]);
    
        // fin funcion aggregate
       if(obtenerProductos.length ==0){
         
        return res.status(400).json({
            ok: false,
            msg: 'No se encontrarón productos en la base de datos',
            cont: {
                obtenerProductos,
              
            }
        })
       } return res.status(200).json({
           ok:true,
           msg:'Se obtuvieron los productos de manera exitosa',
           count: obtenerProductos.length,
           cont:{
              // obtenerProductos,
               obtenerProductosConAggregate
           }
       })     
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }
})

app.post('/', verificaAcceso,async (req, res) => {
    try {
        const body = req.body;
        const productoBody = new ProductoModel(body)
       // console.log(ProductoModel);
        const err = productoBody.validateSync();
        //console.log(err);
        if(err) {
            return res.status(400).json({
                ok:false,
                msg:'No se recibio uno o mas campos favor validar',
                cont: {
                    err
                }
            })
        } 
        const encontroProducto = await ProductoModel.findOne({ strNombre: body.strNombre }, { strNombre: 1 });
        if (encontroProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto ya se encuentra registrado en la base de datos',
                cont: {
                    encontroProducto
                }
            })
        }
        const productoRegistrado = await productoBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'El producto se registro de manera exitosa',
            cont: {
                productoRegistrado
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok:true,
            msg:'ErroR en el servidor',
            cont:{
                error
            }
        })    
    }   
   // const productoRegistrado = await productoBody.save();  
})

app.put('/', verificaAcceso, async (req, res) => {
    try {
        const _idProducto = req.query._idProducto;
        if(!_idProducto || _idProducto.length !=24){
               return res.status(400).json({
                    ok:false,
                    msg: _idProducto ? 'El identificador no es valido  se requiere un id de 24 caracteres':'No se recibio el identifiador del producto',
                    cont:{
                        _idProducto
                    }
                })
        }
        const encontroProducto = await ProductoModel.findOne({ _id: _idProducto, blnEstado: true });
        if (!encontroProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se encuentra registrado',
                cont: {
                    _idProducto
                }
            })
        }
        const encontroNombreProducto = await ProductoModel.findOne({ strNombre: req.body.strNombre, _id: { $ne: _idProducto } }, { strNombre: 1 })
        if (encontroNombreProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del producto ya se encuentra registrado',
                cont: {
                    encontroNombreProducto
                }
            })
        }
      //const actualizarProducto = await ProductoModel.updateOne({_id: _idProducto},{$set:{...req.body}})
      const actualizarProducto = await ProductoModel.findByIdAndUpdate(_idProducto,{$set:{...req.body}},{new:true})
      // console.log(actualizarProducto);
     if(!actualizarProducto){
        return res.status(400).json({
            ok:false,
            msg:'El Producto no se logro actualizar',
            cont:{
                ...req.body
            }
        })

     }
     return res.status(200).json({
         ok:true,
         msg: ' El Producto se actulizo de manera exitosa',
         cont:{
             productoAnterior: encontroProducto,
             productoActual: actualizarProducto
         }
     })
     } catch (error) {

        return res.status(500).json({
            ok:false,
            msg: 'Error en el servidor',
            cont:{
                error
            }
        })
    }
  

})

app.delete('/', verificaAcceso,async (req, res)=>{
try {
    const _idProducto = req.query._idProducto;
    if(!_idProducto || _idProducto.length != 24){
        return res.status(400).json({
            ok:false,
            msg:_idProducto ? 'El identificador es invalido' : 'No se recibio un identifiacodr valido',
            cont:{
                _idProducto
            }
        })
    }
    const encontrarProducto =  await ProductoModel.findOne({_id: _idProducto, blnEstado: true});
   // console.log(encontrarProducto)
    if(!encontrarProducto){
        return res.status(400).json({
            ok:false,
            msg: 'El Identiifacodr del producto no se encuentra en  la bd',
            cont:{
                _idProducto: _idProducto
            }
        })
    }
   
    // console.log(encontrarProducto._id);
    // Esta funcion elimina de manera definitiva el producto
        // const eliminarProducto = await ProductoModel.findOneAndDelete({ _id: _idProducto });
        //Esta funcion solo cambia el estado del producto
    const desactivarProducto = await ProductoModel.findOneAndUpdate({ _id: _idProducto},{$set: {blnEstado: blnEstado}},{new:true})

    //console.log(eliminarProducto);
    // if(!desactivarProducto){
    //     return res.status(400).json({
    //         ok:false,
    //         msg:'El producto no se logro eliminar de la bd',
    //         cont:{
    //             desactivarProducto
    //         }
    //     })
    // }
    return res.status(200).json({
        ok:true,
        msg: blnEstado == true ? 'Se activo el producto de manera exitosa' : 'Se desactivo el producto de manera exitosa',
        cont:{
            desactivarProducto
        }
    })
} catch (error) {
    return res.status(500).json({
        ok:false,
        msg:'Error en el servidor',
        cont:{
                error
        }
    })
}
})

// La agregacion en MongoDB sigue una estructura tipo "pipeline:
//diferentes etapas, donde cada una toma la salida de la anterior"


module.exports =  app;
