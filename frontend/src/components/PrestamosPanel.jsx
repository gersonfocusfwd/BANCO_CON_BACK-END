import { useState, useEffect } from 'react';
import { Landmark, Info, CheckCircle, Clock, AlertCircle, DollarSign, Calendar, FileText } from 'lucide-react';
import api from '../api/api';

export default function PrestamosPanel({ user }) {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [solicitud, setSolicitud] = useState({
    monto: '',
    plazo_meses: '12',
    proposito: ''
  });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      const res = await api.get('/prestamos/mis-prestamos');
      setPrestamos(res.data.data);
    } catch (err) {
      console.error('Error al cargar préstamos', err);
    }
  };

  const handleSolicitud = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    try {
      await api.post('/prestamos/solicitar', solicitud);
      setMensaje({ type: 'success', text: 'Solicitud enviada con éxito. Un asesor la revisará pronto.' });
      setSolicitud({ monto: '', plazo_meses: '12', proposito: '' });
      fetchPrestamos();
    } catch (err) {
      setMensaje({ type: 'error', text: 'No se pudo procesar la solicitud.' });
    } finally {
      setLoading(false);
    }
  };

  const calcularCuota = () => {
    if (!solicitud.monto) return 0;
    const monto = parseFloat(solicitud.monto);
    const tasa = 0.155; // 15.5%
    const total = monto * (1 + tasa);
    return (total / parseInt(solicitud.plazo_meses)).toFixed(2);
  };

  return (
    <div className="animate-fade">
      <header className="admin-header">
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Soluciones de Crédito</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Obtén el financiamiento que necesitas con las tasas más competitivas del mercado.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '25px', marginTop: '30px' }}>
        
        {/* FORMULARIO DE SOLICITUD */}
        <section className="card-glass" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div className="brand-logo" style={{ width: '40px', height: '40px', background: 'var(--primary)' }}>
              <Landmark size={20} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Solicitar Préstamo</h3>
          </div>

          <form onSubmit={handleSolicitud} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="input-label">Monto Solicitado ($)</label>
              <input 
                type="number"
                className="input-field"
                placeholder="Ej: 5000"
                value={solicitud.monto}
                onChange={e => setSolicitud({...solicitud, monto: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="input-label">Plazo (Meses)</label>
              <select 
                className="input-field"
                value={solicitud.plazo_meses}
                onChange={e => setSolicitud({...solicitud, plazo_meses: e.target.value})}
              >
                <option value="6">6 Meses</option>
                <option value="12">12 Meses</option>
                <option value="24">24 Meses</option>
                <option value="36">36 Meses</option>
                <option value="48">48 Meses</option>
              </select>
            </div>

            <div>
              <label className="input-label">Propósito del Crédito</label>
              <textarea 
                className="input-field"
                style={{ height: '80px', padding: '12px', resize: 'none' }}
                placeholder="Describe brevemente para qué usarás los fondos..."
                value={solicitud.proposito}
                onChange={e => setSolicitud({...solicitud, proposito: e.target.value})}
              />
            </div>

            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tasa de Interés Anual:</span>
                <span style={{ fontWeight: '700', color: '#10b981' }}>15.5% (Fija)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cuota Mensual Estimada:</span>
                <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>${calcularCuota()}</span>
              </div>
            </div>

            {mensaje && (
              <div style={{ 
                padding: '15px', 
                borderRadius: '12px', 
                fontSize: '0.9rem',
                background: mensaje.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                color: mensaje.type === 'success' ? '#10b981' : '#f43f5e',
                border: `1px solid ${mensaje.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
              }}>
                {mensaje.text}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', height: '50px' }}>
              {loading ? 'Procesando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </section>

        {/* LISTADO DE PRESTAMOS */}
        <section className="card-glass" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div className="brand-logo" style={{ width: '40px', height: '40px', background: 'var(--secondary)' }}>
              <Clock size={20} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Mis Préstamos</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {prestamos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                <Info size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>No tienes préstamos activos o solicitudes pendientes.</p>
              </div>
            ) : (
              prestamos.map((p, i) => (
                <div key={i} style={{ 
                  padding: '20px', 
                  borderRadius: '20px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--glass-border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '0', 
                    right: '0', 
                    padding: '8px 15px', 
                    fontSize: '0.7rem', 
                    fontWeight: '800', 
                    textTransform: 'uppercase',
                    background: p.estado === 'aprobado' ? '#10b981' : p.estado === 'pendiente' ? '#f59e0b' : '#f43f5e',
                    color: '#fff'
                  }}>
                    {p.estado}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Monto Total</p>
                      <p style={{ fontSize: '1.4rem', fontWeight: '800' }}>${parseFloat(p.monto).toLocaleString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cuota Mensual</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>${parseFloat(p.monto_cuota).toLocaleString()}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '15px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Calendar size={14} /> <span>Plazo: {p.plazo_meses} meses</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <FileText size={14} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.proposito || 'Sin descripción'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
