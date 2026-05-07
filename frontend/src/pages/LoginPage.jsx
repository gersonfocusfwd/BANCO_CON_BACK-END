import { useState } from 'react';
import api from '../api/api';
import { Shield, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      onLoginSuccess(response.data.usuario);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen" style={{ background: '#020617' }}>
      {/* Visual Side */}
      <div className="login-side-visual" style={{ 
        position: 'relative', 
        background: 'url(/bank-bg.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        flex: '1.4'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to right, rgba(2, 6, 23, 0.9) 0%, rgba(2, 6, 23, 0.2) 100%)' 
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 10, padding: '4rem' }}>
          <div className="brand-section" style={{ marginBottom: '4rem' }}>
            <div className="brand-logo" style={{ width: '50px', height: '50px' }}>
              <Shield size={30} color="#fff" />
            </div>
            <h1 className="brand-name" style={{ fontSize: '2rem' }}>BANCO CON</h1>
          </div>
          
          <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', color: '#fff' }}>
            La banca del <br/> 
            <span style={{ color: 'var(--primary)' }}>Futuro</span> es hoy.
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '450px', lineHeight: '1.6' }}>
            Únete a la plataforma financiera más segura y avanzada del mundo. Gestiona tus activos con la simplicidad que mereces.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
              <CheckCircle size={20} color="var(--secondary)" />
              <span>Seguridad de grado militar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
              <CheckCircle size={20} color="var(--secondary)" />
              <span>Transacciones instantáneas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="login-side-form" style={{ background: '#020617', borderLeft: '1px solid var(--glass-border)' }}>
        <div className="login-card" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>Iniciar Sesión</h3>
            <p style={{ color: '#94a3b8' }}>Ingresa tus credenciales para acceder a tu bóveda.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="nombre@correo.com" 
                  required 
                  style={{ 
                    paddingLeft: '40px', 
                    background: '#0f172a', 
                    border: '1px solid #1e293b', 
                    color: '#fff',
                    borderRadius: '12px',
                    height: '50px'
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  style={{ 
                    paddingLeft: '40px', 
                    background: '#0f172a', 
                    border: '1px solid #1e293b', 
                    color: '#fff',
                    borderRadius: '12px',
                    height: '50px'
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ 
                height: '50px', 
                justifyContent: 'center', 
                fontSize: '1rem', 
                marginTop: '10px' 
              }}
            >
              {loading ? 'Autenticando...' : 'Acceder Ahora'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
            ¿No tienes cuenta? <a href="#" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Solicitar apertura</a>
          </p>
        </div>
      </div>
    </div>
  );
}
