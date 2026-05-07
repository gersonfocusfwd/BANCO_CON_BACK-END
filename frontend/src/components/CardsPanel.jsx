import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Shield, MoreVertical, X, Calendar, Lock } from 'lucide-react';
import api from '../api/api';

export default function CardsPanel({ user }) {
  const [tarjetas, setTarjetas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    tipo: 'Debito',
    marca: 'Visa',
    limite: 0
  });

  const obtenerTarjetas = async () => {
    try {
      const res = await api.get('/tarjetas');
      setTarjetas(res.data.data);
    } catch (err) {
      console.error('Error al obtener tarjetas', err);
    }
  };

  const crearTarjeta = async () => {
    setLoading(true);
    try {
      // Generar datos aleatorios realistas (20 dígitos)
      const num1 = Math.floor(Math.random() * 9000000000) + 1000000000;
      const num2 = Math.floor(Math.random() * 9000000000) + 1000000000;
      const fullNum = num1.toString() + num2.toString();
      const numero = fullNum.match(/.{1,4}/g).join(' ');
      const cvv = Math.floor(Math.random() * 900) + 100;
      
      // Fecha de expiración (2 años desde hoy)
      const now = new Date();
      const expMonth = String(now.getMonth() + 1).padStart(2, '0');
      const expYear = String(now.getFullYear() + 2).slice(-2);
      const fechaExp = `${expMonth}/${expYear}`;

      await api.post('/tarjetas', {
        ...nuevaTarjeta,
        numero_tarjeta: numero,
        cvv: cvv.toString(),
        fecha_expiracion: fechaExp
      });

      setMostrarModal(false);
      obtenerTarjetas();
      alert('✅ Tarjeta emitida y vinculada correctamente.');
    } catch (err) {
      alert('❌ Error al emitir la tarjeta.');
    } finally {
      setLoading(false);
    }
  };

  const eliminarTarjeta = async (id) => {
    if (window.confirm('🚨 ¿Deseas dar de baja esta tarjeta definitivamente?')) {
      try {
        await api.delete(`/tarjetas/${id}`);
        obtenerTarjetas();
      } catch (err) {
        alert('❌ No se pudo eliminar la tarjeta.');
      }
    }
  };

  useEffect(() => {
    obtenerTarjetas();
  }, []);

  const getCardClass = (marca) => {
    if (marca === 'Visa') return 'card-visa';
    if (marca === 'Mastercard') return 'card-master';
    if (marca === 'American Express') return 'card-amex';
    return '';
  };

  return (
    <div className="animate-fade">
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Tus Tarjetas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gestiona tus métodos de pago físicos y virtuales.</p>
        </div>
        <button className="btn-primary" onClick={() => setMostrarModal(true)}>
          <Plus size={18} /> Solicitar Nueva
        </button>
      </header>

      {tarjetas.length === 0 ? (
        <div className="card-glass" style={{ textAlign: 'center', padding: '4rem', marginTop: '2rem' }}>
          <CreditCard size={64} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <h3 style={{ color: 'var(--text-secondary)' }}>No tienes tarjetas activas</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Solicita tu primera tarjeta ahora mismo.</p>
        </div>
      ) : (
        <div className="card-grid">
          {tarjetas.map(card => (
            <div key={card.id} className={`credit-card ${getCardClass(card.marca)}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Shield size={24} color="#fff" />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.6rem', opacity: 0.8 }}>{card.tipo.toUpperCase()}</p>
                  <p style={{ fontWeight: '800', fontSize: '0.9rem' }}>{card.marca.toUpperCase()}</p>
                </div>
              </div>

              <div className="chip"></div>

              <div>
                <p className="card-number">{card.numero_tarjeta}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase' }}>Titular</p>
                    <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{user?.nombre?.toUpperCase()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase' }}>Vence</p>
                    <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{card.fecha_expiracion}</p>
                  </div>
                  <button 
                    onClick={() => eliminarTarjeta(card.id)}
                    style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer', marginLeft: '10px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL SOLICITUD */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Nueva Tarjeta</h3>
              <button onClick={() => setMostrarModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="input-label">Tipo de Producto</label>
                <select 
                  className="input-field"
                  value={nuevaTarjeta.tipo}
                  onChange={e => setNuevaTarjeta({...nuevaTarjeta, tipo: e.target.value})}
                >
                  <option value="Debito">Débito Gold</option>
                  <option value="Credito">Crédito Platinum</option>
                </select>
              </div>

              <div>
                <label className="input-label">Franquicia</label>
                <select 
                  className="input-field"
                  value={nuevaTarjeta.marca}
                  onChange={e => setNuevaTarjeta({...nuevaTarjeta, marca: e.target.value})}
                >
                  <option value="Visa">Visa Global</option>
                  <option value="Mastercard">Mastercard World</option>
                  <option value="American Express">American Express Elite</option>
                </select>
              </div>

              {nuevaTarjeta.tipo === 'Credito' && (
                <div>
                  <label className="input-label">Límite Solicitado</label>
                  <input 
                    type="number"
                    className="input-field"
                    placeholder="5000"
                    value={nuevaTarjeta.limite}
                    onChange={e => setNuevaTarjeta({...nuevaTarjeta, limite: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '15px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={crearTarjeta}
                disabled={loading}
              >
                {loading ? 'Emitiendo...' : 'Solicitar Ahora'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
