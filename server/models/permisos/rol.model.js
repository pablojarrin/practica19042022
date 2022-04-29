const mongoose = require('mongoose');

let schemaRol = new mongoose.Schema({

    strNombre:{
        type: String,
        required:['No se recibio el strNombre favor de ingresrlo']
    },
    strDescripcion:{
        type: String,
        required:['No se recibio el strDescripcion favor de ingresrlo']
    },
    blnRolDefault:{
        type:Boolean,
        default:false
    },
    arrObjIdApis: []


})


module.exports = mongoose.model('rol', schemaRol);

