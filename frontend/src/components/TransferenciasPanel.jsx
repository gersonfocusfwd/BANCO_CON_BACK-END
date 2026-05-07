import { useState, useEffect } from 'react';
import { ArrowLeftRight, Search, Send, User, CreditCard, History, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../api/api';

export default function TransferenciasPanel({ user, refreshSession }) {
  const [cuentas, setCuentas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transferencia, setTransferencia] = useState({
    cuenta_origen_id: '',
    numero_cuenta_destino: '',
    monto: '',
    descripcion: ''
  });
  const [resultado, setResultado] = useState(null);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [mostrarNuevoBenef, setMostrarNuevoBenef] = useState(false);
  const [nuevoBenef, setNuevoBenef] = useState({ nombre: '', numero_cuenta: '', alias: '' });

  useEffect(() => {
    fetchCuentas();
    fetchHistorial();
    fetchBeneficiarios();
  }, []);

  const fetchBeneficiarios = async () => {
    try {
      const res = await api.get('/extra/beneficiarios');
      setBeneficiarios(res.data.data);
    } catch (err) {
      console.error('Error al cargar beneficiarios');
    }
  };

  const handleAddBeneficiario = async (e) => {
    e.preventDefault();
    try {
      await api.post('/extra/beneficiarios', nuevoBenef);
      setNuevoBenef({ nombre: '', numero_cuenta: '', alias: '' });
      setMostrarNuevoBenef(false);
      fetchBeneficiarios();
    } catch (err) {
      alert('No se pudo guardar el beneficiario');
    }
  };

  const selectBeneficiario = (numero) => {
    setTransferencia({ ...transferencia, numero_cuenta_destino: numero });
  };

  const fetchCuentas = async () => {
    try {
      const res = await api.get('/cuentas/mis-cuentas');
      setCuentas(res.data.data);
      if (res.data.data.length > 0) {
        setTransferencia(prev => ({ ...prev, cuenta_origen_id: res.data.data[0].id }));
      }
    } catch (err) {
      console.error('Error al cargar cuentas', err);
    }
  };

  const fetchHistorial = async () => {
    try {
      const res = await api.get('/transacciones/mi-historial');
      setHistorial(res.data.data);
    } catch (err) {
      console.error('Error al cargar historial', err);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    try {
      const res = await api.post('/transacciones/transferir', transferencia);
      setResultado({ ok: true, msg: res.data.msg });
      setTransferencia({
        ...transferencia,
        numero_cuenta_destino: '',
        monto: '',
        descripcion: ''
      });
      fetchCuentas();
      fetchHistorial();
      if (typeof refreshSession === 'function') refreshSession();
    } catch (err) {
      setResultado({ ok: false, msg: err.response?.data?.msg || 'Error al procesar la transferencia' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade">
      <header className="admin-header">
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Centro de Transferencias</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Mueve tus fondos de forma instantánea y segura a cualquier cuenta del sistema.</p>
      </header>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '25px', marginTop: '30px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* FORMULARIO DE TRANSFERENCIA */}
          <section className="card-glass" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div className="brand-logo" style={{ width: '40px', height: '40px', background: 'var(--primary)' }}>
                <Send size={20} color="#fff" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Nueva Transferencia</h3>
            </div>

            <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="input-label">Seleccionar Cuenta Origen</label>
                <select 
                  className="input-field"
                  value={transferencia.cuenta_origen_id}
                  onChange={e => setTransferencia({...transferencia, cuenta_origen_id: e.target.value})}
                >
                  {cuentas.map(c => (
                    <option key={c.id} value={c.id}>
                      {(c.tipo_cuenta || 'Cuenta').toUpperCase()} - {c.numero_cuenta} (${parseFloat(c.saldo).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Número de Cuenta Destino</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Ej: 123456789"
                    value={transferencia.numero_cuenta_destino}
                    onChange={e => setTransferencia({...transferencia, numero_cuenta_destino: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Monto a Transferir ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={transferencia.monto}
                  onChange={e => setTransferencia({...transferencia, monto: e.target.value})}
                  required
                />
              </div>

              {resultado && (
                <div style={{ 
                  padding: '15px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  fontSize: '0.9rem',
                  background: resultado.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                  color: resultado.ok ? '#10b981' : '#f43f5e',
                  border: `1px solid ${resultado.ok ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                }}>
                  {resultado.ok ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                  {resultado.msg}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', height: '50px', fontSize: '1rem', marginTop: '10px' }}>
                {loading ? 'Procesando...' : 'Confirmar Envío'}
              </button>
            </form>
          </section>

          {/* BENEFICIARIOS */}
          <section className="card-glass" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Beneficiarios</h3>
              <button 
                onClick={() => setMostrarNuevoBenef(!mostrarNuevoBenef)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem' }}
              >
                {mostrarNuevoBenef ? 'Cerrar' : '+ Agregar'}
              </button>
            </div>

            {mostrarNuevoBenef && (
              <form onSubmit={handleAddBeneficiario} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                <input className="input-field" placeholder="Nombre real" value={nuevoBenef.nombre} onChange={e => setNuevoBenef({...nuevoBenef, nombre: e.target.value})} required />
                <input className="input-field" placeholder="Número de cuenta" value={nuevoBenef.numero_cuenta} onChange={e => setNuevoBenef({...nuevoBenef, numero_cuenta: e.target.value})} required />
                <input className="input-field" placeholder="Alias (opcional)" value={nuevoBenef.alias} onChange={e => setNuevoBenef({...nuevoBenef, alias: e.target.value})} />
                <button type="submit" className="btn-primary" style={{ height: '35px', fontSize: '0.8rem', justifyContent: 'center' }}>Guardar Beneficiario</button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {beneficiarios.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No tienes contactos guardados.</p>
              ) : (
                beneficiarios.map((b, i) => (
                  <div key={i} className="beneficiario-item" onClick={() => selectBeneficiario(b.numero_cuenta)} style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', cursor: 'pointer' 
                  }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
                      {b.nombre.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.85rem' }}>{b.alias || b.nombre}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{b.numero_cuenta}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* HISTORIAL RECIENTE */}
        <section className="card-glass" style={{ padding: '30px', maxHeight: '650px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div className="brand-logo" style={{ width: '40px', height: '40px', background: 'var(--secondary)' }}>
              <History size={20} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Movimientos Recientes</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {historial.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No se registran transacciones recientes.
              </div>
            ) : (
              historial.map((t, i) => {
                const isSent = cuentas.some(c => c.id === t.cuenta_origen_id);
                return (
                  <div key={i} className="transaction-item" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '15px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: isSent ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: isSent ? '#f43f5e' : '#10b981'
                      }}>
                        {isSent ? <ArrowLeftRight size={18} style={{ transform: 'rotate(180deg)' }} /> : <ArrowLeftRight size={18} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{isSent ? 'Transferencia Enviada' : 'Transferencia Recibida'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {new Date(t.createdAt).toLocaleDateString()} · {t.descripcion}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontWeight: '800', 
                        fontSize: '1rem',
                        color: isSent ? '#f43f5e' : '#10b981'
                      }}>
                        {isSent ? '-' : '+'}${parseFloat(t.monto).toLocaleString()}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        {isSent ? `Para: ${t.cuenta_destino?.numero_cuenta}` : `De: ${t.cuenta_origen?.numero_cuenta}`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
