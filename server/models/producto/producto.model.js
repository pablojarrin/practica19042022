const mongoose = require('mongoose');


let SchemaProducto = mongoose.Schema({
    blnEstado:{
        type:Boolean,
        default: true,
    },
    strNombre:{
        type: String,
        required:[true,'No se recibio el strNombre favor de ingresar']
    },
    strDescripcion:{
        type: String,
        required:[true,'No se recibio el strDescripcion favor de ingresar']
    },
    nmbPrecio:{
        type: Number,
        required:[true,'No se recibio el strPrecio favor de ingresar']
    }
})

module.exports = mongoose.model(`producto`, SchemaProducto);