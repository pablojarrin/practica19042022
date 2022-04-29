const mongoose = require('mongoose');

let schemaApi = new mongoose.Schema({
    blnEstado:{
        type: Boolean,
        default:true
    },
    strRuta:{
        type: String,
        required:['No se recibio el strRuta favor de ingresrlo']
    },
    strMetodo:{
        type: String,
        required:['No se recibio el strMetodo favor de ingresrlo']
    },
    strDescripcion:{
        type: String,
        required:['No se recibio el strDescripcion favor de ingresrlo']
    },
    blnEsApi:{
        type: Boolean,
        default:true
    },
    blnEsMenu:{
        type:Boolean,
        default:false,
    }
    
})


module.exports = mongoose.model('api', schemaApi);

