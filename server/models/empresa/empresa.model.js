const mongoose = require('mongoose');


let SchemaEmpresa = mongoose.Schema({
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
    nmbTelefono:{
        type: Number,
        required:[true,'No se recibio el nmbTelefono favor de ingresar']
    },
    nmbCodigoPostal:{
        type: Number,
        required:[true,'No se recibio el nmbCodigoPostal favor de ingresar']
    },
    strCiudad:{
        type: String,
        required:[true,'No se recibio el strCiudad favor de ingresar']
    }
})

module.exports = mongoose.model(`empresa`, SchemaEmpresa);