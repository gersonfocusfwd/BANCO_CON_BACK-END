import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  Smartphone, 
  Wifi, 
  Zap,
  MoreVertical,
  Shield,
  X,
  CheckCircle
} from 'lucide-react';
import api from '../api/api';

export default function Dashboard({ user, refreshSession }) {
  const saldoTotal = user?.cuentas?.reduce((total, cuenta) => total + parseFloat(cuenta.saldo), 0) || 0;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [transferencia, setTransferencia] = useState({
    cuenta_origen_id: user?.cuentas?.[0]?.id || '',
    numero_cuenta_destino: '',
    monto: '',
    descripcion: ''
  });

  useEffect(() => {
    obtenerHistorial();
  }, []);

  const obtenerHistorial = async () => {
    try {
      const res = await api.get('/transacciones/mi-historial');
      setHistorial(res.data.data || []);
    } catch (err) {
      // Si no hay historial, continuar silenciosamente
    }
  };

  const enviarDinero = async () => {
    setLoading(true);
    setErrorMsg('');
    setExito('');
    try {
      const res = await api.post('/transacciones/transferir', transferencia);
      setExito(res.data.msg);
      setTransferencia({ ...transferencia, numero_cuenta_destino: '', monto: '', descripcion: '' });
      obtenerHistorial();
      if (typeof refreshSession === 'function') refreshSession();
      // Recargar datos del usuario para reflejar saldo actualizado
      setTimeout(() => { setMostrarModal(false); setExito(''); }, 2500);
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Error al procesar la transferencia.');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Hola de nuevo, {user?.nombre?.split(' ')[0]} 👋</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Aquí tienes un resumen de tus finanzas al día de hoy.</p>
      </div>

      <div className="dashboard-grid">
        <div className="left-panel">
          {/* Main Balance & Card */}
          <div className="card-glass" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'center' }}>
              <div>
                <p className="balance-label">SALDO TOTAL DISPONIBLE</p>
                <h1 className="balance-value">${saldoTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h1>
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontWeight: '600' }}>
                    <ArrowUpRight size={18} />
                    <span>Ingresos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: '600' }}>
                    <ArrowDownLeft size={18} />
                    <span>Gastos</span>
                  </div>
                </div>
              </div>

              {/* Virtual Credit Card */}
              <div className={`credit-card ${user?.tarjetas?.length > 0 ? (user.tarjetas[0].marca === 'Visa' ? 'card-visa' : user.tarjetas[0].marca === 'Mastercard' ? 'card-master' : 'card-amex') : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Shield size={24} color="#fff" />
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.6rem', opacity: 0.8 }}>{user?.tarjetas?.length > 0 ? user.tarjetas[0].tipo.toUpperCase() : 'PLATINUM'}</p>
                    <p style={{ fontWeight: '800', fontSize: '0.9rem' }}>{user?.tarjetas?.length > 0 ? user.tarjetas[0].marca.toUpperCase() : 'BANCO CON'}</p>
                  </div>
                </div>
                <div className="chip"></div>
                <div>
                  <p className="card-number">{user?.tarjetas?.length > 0 ? user.tarjetas[0].numero_tarjeta : `**** **** **** ${user?.cedula?.slice(-4) || '8842'}`}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.7rem' }}>
                    <span>{user?.nombre?.toUpperCase()}</span>
                    <span>{user?.tarjetas?.length > 0 ? user.tarjetas[0].fecha_expiracion : '12/28'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action - solo Enviar Dinero */}
          <div style={{ marginBottom: '2rem' }}>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMostrarModal(true)}>
              <Send size={18} /> Enviar Dinero
            </button>
          </div>

          {/* Recent Activity - conectado al historial real */}
          <div className="card-glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Actividad Reciente</h3>
              <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>Últimas {historial.length}</span>
            </div>
            
            <div className="transaction-list">
              {historial.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>
                  No hay transacciones recientes aún.
                </p>
              ) : (
                historial.map(tx => {
                  const esMiCuenta = user?.cuentas?.some(c => c.id === tx.cuenta_origen_id);
                  const esIngreso = !esMiCuenta;
                  return (
                    <div key={tx.id} className="transaction-item">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="transaction-icon">
                          {esIngreso ? <ArrowDownLeft size={20} color="#10b981" /> : <Send size={20} color="#6366f1" />}
                        </div>
                        <div className="transaction-info">
                          <h4>{tx.descripcion || 'Transferencia'}</h4>
                          <p>
                            {esIngreso ? 'Recibido de' : 'Enviado a'} · {tx.cuenta_origen?.numero_cuenta || tx.cuenta_destino?.numero_cuenta} · {formatearFecha(tx.created_at)}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className={`amount ${esIngreso ? 'positive' : 'negative'}`}>
                          {esIngreso ? '+' : '-'}${parseFloat(tx.monto).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="right-panel">
          {/* Expenses Breakdown */}
          <div className="card-glass" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Mis Cuentas</h3>
              <MoreVertical size={18} color="var(--text-secondary)" />
            </div>
            {user?.cuentas?.length > 0 ? (
              user.cuentas.map(cuenta => (
                <div key={cuenta.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>N° {cuenta.numero_cuenta}</p>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>${parseFloat(cuenta.saldo).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{cuenta.tipo_cuenta || 'Cuenta Corriente'}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No tienes cuentas registradas.</p>
            )}
          </div>

          {/* Security Banner */}
          <div className="card-glass" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))', border: '1px dashed var(--primary)' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <Shield size={32} color="var(--primary)" />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '5px' }}>Seguridad Activa</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Tu cuenta está protegida con encriptación de grado militar AES-256.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE TRANSFERENCIA */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Enviar Dinero</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Transferencia bancaria segura</p>
              </div>
              <button onClick={() => { setMostrarModal(false); setErrorMsg(''); setExito(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {exito && (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--secondary)', borderRadius: '12px', padding: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)' }}>
                <CheckCircle size={20} />
                <span style={{ fontWeight: '600' }}>{exito}</span>
              </div>
            )}

            {errorMsg && (
              <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid #f43f5e', borderRadius: '12px', padding: '15px', marginBottom: '20px', color: '#f43f5e', fontWeight: '600' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="input-label">Cuenta Origen</label>
                <select
                  className="input-field"
                  value={transferencia.cuenta_origen_id}
                  onChange={e => setTransferencia({ ...transferencia, cuenta_origen_id: e.target.value })}
                >
                  {user?.cuentas?.map(c => (
                    <option key={c.id} value={c.id}>N° {c.numero_cuenta} — ${parseFloat(c.saldo).toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Número de Cuenta Destino</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. 1234567890"
                  value={transferencia.numero_cuenta_destino}
                  onChange={e => setTransferencia({ ...transferencia, numero_cuenta_destino: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Monto a Transferir</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  min="0.01"
                  value={transferencia.monto}
                  onChange={e => setTransferencia({ ...transferencia, monto: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Descripción (opcional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Pago de alquiler"
                  value={transferencia.descripcion}
                  onChange={e => setTransferencia({ ...transferencia, descripcion: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={enviarDinero}
                disabled={loading || !transferencia.numero_cuenta_destino || !transferencia.monto}
              >
                {loading ? 'Procesando...' : <><Send size={16} /> Confirmar Transferencia</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
