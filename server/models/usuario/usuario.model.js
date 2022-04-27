const mongoose = require('mongoose');


let SchemaUsuario = mongoose.Schema({
    strNombre:{
        type: String,
        required:[true,'No se recibio el strNombre favor de ingresar']
    },
    strApellido:{
        type: String,
        required:[true,'No se recibio el strApellido favor de ingresar']
    },
    strEmail:{
        type:String,
        required:[true, ' No se recibio el email favor ingrrsar']
    },
    strDireccion:{
        type:String,
        required:[true,'Nose recibio el strDireccion favor de ingresar']
    }, 
    strContrasena:{
        type:String,
        required:[true, ' No se recibio la contrasena favor ingrrsar']
    },
    strNombreUsuario:{
        type:String,
        required:[true, ' No se recibio la contrasena favor ingrrsar']
    },
    blnEstado:{
        type: Boolean,
        default:true
    }
    
})

module.exports = mongoose.model(`usuario`, SchemaUsuario);