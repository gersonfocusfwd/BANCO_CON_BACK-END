import { useState, useEffect } from 'react';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import api from '../api/api';

export default function EstadisticasPanel({ user }) {
  const [stats, setStats] = useState({
    balanceTotal: 0,
    ingresosMes: 0,
    egresosMes: 0,
    ahorroEstimado: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cuentasRes, transRes] = await Promise.all([
          api.get('/cuentas/mis-cuentas'),
          api.get('/transacciones/mi-historial')
        ]);

        const cuentas = cuentasRes.data.data;
        const transacciones = transRes.data.data;

        const total = cuentas.reduce((sum, c) => sum + parseFloat(c.saldo), 0);
        
        // Calcular ingresos y egresos del mes actual
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        
        let ingresos = 0;
        let egresos = 0;

        transacciones.forEach(t => {
          const tDate = new Date(t.createdAt);
          if (tDate >= firstDay) {
            const isSent = cuentas.some(c => c.id === t.cuenta_origen_id);
            if (isSent) egresos += parseFloat(t.monto);
            else ingresos += parseFloat(t.monto);
          }
        });

        setStats({
          balanceTotal: total,
          ingresosMes: ingresos,
          egresosMes: egresos,
          ahorroEstimado: total * 0.15 // Simulación
        });
      } catch (err) {
        console.error('Error al cargar estadísticas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const dataCategorias = [
    { label: 'Vivienda', color: '#6366f1', percent: 40 },
    { label: 'Alimentación', color: '#10b981', percent: 25 },
    { label: 'Transporte', color: '#f59e0b', percent: 15 },
    { label: 'Ocio', color: '#f43f5e', percent: 20 }
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Analizando activos...</div>;

  return (
    <div className="animate-fade">
      <header className="admin-header">
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Análisis Patrimonial</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Visualiza el rendimiento de tus finanzas y proyecciones de crecimiento.</p>
      </header>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div className="card-glass" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Balance Total</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: '800' }}>${stats.balanceTotal.toLocaleString()}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', color: '#10b981', fontSize: '0.8rem' }}>
            <ArrowUpRight size={14} /> <span>+2.4% vs mes anterior</span>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Ingresos Mes</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: '800' }}>${stats.ingresosMes.toLocaleString()}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>Desde el 1 de este mes</p>
        </div>

        <div className="card-glass" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={18} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Egresos Mes</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: '800' }}>${stats.egresosMes.toLocaleString()}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>Salida de capital</p>
        </div>

        <div className="card-glass" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Ahorro Sugerido</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: '800' }}>${stats.ahorroEstimado.toLocaleString()}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>15% de tus activos</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '25px', marginTop: '25px' }}>
        {/* Gráfico de Barras de Actividad */}
        <div className="card-glass" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Flujo de Efectivo Semanal</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary)' }}></div>
                <span>Ingresos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--secondary)' }}></div>
                <span>Egresos</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '250px', paddingBottom: '20px' }}>
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '12%' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '200px', width: '100%' }}>
                  <div style={{ 
                    flex: 1, 
                    background: 'var(--primary)', 
                    height: `${20 + (i * 10) % 80}%`, 
                    borderRadius: '4px 4px 0 0',
                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
                  }}></div>
                  <div style={{ 
                    flex: 1, 
                    background: 'var(--secondary)', 
                    height: `${10 + (i * 15) % 60}%`, 
                    borderRadius: '4px 4px 0 0',
                    boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
                  }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución de Gastos */}
        <div className="card-glass" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '30px' }}>Distribución de Gastos</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {dataCategorias.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{cat.label}</span>
                  <span style={{ fontWeight: '700' }}>{cat.percent}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percent}%`, height: '100%', background: cat.color, borderRadius: '10px' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '5px' }}>Consejo de IA</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Tus gastos en "Ocio" han subido un 12% esta semana. Podrías ahorrar hasta $200 si reduces salidas frecuentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
