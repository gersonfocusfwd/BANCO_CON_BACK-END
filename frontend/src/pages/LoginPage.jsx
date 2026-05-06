import { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import api from '../api/api';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const manejarEnvio = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      onLoginSuccess(response.data.usuario);
    } catch (err) {
      setError('Credenciales inválidas. Por favor intente de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>BANCO CON</h2>
          <p style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Inicia sesión en tu banca digital premium</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 69, 58, 0.1)', color: 'var(--danger)', padding: '1.2rem', borderRadius: '15px', marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '600' }}>
            {error}
          </div>
        )}


        <div className="login-form">
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={manejarEnvio} disabled={loading}>
            {loading ? 'Cargando...' : (
              <>
                <LogIn size={20} />
                Ingresar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
