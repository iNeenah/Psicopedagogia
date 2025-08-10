const Usuario = require('../models/Usuario');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const { rol } = req.query;
    const filters = {};
    
    if (rol) {
      filters.rol = rol;
    }

    const users = await Usuario.findAll(filters);
    
    res.json({
      message: 'Usuarios obtenidos exitosamente',
      count: users.length,
      users: users.map(user => user.toPublicJSON())
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await Usuario.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario obtenido exitosamente',
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que el usuario existe
    const existingUser = await Usuario.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Si se está actualizando el email, verificar que no exista
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await Usuario.findByEmail(updateData.email);
      if (emailExists) {
        return res.status(400).json({
          error: 'El email ya está en uso'
        });
      }
    }

    // Actualizar usuario
    const updatedUser = await Usuario.update(id, updateData);

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser.toPublicJSON()
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    if (error.message === 'No hay campos para actualizar') {
      return res.status(400).json({
        error: error.message
      });
    }
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Desactivar usuario
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const user = await Usuario.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // No permitir que un usuario se desactive a sí mismo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        error: 'No puedes desactivar tu propia cuenta'
      });
    }

    await Usuario.deactivate(id);

    res.json({
      message: 'Usuario desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error desactivando usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Buscar usuarios
const searchUsers = async (req, res) => {
  try {
    const { q, rol } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }

    // Esta es una búsqueda básica, en un proyecto real usarías full-text search
    const filters = {};
    if (rol) {
      filters.rol = rol;
    }

    const allUsers = await Usuario.findAll(filters);
    const searchTerm = q.toLowerCase();
    
    const filteredUsers = allUsers.filter(user => 
      user.nombre.toLowerCase().includes(searchTerm) ||
      user.apellido.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );

    res.json({
      message: 'Búsqueda completada',
      query: q,
      count: filteredUsers.length,
      users: filteredUsers.map(user => user.toPublicJSON())
    });

  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  searchUsers
};