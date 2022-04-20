const { json } = require('express');
const express = require('express');
const app = express.Router();

app.get('/',(req,res)=>{
const arrProducto = arrJsnProducto;
    if(arrJsnProducto.length < 1) {
        return res.status(200).json({
            ok:true,
            msg: 'No se recibío el producto',
            cont:{
                arrProducto
            }
        })
    }
    if(arrJsnProducto.length > 0) {
        return res.status(200).json({
            ok:false,
            msg: 'Se recibío el producto',
            cont:{
                arrProducto
            }
        })
    }

}

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


module.exports app;
