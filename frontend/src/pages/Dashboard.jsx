import { CreditCard, ArrowUpRight, ArrowDownLeft, Wallet, LogOut } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  // Datos simulados o que vendrían de la API
  const balance = 12500.50;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Hola, {user?.nombre || 'Usuario'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Bienvenido de nuevo a tu panel bancario.</p>
        </div>
        <button onClick={onLogout} className="btn-primary" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-main)' }}>
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Card de Balance */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <Wallet size={32} />
            <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>Tarjeta de Débito</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>${balance.toLocaleString()}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: '0.8', textTransform: 'uppercase' }}>Titular</p>
              <p style={{ fontWeight: '600' }}>{user?.nombre || 'GERSON DINARTE'}</p>
            </div>
            <p style={{ fontWeight: '600', letterSpacing: '2px' }}>**** 4589</p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Acciones Rápidas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button className="btn-primary" style={{ height: '100px', flexDirection: 'column' }}>
              <ArrowUpRight size={24} />
              Transferir
            </button>
            <button className="btn-primary" style={{ height: '100px', flexDirection: 'column', background: 'rgba(255,255,255,0.05)' }}>
              <ArrowDownLeft size={24} />
              Recibir
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Transacciones Recientes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { id: 1, desc: 'Pago de Servicios', amount: -45.00, date: 'Hoy, 10:25 AM', icon: <ArrowUpRight color="var(--danger)" /> },
            { id: 2, desc: 'Depósito de Nómina', amount: 2500.00, date: 'Ayer, 03:12 PM', icon: <ArrowDownLeft color="var(--success)" /> },
            { id: 3, desc: 'Compra Supermercado', amount: -120.50, date: '2 May, 06:45 PM', icon: <ArrowUpRight color="var(--danger)" /> }
          ].map(tx => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>{tx.icon}</div>
                <div>
                  <p style={{ fontWeight: '600' }}>{tx.desc}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.date}</p>
                </div>
              </div>
              <p style={{ fontWeight: '700', color: tx.amount < 0 ? 'var(--danger)' : 'var(--success)' }}>
                {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
