import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './components/AdminPanel';
import CardsPanel from './components/CardsPanel';
import ValidadorCrediticio from './components/ValidadorCrediticio';
import TransferenciasPanel from './components/TransferenciasPanel';
import EstadisticasPanel from './components/EstadisticasPanel';
import ConfiguracionPanel from './components/ConfiguracionPanel';
import PrestamosPanel from './components/PrestamosPanel';
import api from './api/api';
import './index.css';

import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowLeftRight, 
  LogOut, 
  Shield, 
  Settings, 
  Bell, 
  Search,
  PieChart,
  User,
  Users,
  Landmark,
  X
} from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState('dashboard');
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotis, setMostrarNotis] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/perfil');
        setUser(response.data.usuario);
        fetchNotificaciones();
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const fetchNotificaciones = async () => {
    try {
      const res = await api.get('/extra/notificaciones');
      setNotificaciones(res.data.data);
    } catch (err) {
      console.error('Error al cargar notificaciones');
    }
  };

  const marcarLeida = async (id) => {
    try {
      await api.patch(`/extra/notificaciones/${id}`);
      fetchNotificaciones();
    } catch (err) {
      console.error('Error al marcar como leída');
    }
  };

  const refreshSession = async () => {
    try {
      const response = await api.get('/auth/perfil');
      setUser(response.data.usuario);
    } catch (err) {
      console.error('Error al refrescar sesión');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setSeccionActiva('dashboard');
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    }
  };

  const noLeidas = notificaciones.filter(n => !n.leido).length;

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div className="brand-logo animate-pulse" style={{ width: '60px', height: '60px' }}>
        <Shield size={32} color="#fff" />
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {!user ? (
        <LoginPage onLoginSuccess={setUser} />
      ) : (
        <div className="dashboard-container">
          <aside className="sidebar">
            <div className="brand-section">
              <div className="brand-logo">
                <Shield size={24} color="#fff" />
              </div>
              <h1 className="brand-name">BANCO CON</h1>
            </div>
            
            <nav className="nav-menu">
              <button 
                className={`nav-link ${seccionActiva === 'dashboard' ? 'active' : ''}`}
                onClick={() => setSeccionActiva('dashboard')}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </button>

              {/* Apartados Especiales para Administradores */}
              {(user.role === 'admin' || user.role === 'superadmin' || user.rol === 'admin' || user.rol === 'superadmin') && (
                <>
                  <button 
                    className={`nav-link ${seccionActiva === 'admin' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('admin')}
                    style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                  >
                    <Users />
                    <span>Gestión de Usuarios</span>
                  </button>
                  <button
                    className={`nav-link ${seccionActiva === 'credito' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('credito')}
                    style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                  >
                    <Shield />
                    <span>Validación Crediticia</span>
                  </button>
                </>
              )}

              <button 
                className={`nav-link ${seccionActiva === 'tarjetas' ? 'active' : ''}`}
                onClick={() => setSeccionActiva('tarjetas')}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <CreditCard />
                <span>Tarjetas</span>
              </button>

              <button 
                className={`nav-link ${seccionActiva === 'transferencias' ? 'active' : ''}`}
                onClick={() => setSeccionActiva('transferencias')}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <ArrowLeftRight />
                <span>Transferencias</span>
              </button>

              <button 
                className={`nav-link ${seccionActiva === 'prestamos' ? 'active' : ''}`}
                onClick={() => setSeccionActiva('prestamos')}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <Landmark />
                <span>Préstamos</span>
              </button>

              <button 
                className={`nav-link ${seccionActiva === 'estadisticas' ? 'active' : ''}`}
                onClick={() => setSeccionActiva('estadisticas')}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <PieChart />
                <span>Estadísticas</span>
              </button>
              <button 
                className={`nav-link ${seccionActiva === 'configuracion' ? 'active' : ''}`}
                onClick={() => setSeccionActiva('configuracion')}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <Settings />
                <span>Configuración</span>
              </button>
            </nav>

            <div style={{ marginTop: 'auto' }}>
              <div className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer', color: '#f43f5e' }}>
                <LogOut />
                <span>Finalizar Sesión</span>
              </div>
            </div>
          </aside>

          <main className="content-wrapper">
            <header className="header-actions">
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Buscar transacciones..." 
                  style={{ 
                    background: 'var(--glass-bg)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '50px', 
                    padding: '10px 15px 10px 40px',
                    color: '#fff',
                    width: '300px',
                    outline: 'none'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setMostrarNotis(!mostrarNotis)}>
                  <Bell size={20} color={noLeidas > 0 ? '#fff' : 'var(--text-secondary)'} />
                  {noLeidas > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '18px', height: '18px', background: '#f43f5e', borderRadius: '50%', border: '2px solid var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800' }}>
                      {noLeidas}
                    </span>
                  )}

                  {mostrarNotis && (
                    <div className="card-glass" style={{ position: 'absolute', top: '40px', right: '0', width: '320px', zIndex: '1000', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                      <div style={{ padding: '15px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontWeight: '800', fontSize: '0.9rem' }}>Notificaciones</h4>
                        <X size={16} style={{ cursor: 'pointer' }} onClick={() => setMostrarNotis(false)} />
                      </div>
                      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notificaciones.length === 0 ? (
                          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>No hay notificaciones.</div>
                        ) : (
                          notificaciones.map((n, i) => (
                            <div key={i} style={{ padding: '15px', borderBottom: '1px solid var(--glass-border)', background: n.leido ? 'transparent' : 'rgba(255,255,255,0.03)', cursor: 'pointer' }} onClick={() => !n.leido && marcarLeida(n.id)}>
                              <p style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '4px', color: n.leido ? 'var(--text-secondary)' : '#fff' }}>{n.titulo}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{n.mensaje}</p>
                              <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '8px' }}>{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="user-profile">
                  <div className="avatar">
                    <User size={18} color="#94a3b8" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user?.nombre}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {user?.rol === 'superadmin' ? 'Super Administrador' : user?.rol === 'admin' ? 'Administrador' : 'Cliente Premium'}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Renderizado Condicional de Secciones */}
            {seccionActiva === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} refreshSession={refreshSession} />}
            {seccionActiva === 'admin' && <AdminPanel />}
            {seccionActiva === 'tarjetas' && <CardsPanel user={user} />}
            {seccionActiva === 'credito' && <ValidadorCrediticio />}
            {seccionActiva === 'transferencias' && <TransferenciasPanel user={user} refreshSession={refreshSession} />}
            {seccionActiva === 'prestamos' && <PrestamosPanel user={user} refreshSession={refreshSession} />}
            {seccionActiva === 'estadisticas' && <EstadisticasPanel user={user} />}
            {seccionActiva === 'configuracion' && <ConfiguracionPanel user={user} onLogout={handleLogout} refreshSession={refreshSession} />}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
