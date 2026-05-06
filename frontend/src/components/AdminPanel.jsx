import { useState, useEffect } from 'react';
import { UserPlus, Shield, Users, Trash2, Edit } from 'lucide-react';
import api from '../api/api';

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    cedula: '',
    password: '',
    rol: 'cliente'
  });
  const [loading, setLoading] = useState(false);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const manejarRegistro = async () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/registro', nuevoUsuario);
      alert('¡Usuario registrado exitosamente!');
      setNuevoUsuario({ nombre: '', email: '', cedula: '', password: '', rol: 'cliente' });
      cargarUsuarios();
    } catch (error) {
      alert('Error al registrar usuario: ' + (error.response?.data?.mensaje || error.message));
    } finally {
      setLoading(false);
    }
  };

  const manejarCambioRol = async (id, nuevoRol) => {
    try {
      await api.patch(`/usuarios/roles/${id}`, { rol: nuevoRol });
      alert('Rol actualizado');
      cargarUsuarios();
    } catch (error) {
      alert('Error al cambiar rol');
    }
  };

  const manejarEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        cargarUsuarios();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const [pestaña, setPestaña] = useState('lista'); // 'lista' o 'registro'

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="admin-panel animate-fade-in" style={{ marginTop: '2rem' }}>
      {/* Navegación de Pestañas */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${pestaña === 'lista' ? 'active' : ''}`}
          onClick={() => setPestaña('lista')}
        >
          <Users size={18} /> Lista de Usuarios
        </button>
        <button 
          className={`tab-btn ${pestaña === 'registro' ? 'active' : ''}`}
          onClick={() => setPestaña('registro')}
        >
          <UserPlus size={18} /> Nuevo Registro
        </button>
      </div>

      {pestaña === 'registro' ? (
        <div className="glass-card animate-fade-in">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <UserPlus color="var(--accent)" /> Registro de Usuario
          </h2>
          
          <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                placeholder="Ej: Juan Pérez" 
                value={nuevoUsuario.nombre}
                onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="juan@banco.com" 
                value={nuevoUsuario.email}
                onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Cédula / ID</label>
              <input 
                type="text" 
                placeholder="123456789" 
                value={nuevoUsuario.cedula}
                onChange={e => setNuevoUsuario({...nuevoUsuario, cedula: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Contraseña Provisional</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={nuevoUsuario.password}
                onChange={e => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Rol del Usuario</label>
              <select 
                value={nuevoUsuario.rol}
                onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={manejarRegistro}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Completar Registro'}
          </button>
        </div>
      ) : (
        <div className="glass-card animate-fade-in">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Users color="var(--accent)" /> Usuarios Registrados
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(user => (
                  <tr key={user.id}>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.rol}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => manejarCambioRol(user.id, user.rol === 'admin' ? 'cliente' : 'admin')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Cambiar Rol"
                      >
                        <Shield size={18} />
                      </button>
                      <button 
                        onClick={() => manejarEliminar(user.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

  );
}
