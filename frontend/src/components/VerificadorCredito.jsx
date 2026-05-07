import { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, CreditCard, TrendingUp, FileText, Loader } from 'lucide-react';
import api from '../api/api';
import '../styles/VerificadorCredito.css';

/**
 * [COMPONENTE: VerificadorCredito]
 * Consulta la situación crediticia de un ciudadano mediante su cédula.
 * Conectado al sistema simulado SUGEF / Hacienda Costa Rica.
 */
export default function VerificadorCredito() {
  const [cedula, setCedula] = useState('');
  const [resultado, setResultado] = useState(null);
  const [consultando, setConsultando] = useState(false);
  const [errorConsulta, setErrorConsulta] = useState('');

  /**
   * [FUNCIÓN: consultarEstadoHacienda]
   * Dispara la petición al backend para verificar la situación
   * crediticia del ciudadano con la cédula ingresada.
   */
  const consultarEstadoHacienda = async () => {
    if (!cedula.trim() || cedula.replace(/\D/g, '').length < 9) {
      setErrorConsulta('Ingresa una cédula válida con al menos 9 dígitos.');
      return;
    }

    setConsultando(true);
    setResultado(null);
    setErrorConsulta('');

    try {
      const respuesta = await api.post('/credito/verificar', { cedula });
      setResultado(respuesta.data.data);
    } catch (err) {
      setErrorConsulta(err.response?.data?.msg || 'Error al conectar con el sistema de Hacienda.');
    } finally {
      setConsultando(false);
    }
  };

  /**
   * [FUNCIÓN: formatearColones]
   * Convierte un número a formato de colones costarricenses.
   */
  const formatearColones = (monto) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(monto);
  };

  /**
   * [FUNCIÓN: formatearFecha]
   * Convierte una fecha ISO al formato legible en español.
   */
  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const esApto = resultado && !resultado.enjaranado;

  return (
    <div className="verificador-container animate-fade">
      {/* ENCABEZADO */}
      <div className="verificador-header">
        <div className="verificador-header-icon">
          <FileText size={28} />
        </div>
        <div>
          <h2 className="verificador-titulo">Verificación Crediticia</h2>
          <p className="verificador-subtitulo">Consulta de situación tributaria — SUGEF / Hacienda de Costa Rica</p>
        </div>
      </div>

      {/* PANEL DE BÚSQUEDA */}
      <div className="verificador-buscador card-glass">
        <p className="verificador-instruccion">Ingresa el número de cédula nacional del solicitante para consultar su historial crediticio.</p>

        <div className="verificador-input-group">
          <div className="verificador-input-wrapper">
            <Search size={18} className="verificador-input-icon" />
            <input
              type="text"
              className="verificador-input"
              placeholder="Ej: 1-1234-5678"
              value={cedula}
              onChange={e => { setCedula(e.target.value); setErrorConsulta(''); }}
              onKeyDown={e => e.key === 'Enter' && consultarEstadoHacienda()}
              maxLength={12}
            />
          </div>
          <button
            className={`verificador-btn ${consultando ? 'verificador-btn--cargando' : ''}`}
            onClick={consultarEstadoHacienda}
            disabled={consultando}
          >
            {consultando
              ? <><Loader size={16} className="spin-icon" /> Consultando...</>
              : <><Search size={16} /> Verificar Cédula</>
            }
          </button>
        </div>

        {errorConsulta && (
          <div className="verificador-alerta-error">
            <AlertTriangle size={16} />
            <span>{errorConsulta}</span>
          </div>
        )}
      </div>

      {/* RESULTADO DE LA CONSULTA */}
      {resultado && (
        <div className={`verificador-resultado card-glass ${esApto ? 'resultado--apto' : 'resultado--denegado'}`}>

          {/* Banner de estado principal */}
          <div className={`resultado-banner ${esApto ? 'banner--verde' : 'banner--rojo'}`}>
            <div className="banner-icono">
              {esApto
                ? <CheckCircle size={48} />
                : <XCircle size={48} />
              }
            </div>
            <div className="banner-texto">
              <h3 className="banner-titulo">
                {esApto ? '✅ Apto para Tarjeta de Crédito' : '❌ Denegado por Deudas Pendientes'}
              </h3>
              <p className="banner-descripcion">{resultado.descripcion}</p>
            </div>
          </div>

          {/* Grid de métricas */}
          <div className="resultado-metricas">
            <div className="metrica-card">
              <TrendingUp size={20} className="metrica-icono" />
              <div>
                <p className="metrica-etiqueta">Puntaje SUGEF</p>
                <p className={`metrica-valor ${resultado.puntajeSUGEF >= 700 ? 'metrica--verde' : resultado.puntajeSUGEF >= 500 ? 'metrica--amarillo' : 'metrica--rojo'}`}>
                  {resultado.puntajeSUGEF} / 900
                </p>
              </div>
            </div>

            <div className="metrica-card">
              <FileText size={20} className="metrica-icono" />
              <div>
                <p className="metrica-etiqueta">Categoría de Riesgo</p>
                <p className={`metrica-valor ${esApto ? 'metrica--verde' : 'metrica--rojo'}`}>
                  {resultado.categoria}
                </p>
              </div>
            </div>

            <div className="metrica-card">
              <CreditCard size={20} className="metrica-icono" />
              <div>
                <p className="metrica-etiqueta">Deuda Registrada</p>
                <p className={`metrica-valor ${resultado.montoDeuda === 0 ? 'metrica--verde' : 'metrica--rojo'}`}>
                  {resultado.montoDeuda === 0 ? '₡0.00 — Sin deudas' : formatearColones(resultado.montoDeuda)}
                </p>
              </div>
            </div>

            {esApto && (
              <div className="metrica-card">
                <CreditCard size={20} className="metrica-icono" />
                <div>
                  <p className="metrica-etiqueta">Límite Sugerido</p>
                  <p className="metrica-valor metrica--verde">
                    {formatearColones(resultado.limiteSugerido)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pie de resultado */}
          <div className="resultado-pie">
            <p className="resultado-pie-texto">
              <strong>Cédula consultada:</strong> {resultado.cedula}
            </p>
            <p className="resultado-pie-texto">
              <strong>Fecha de consulta:</strong> {formatearFecha(resultado.fechaConsulta)}
            </p>
            <p className="resultado-pie-texto resultado-pie-fuente">
              Fuente: {resultado.entidadConsultada}
            </p>
          </div>
        </div>
      )}

      {/* AVISO LEGAL */}
      <div className="verificador-aviso">
        <AlertTriangle size={14} />
        <span>Esta herramienta es de uso exclusivo del personal autorizado. Todos los accesos quedan registrados en el sistema.</span>
      </div>
    </div>
  );
}
