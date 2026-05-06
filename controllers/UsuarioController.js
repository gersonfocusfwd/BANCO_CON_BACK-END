const { Usuario } = require('../models');

/**
 * /////////////////////////////////////////////////////////////
 * // SECCIÓN DE CONTROLADORES PARA USUARIOS
 * /////////////////////////////////////////////////////////////
 */

/**
 * [FUNCIÓN: listarUsuarios]
 * Descripción: Obtiene la lista completa de usuarios registrados en el sistema.
 */
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json({
      ok: true,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener los usuarios',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: crearUsuario]
 * Descripción: Registra un nuevo usuario en la base de datos.
 */
const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res.status(201).json({
      ok: true,
      msg: 'Usuario creado exitosamente',
      data: nuevoUsuario
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al crear el usuario',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: actualizarUsuario]
 * Descripción: Actualiza los datos de un usuario existente por su ID.
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado] = await Usuario.update(req.body, { where: { id } });
    
    if (actualizado) {
      const usuarioActualizado = await Usuario.findByPk(id);
      return res.status(200).json({
        ok: true,
        msg: 'Usuario actualizado exitosamente',
        data: usuarioActualizado
      });
    }
    throw new Error('Usuario no encontrado');
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al actualizar el usuario',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: eliminarUsuario]
 * Descripción: Elimina permanentemente un usuario de la base de datos.
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.destroy({ where: { id } });
    
    if (eliminado) {
      return res.status(200).json({
        ok: true,
        msg: 'Usuario eliminado correctamente'
      });
    }
    throw new Error('Usuario no encontrado');
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al eliminar el usuario',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: gestionar_roles]
 * Descripción: Permite a un administrador cambiar el rol de un usuario.
 */
const gestionar_roles = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['admin', 'cliente'].includes(rol)) {
      return res.status(400).json({ ok: false, msg: 'Rol no válido' });
    }

    const [actualizado] = await Usuario.update({ rol }, { where: { id } });

    if (actualizado) {
      return res.json({ ok: true, msg: `Rol actualizado a ${rol}` });
    }
    throw new Error('Usuario no encontrado');
  } catch (error) {
    res.status(400).json({ ok: false, msg: 'Error al gestionar rol', error: error.message });
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  gestionar_roles
};
