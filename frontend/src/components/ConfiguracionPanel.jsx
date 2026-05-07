import { useState } from 'react';
import { Settings, User, Lock, Bell, Shield, Moon, Globe, Save, LogOut } from 'lucide-react';
import api from '../api/api';

export default function ConfiguracionPanel({ user, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Endpoint para actualizar perfil (asumiendo que existe o implementando uno básico)
      await api.patch(`/usuarios/${user.id}`, { 
        nombre: formData.nombre,
        email: formData.email
      });
      setMessage({ type: 'success', text: 'Perfil actualizado con éxito.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.mensaje || 'Error al actualizar perfil.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }
    setLoading(true);
    try {
      // Implementación de cambio de contraseña
      await api.patch(`/usuarios/${user.id}`, { 
        password: formData.newPassword
      });
      setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente.' });
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'No se pudo cambiar la contraseña.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade">
      <header className="admin-header">
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Configuración</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Personaliza tu experiencia, gestiona tu seguridad y preferencias de cuenta.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '30px' }}>
        
        {/* SIDEBAR DE CONFIGURACIÓN */}
        <div className="card-glass" style={{ padding: '20px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="config-nav-item active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', cursor: 'pointer' }}>
              <User size={18} /> <span style={{ fontWeight: '700' }}>Perfil Personal</span>
            </div>
            <div className="config-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Shield size={18} /> <span style={{ fontWeight: '600' }}>Seguridad</span>
            </div>
            <div className="config-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Bell size={18} /> <span style={{ fontWeight: '600' }}>Notificaciones</span>
            </div>
            <div className="config-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Globe size={18} /> <span style={{ fontWeight: '600' }}>Idioma y Región</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '10px 0' }} />
            <div onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', color: '#f43f5e', cursor: 'pointer' }}>
              <LogOut size={18} /> <span style={{ fontWeight: '700' }}>Cerrar Sesión</span>
            </div>
          </div>
        </div>

        {/* CONTENIDO DE CONFIGURACIÓN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* SECCIÓN PERFIL */}
          <section className="card-glass" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--primary)" /> Datos del Perfil
            </h3>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="input-label">Nombre Completo</label>
                <input 
                  className="input-field"
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Correo Electrónico</label>
                <input 
                  className="input-field"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  <Save size={18} /> Guardar Cambios
                </button>
              </div>
            </form>
          </section>

          {/* SECCIÓN SEGURIDAD */}
          <section className="card-glass" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={20} color="var(--secondary)" /> Seguridad de la Cuenta
            </h3>
            
            <form onSubmit={handleChangePassword} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Contraseña Actual</label>
                <input 
                  className="input-field"
                  type="password"
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Nueva Contraseña</label>
                <input 
                  className="input-field"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={e => setFormData({...formData, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Confirmar Contraseña</label>
                <input 
                  className="input-field"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              {message.text && (
                <div style={{ 
                  gridColumn: 'span 2',
                  padding: '12px', 
                  borderRadius: '10px', 
                  fontSize: '0.85rem',
                  background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                  color: message.type === 'success' ? '#10b981' : '#f43f5e',
                  border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                }}>
                  {message.text}
                </div>
              )}

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ background: 'var(--secondary)' }}>
                  <Shield size={18} /> Actualizar Seguridad
                </button>
              </div>
            </form>
          </section>

          {/* OTRAS OPCIONES */}
          <section className="card-glass" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Preferencias</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Moon size={18} color="var(--text-secondary)" />
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Modo Oscuro</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ahorra batería y cuida tu vista.</p>
                </div>
              </div>
              <div style={{ width: '40px', height: '22px', background: 'var(--primary)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', right: '3px', top: '3px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%' }}></div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
