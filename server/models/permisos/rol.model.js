const mongoose = require('mongoose');

let schemaRol = new mongoose.Schema({

    strNombre:{
        type: String,
        required:['No se recibio el strNombre favor de ingresrlo']
    },
    blnEstado:{
        type:Boolean,
        default:false
    },
    strDescripcion:{
        type: String,
        required:['No se recibio el strDescripcion favor de ingresrlo']
    },
    blnRolDefault:{
        type:Boolean,
        default:false
    },
    arrObjIdApis: [mongoose]


})


module.exports = mongoose.model('rol', schemaRol);

