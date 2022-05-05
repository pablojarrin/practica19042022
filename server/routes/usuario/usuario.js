const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');
const { verificarAcceso } = require('../../middlewares/permisos');
const cargaArchivo = require('../../library/cargarArchivos');

app.get('/', verificarAcceso, async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == "false" ? false : true;
        const obtenerUsuarios = await UsuarioModel.aggregate(
            [
                {
                    $match: { blnEstado: blnEstado }
                },
                {
                    $lookup: {
                        from: "empresas",
                        localField: "idEmpresa",
                        foreignField: "_id",
                        as: "empresa"
                    }
                },
                {
                    $project: {
                        strNombre: 1,
                        strApellido: 1,
                        strEmail: 1,
                        strDireccion: '$strDireccion',
                        empresa: {
                            $arrayElemAt: ['$empresa', 0]
                        }
                    }
                }
            ]
        );
        if (obtenerUsuarios.length < 1) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontrarón productos en la base de datos',
                cont: {
                    obtenerUsuarios
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvierón los usuarios de manera correcta',
            count: obtenerUsuarios.length,
            cont: {
                obtenerUsuarios
            }
        })
    } catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    err: err.message ? err.message : err.name ? err.name : err
                }
            })
    }
})
app.post('/', async (req, res) => {
    // existe ? (lo que pasa si existe) : (no existe);
    try {
        const body = { ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena, 10) : undefined };
        const bodyUsuario = new UsuarioModel(body);
        const encontrarEmailUsuario = await UsuarioModel.findOne({ strEmail: body.strEmail });
        const encontrarNombreUsuario = await UsuarioModel.findOne({ strNombreUsuario: body.strNombreUsuario })
        if (encontrarEmailUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado',
                cont: {
                    body
                }
            })
        }
        if (encontrarNombreUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de usuario ya se encuentra registrado',
                cont: {
                    body
                }
            })
        }
        const err = bodyUsuario.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Uno o mas campos no se registrarón favor de ingresarlos',
                cont: {
                    err
                }
            })
        }
        if (req.files) {
            if (!req.files.strImagen) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se recibio un archivo strImagen, favor de inregsarlo',
                    cont: {}
                })
            }
            bodyUsuario.strImagen = await cargaArchivo.subirArchivo(req.files.strImagen, 'usuario', ['image/png', 'image/jpg', 'image/jpeg'])

        }
        const usuarioRegistrado = await bodyUsuario.save();
        return res.status(200).json({
            ok: true,
            msg: 'Se registro el usuario de manera exitosa',
            cont: {
                usuarioRegistrado
            }
        })
    } catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    err: err.message ? err.message : err.name ? err.name : err
                }
            })
    }
})
app.put('/', async (req, res) => {

    try {
        const _idUsuario = req.query._idUsuario;

        //validamos que no enviemos in id, o que el id no tenga la longitud correcta
        if (!_idUsuario || _idUsuario.length != 24) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: _idUsuario ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un usuario',
                    cont:
                    {
                        _idUsuario
                    }
                })
        }

        const encontroUsuario = await UsuarioModel.findOne({ _id: _idUsuario, blnEstado: true });

        if (!encontroUsuario) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'No se encuentra registrado el usuario',
                    cont:
                    {
                        _idUsuario
                    }
                })

        }
        const encontrarNombreUsuario = await UsuarioModel.findOne({ strNombreUsuario: req.body.strNombreUsuario, _id: { $ne: _idUsuario } }, { strNombre: 1, strNombreUsuario: 1 })

        if (encontrarNombreUsuario) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'El nombre de usuario ya se encuentra registrado en la base de datos',
                    cont:
                    {
                        encontrarNombreUsuario
                    }
                })
        }

        //tambien se puede utilizar
        //findByIdAndUpdate findOneAndUpdate(_idUsuario, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}}, {new :true, upsert: true});
        //updateOne({_id:_idUsuario}, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}});
        const actualizarUsuario = await UsuarioModel.findOneAndUpdate({ _id: _idUsuario }, {
            $set: {
                strNombre: req.body.strNombre, strApellido: req.body.strApellido,
                strDireccion: req.body.strDireccion,
                strNombreUsuario: req.body.strNombreUsuario,
                idEmpresa: req.body.idEmpresa
            }
        }, { new: true, upsert: true });

        if (!actualizarUsuario) {
            return res.status(400).json(
                {
                    ok: false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: 'No se logro actualizar el usuario',
                    cont:
                    {
                        ...req.body
                    }
                })

        }

        return res.status(200).json(
            {
                ok: true,
                msg: 'El producto se actualizo de manera existosa',
                cont:
                {
                    usuarioAnterior: encontroUsuario,
                    usuarioActual: actualizarUsuario
                }
            })


    }
    catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    err: err.message ? err.message : err.name ? err.name : err
                }
            })
    }
})
app.delete('/', async (req, res) => {
    try {
        const _idUsuario = req.query._idUsuario
        const blnEstado = req.query.blnEstado == "false" ? false : true
        if (!_idUsuario || _idUsuario.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idUsuario ? 'No es un id valido' : 'No se ingreso un idUsuario',
                cont: {
                    _idUsuario: _idUsuario
                }
            })
        }
        const modificarEstadoUsuario = await UsuarioModel.findOneAndUpdate({ _id: _idUsuario }, { $set: { blnEstado: blnEstado } }, { new: true })

        return res.status(200).json({
            ok: true,
            msg: blnEstado == true ? 'Se activo el usuario de manera exitosa' : 'Se desactivo el usuario de manera exitosa',
            cont: {
                modificarEstadoUsuario
            }
        })
    } catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    err: err.message ? err.message : err.name ? err.name : err
                }
            })
    }
})

module.exports = app;