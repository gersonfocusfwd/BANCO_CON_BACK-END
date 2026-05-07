import { useState, useEffect } from 'react';
import { UserPlus, Shield, Users, Trash2, Search, Filter, X, Landmark } from 'lucide-react';
import api from '../api/api';

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [buscandoNombre, setBuscandoNombre] = useState(false);
  const [tabActiva, setTabActiva] = useState('usuarios');
  const [prestamosPendientes, setPrestamosPendientes] = useState([]);

  // Estado para el nuevo usuario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    cedula: '',
    password: '',
    rol: 'cliente'
  });

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await api.get('/usuarios');
      setUsuarios(respuesta.data.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const obtenerPrestamosPendientes = async () => {
    try {
      const res = await api.get('/prestamos/todos'); 
      setPrestamosPendientes(res.data.data.filter(p => p.estado === 'pendiente'));
    } catch (err) {
      console.error('Error al obtener préstamos');
    }
  };

  useEffect(() => {
    obtenerUsuarios();
    if (tabActiva === 'prestamos') {
      obtenerPrestamosPendientes();
    }
  }, [tabActiva]);

  useEffect(() => {
    const cedulaLimpia = nuevoUsuario.cedula.replace(/\D/g, '');
    if (cedulaLimpia.length === 9) {
      buscarNombre(cedulaLimpia);
    }
  }, [nuevoUsuario.cedula]);

  const buscarNombre = async (cedula) => {
    setBuscandoNombre(true);
    try {
      const respuesta = await api.post('/credito/lookup-nombre', { cedula });
      if (respuesta.data.ok) {
        setNuevoUsuario(prev => ({ ...prev, nombre: respuesta.data.nombre }));
      }
    } catch (error) {
      console.log('No se pudo autocompletar el nombre.');
    } finally {
      setBuscandoNombre(false);
    }
  };

  const aprobarPrestamo = async (id) => {
    try {
      await api.post(`/prestamos/aprobar/${id}`);
      obtenerPrestamosPendientes();
      alert('✅ Préstamo aprobado con éxito.');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.msg || 'No se pudo aprobar el préstamo.'));
    }
  };

  const crearUsuario = async () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.cedula || !nuevoUsuario.password) {
      alert('⚠️ Completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/usuarios', nuevoUsuario);
      setNuevoUsuario({ nombre: '', email: '', cedula: '', password: '', rol: 'cliente' });
      setMostrarModal(false);
      obtenerUsuarios();
      alert('✅ Usuario registrado.');
    } catch (error) {
      alert('❌ Error al crear usuario.');
    } finally {
      setLoading(false);
    }
  };

  const actualizarRol = async (id, nuevoRol) => {
    try {
      await api.patch(`/usuarios/roles/${id}`, { rol: nuevoRol });
      obtenerUsuarios();
    } catch (error) {
      alert('❌ Error al actualizar el rol.');
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('🚨 ¿Deseas eliminar este usuario?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        obtenerUsuarios();
      } catch (error) {
        alert('❌ Error al eliminar.');
      }
    }
  };

  const usuariosFiltrados = (usuarios || []).filter(u => 
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.cedula?.includes(busqueda)
  );

  return (
    <div className="animate-fade">
      <header className="admin-header">
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Centro de Control</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Gestión global de usuarios y solicitudes financieras.</p>
      </header>

      {/* TABS DE NAVEGACIÓN */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', borderBottom: '1px solid var(--glass-border)' }}>
        <button 
          onClick={() => setTabActiva('usuarios')}
          style={{ padding: '15px 25px', background: 'none', border: 'none', color: tabActiva === 'usuarios' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: tabActiva === 'usuarios' ? '2px solid var(--primary)' : 'none', cursor: 'pointer', fontWeight: '700' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={18} /> Usuarios
          </div>
        </button>
        <button 
          onClick={() => setTabActiva('prestamos')}
          style={{ padding: '15px 25px', background: 'none', border: 'none', color: tabActiva === 'prestamos' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: tabActiva === 'prestamos' ? '2px solid var(--primary)' : 'none', cursor: 'pointer', fontWeight: '700' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Landmark size={18} /> Préstamos 
            {prestamosPendientes.length > 0 && (
              <span style={{ padding: '2px 8px', borderRadius: '10px', background: '#f43f5e', color: '#fff', fontSize: '0.7rem' }}>{prestamosPendientes.length}</span>
            )}
          </div>
        </button>
      </div>

      {tabActiva === 'usuarios' ? (
        <>
          <div className="admin-toolbar" style={{ marginTop: '25px' }}>
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, correo o cédula..." 
                className="search-input"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <button className="btn-primary" onClick={() => setMostrarModal(true)}>
              <UserPlus size={20} />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          <div className="card-glass admin-table-container" style={{ marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Usuario</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Saldo Total</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Rol</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: '700' }}>{user.nombre}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ color: 'var(--secondary)', fontWeight: '800' }}>
                        ${user.cuentas?.reduce((total, cuenta) => total + parseFloat(cuenta.saldo), 0).toLocaleString() || '0.00'}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <select 
                        value={user.rol}
                        onChange={(e) => actualizarRol(user.id, e.target.value)}
                        className="role-badge-select"
                        style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '5px' }}
                      >
                        <option value="cliente">CLIENTE</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <button className="btn-icon-danger" onClick={() => eliminarUsuario(user.id)} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {prestamosPendientes.length === 0 ? (
            <div className="card-glass" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: 'span 2' }}>
              No hay solicitudes pendientes.
            </div>
          ) : (
            prestamosPendientes.map((p, i) => (
              <div key={i} className="card-glass" style={{ padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Solicitante</p>
                    <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{p.usuario?.nombre || 'Usuario'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monto</p>
                    <p style={{ fontWeight: '800', fontSize: '1.3rem', color: '#10b981' }}>${parseFloat(p.monto).toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Propósito:</p>
                  <p style={{ fontSize: '0.9rem' }}>{p.proposito}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => aprobarPrestamo(p.id)} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Aprobar</button>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Rechazar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL DE REGISTRO */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Alta de Usuario</h3>
              <button onClick={() => setMostrarModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="input-label">Nombre Completo</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className="input-field"
                    placeholder={buscandoNombre ? 'Consultando Hacienda...' : 'Ej: Alejandro Magno'}
                    value={nuevoUsuario.nombre}
                    onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                    style={{ paddingRight: buscandoNombre ? '40px' : '12px' }}
                  />
                  {buscandoNombre && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                      <div className="spin" style={{ width: '16px', height: '16px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="input-label">Cédula</label>
                <input className="input-field" placeholder="123456789" value={nuevoUsuario.cedula} onChange={e => setNuevoUsuario({...nuevoUsuario, cedula: e.target.value})} />
              </div>
              <div>
                <label className="input-label">Correo</label>
                <input className="input-field" type="email" placeholder="usuario@banco.com" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} />
              </div>
              <div>
                <label className="input-label">Contraseña</label>
                <input className="input-field" type="password" placeholder="••••••••" value={nuevoUsuario.password} onChange={e => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '15px' }}>
              <button className="btn-primary" onClick={crearUsuario} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>{loading ? 'Guardando...' : 'Registrar'}</button>
              <button className="btn-secondary" onClick={() => setMostrarModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
