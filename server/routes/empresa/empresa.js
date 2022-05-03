const { json, query } = require('express');
const express = require('express');
const app = express.Router();
const EmpresaModel = require('../../models/empresa/empresa.model');
const {verificarAcceso} = require('../../middlewares/permisos')



app.get('/', verificarAcceso, async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == "false" ? false : true;
        const obtenerEmpresa = await EmpresaModel.find({blnEstado:blnEstado});
       
        //funcion con aggregate
        const obtenerEmpresaConAggregate = await EmpresaModel.aggregate([
           // {$project:{strNombre: 1 ,strPrecio: 1}},
           // { $match:{$expr:{ $eq:["blnEstado", blnEstado]}}},
           { $match: { blnEstado: blnEstado } },
        ]);
    
        // fin funcion aggregate
       if(obtenerEmpresa.length ==0){
         
        return res.status(400).json({
            ok: false,
            msg: 'No se encontro la Empresa en la base de datos',
            cont: {
                obtenerEmpresa,
              
            }
        })
       } return res.status(200).json({
           ok:true,
           msg:'Se obtuvieron las empresas de manera exitosa',
           count: obtenerEmpresa.length,
           cont:{
              // obtenerEmpresa,
               obtenerEmpresaConAggregate
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

app.post('/', verificarAcceso,async (req, res) => {
    try {
        const body = req.body;
        const empresaBody = new EmpresaModel(body)
       // console.log(ProductoModel);
        const err = empresaBody.validateSync();
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
        const encontroEmpresa = await EmpresaModel.findOne({ strNombre: body.strNombre }, { strNombre: 1 });
        if (encontroEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'La empresaya  se encuentra registrado en la base de datos',
                cont: {
                    encontroEmpresa
                }
            })
        }
        const empresaRegistrado = await empresaBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'La empresa se registro de manera exitosa',
            cont: {
                empresaRegistrado
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

app.put('/',verificarAcceso, async (req, res) => {
    try {
        const _idEmpresa = req.query._idEmpresa;
        if(!_idEmpresa || _idEmpresa.length !=24){
               return res.status(400).json({
                    ok:false,
                    msg: _idEmpresa ? 'El identificador no es valido  se requiere un id de 24 caracteres':'No se recibio el identifiador de la empresa',
                    cont:{
                        _idEmpresa
                    }
                })
        }
        const encontroEmpresa = await EmpresaModel.findOne({ _id: _idEmpresa, blnEstado: true });
        if (!encontroEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'La empresa no se encuentra registrado',
                cont: {
                    _idEmpresa
                }
            })
        }
        const encontroNombreEmpresa = await EmpresaModel.findOne({ strNombre: req.body.strNombre, _id: { $ne: _idEmpresa } }, { strNombre: 1 })
        if (encontroNombreEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de la empresa ya se encuentra registrado',
                cont: {
                    encontroNombreEmpresa
                }
            })
        }
      //const actualizarProducto = await ProductoModel.updateOne({_id: _idProducto},{$set:{...req.body}})
      const actualizarEmpresa = await EmpresaModel.findByIdAndUpdate(_idEmpresa,{$set:{...req.body}},{new:true})
      // console.log(actualizarProducto);
     if(!actualizarEmpresa){
        return res.status(400).json({
            ok:false,
            msg:'La empresa no se logro actualizar',
            cont:{
                ...req.body
            }
        })

     }
     return res.status(200).json({
         ok:true,
         msg: ' La Empresa se actulizo de manera exitosa',
         cont:{
             empresaAnterior: encontroEmpresa,
             empresaActual: actualizarEmpresa
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

app.delete('/',verificarAcceso, async (req, res)=>{
try {
    const _idEmpresa = req.query._idEmpresa;
    if(!_idEmpresa || _idEmpresa.length != 24){
        return res.status(400).json({
            ok:false,
            msg:_idEmpresa ? 'El identificador es invalido' : 'No se recibio un identifiacodr valido',
            cont:{
                _idEmpresa
            }
        })
    }
    const encontrarEmpresa =  await EmpresaModel.findOne({_id: _idEmpresa, blnEstado: true});
   // console.log(encontrarProducto)
    if(!encontrarEmpresa){
        return res.status(400).json({
            ok:false,
            msg: 'El Identiifacodr de la empresa no se encuentra en  la bd',
            cont:{
                _idEmpresa: _idEmpresa
            }
        })
    }
   
    // console.log(encontrarProducto._id);
    // Esta funcion elimina de manera definitiva el producto
        // const eliminarProducto = await ProductoModel.findOneAndDelete({ _id: _idProducto });
        //Esta funcion solo cambia el estado del producto
    const desactivarEmpresa = await EmpresaModel.findOneAndUpdate({ _id: _idEmpresa},{$set: {blnEstado: blnEstado}},{new:true})

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
        msg: blnEstado == true ? 'Se activo la empresa de manera exitosa' : 'Se desactivo la empresa de manera exitosa',
        cont:{
            desactivarEmpresa
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
