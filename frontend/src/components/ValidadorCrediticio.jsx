/**
 * /////////////////////////////////////////////////////////////
 * // COMPONENTE: ValidadorCrediticio.jsx
 * // Sistema de Validación Crediticia Integral — Banco CON
 * // Fuentes: Hacienda CR (SUGEF) + Registro Nacional CR
 * /////////////////////////////////////////////////////////////
 */

// ── SECCIÓN: IMPORTS ─────────────────────────────────────────
import { useState } from 'react';
import {
  Search, Loader, AlertTriangle, CheckCircle, XCircle,
  FileText, Car, Home, BarChart2, TrendingUp, Building
} from 'lucide-react';
import api from '../api/api';
import '../styles/Validacion.css';

// ── SECCIÓN: COMPONENTE PRINCIPAL ────────────────────────────
export default function ValidadorCrediticio() {

  // ── SECCIÓN: ESTADO ──────────────────────────────────────
  const [cedula, setCedula]       = useState('');
  const [resultado, setResultado] = useState(null);
  const [consultando, setConsultando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  // ── SECCIÓN: FUNCIONES ───────────────────────────────────

  /**
   * [FUNCIÓN: obtenerDatosCompletosPersona]
   * Dispara la consulta simultánea a Hacienda + Registro Nacional.
   * Usa el endpoint /credito/perfil-completo del backend.
   */
  const obtenerDatosCompletosPersona = async () => {
    const cedulaLimpia = cedula.replace(/\D/g, '');
    if (cedulaLimpia.length < 9) {
      setErrorMensaje('Ingresa una cédula válida con al menos 9 dígitos.');
      return;
    }

    setConsultando(true);
    setResultado(null);
    setErrorMensaje('');

    try {
      const respuesta = await api.post('/credito/perfil-completo', { cedula: cedulaLimpia });
      setResultado(respuesta.data.data);
    } catch (err) {
      setErrorMensaje(err.response?.data?.msg || 'Error al conectar con los sistemas de consulta.');
    } finally {
      setConsultando(false);
    }
  };

  /**
   * [FUNCIÓN: formatearColones]
   * Convierte un número al formato de moneda local (₡).
   */
  const formatearColones = (monto) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(monto);

  /**
   * [FUNCIÓN: calcularColorPuntaje]
   * Retorna la clase CSS y color de barra según el puntaje SUGEF.
   */
  const calcularColorPuntaje = (puntaje) => {
    if (puntaje >= 700) return { clase: 'dato-valor--verde',    color: '#10b981', porcentaje: `${(puntaje / 900) * 100}%` };
    if (puntaje >= 500) return { clase: 'dato-valor--amarillo', color: '#f59e0b', porcentaje: `${(puntaje / 900) * 100}%` };
    return { clase: 'dato-valor--rojo', color: '#f43f5e', porcentaje: `${(puntaje / 900) * 100}%` };
  };

  // ── SECCIÓN: RENDERIZADO ─────────────────────────────────
  const tributaria  = resultado?.situacionTributaria;
  const patrimonio  = resultado?.resumenPatrimonio;
  const esPreAprobado = resultado?.creditoPreAprobado;
  const puntajeInfo = tributaria ? calcularColorPuntaje(tributaria.puntajeSUGEF) : null;

  return (
    <div className="validacion-container animate-fade">

      {/* ── ENCABEZADO ───────────────────────────────────── */}
      <div className="validacion-header">
        <div className="validacion-header-icono">
          <BarChart2 size={28} />
        </div>
        <div>
          <h2 className="validacion-titulo">Validación Crediticia Integral</h2>
          <p className="validacion-subtitulo">
            Hacienda CR (SUGEF) · Registro Nacional de Costa Rica
          </p>
        </div>
      </div>

      {/* ── PANEL DE BÚSQUEDA ────────────────────────────── */}
      <div className="validacion-buscador card-glass">
        <p className="validacion-instruccion">
          Ingresa una cédula de 9 dígitos para realizar la consulta oficial al sistema SUGEF / Hacienda / Registro Nacional.
        </p>

        <div className="validacion-input-grupo">
          <div className="validacion-input-wrapper">
            <Search size={18} className="validacion-input-icono" />
            <input
              type="text"
              className="validacion-input"
              placeholder="Ej: 109870456 (9 dígitos)"
              value={cedula}
              onChange={e => { setCedula(e.target.value); setErrorMensaje(''); }}
              onKeyDown={e => e.key === 'Enter' && obtenerDatosCompletosPersona()}
              maxLength={12}
            />
          </div>
          <button
            className="validacion-btn"
            onClick={obtenerDatosCompletosPersona}
            disabled={consultando}
          >
            {consultando
              ? <><Loader size={16} className="spin" /> Consultando...</>
              : <><Search size={16} /> Validar Perfil</>
            }
          </button>
        </div>

        {errorMensaje && (
          <div className="validacion-error">
            <AlertTriangle size={16} />
            <span>{errorMensaje}</span>
          </div>
        )}
      </div>

      {/* ── RESULTADOS ───────────────────────────────────── */}
      {resultado && (
        <>
          {/* Banner de Pre-Aprobación */}
          <div className={`banner-preaprobado ${esPreAprobado ? 'banner-preaprobado--verde' : 'banner-preaprobado--rojo'}`}>
            <div className="banner-icono-grande">
              {esPreAprobado
                ? <CheckCircle size={52} color="#10b981" />
                : <XCircle    size={52} color="#f43f5e" />
              }
            </div>
            <div>
              <p className="banner-etiqueta">Consulta Oficial — Cédula {resultado.cedula}</p>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: '4px 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {resultado.nombre}
              </h2>
              <h3 className={`banner-titulo-grande ${esPreAprobado ? 'banner-titulo-grande--verde' : 'banner-titulo-grande--rojo'}`}>
                {esPreAprobado ? '✅ CRÉDITO PRE-APROBADO' : '❌ CRÉDITO NO APROBADO'}
              </h3>
              <p className="banner-descripcion">
                {esPreAprobado
                  ? 'El solicitante está al día en Hacienda y posee bienes registrados como garantía.'
                  : 'El solicitante presenta atrasos tributarios o no registra bienes suficientes como respaldo.'}
              </p>
            </div>
          </div>

          {/* Grid de secciones */}
          <div className="validacion-secciones">

            {/* Tarjeta: Hacienda / SUGEF */}
            <div className="seccion-card card-glass">
              <div className="seccion-encabezado">
                <div className="seccion-encabezado-icono icono--hacienda">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="seccion-titulo">Situación Tributaria</p>
                  <p className="seccion-fuente">Ministerio de Hacienda · SUGEF CR</p>
                </div>
              </div>

              <div className="dato-fila">
                <span className="dato-etiqueta">Estado Tributario</span>
                <span className={`dato-valor ${tributaria.alDia ? 'dato-valor--verde' : 'dato-valor--rojo'}`}>
                  {tributaria.alDia ? '✓ Al Día' : '✗ ' + tributaria.estado}
                </span>
              </div>
              <div className="dato-fila">
                <span className="dato-etiqueta">Categoría de Riesgo</span>
                <span className="dato-valor dato-valor--blanco">{tributaria.categoria}</span>
              </div>
              <div className="dato-fila">
                <span className="dato-etiqueta">Descripción</span>
                <span className="dato-valor dato-valor--blanco" style={{ textAlign: 'right', maxWidth: '55%', fontSize: '0.78rem' }}>
                  {tributaria.descripcion}
                </span>
              </div>
              <div className="dato-fila">
                <span className="dato-etiqueta">Deuda Registrada</span>
                <span className={`dato-valor ${tributaria.montoDeuda === 0 ? 'dato-valor--verde' : 'dato-valor--rojo'}`}>
                  {tributaria.montoDeuda === 0 ? '₡0 — Sin deudas' : formatearColones(tributaria.montoDeuda)}
                </span>
              </div>

              {/* Barra de puntaje SUGEF */}
              <div className="dato-fila" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <span className="dato-etiqueta">Puntaje SUGEF</span>
                <div className="puntaje-bar-wrapper" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className={`dato-valor ${puntajeInfo.clase}`}>{tributaria.puntajeSUGEF}</span>
                    <span className="dato-etiqueta">/ 900</span>
                  </div>
                  <div className="puntaje-bar-track">
                    <div className="puntaje-bar-fill" style={{ width: puntajeInfo.porcentaje, background: puntajeInfo.color }} />
                  </div>
                </div>
              </div>

              {tributaria.limiteSugerido > 0 && (
                <div className="dato-fila">
                  <span className="dato-etiqueta">Límite de Crédito Sugerido</span>
                  <span className="dato-valor dato-valor--verde">{formatearColones(tributaria.limiteSugerido)}</span>
                </div>
              )}
            </div>

            {/* Tarjeta: Resumen de Patrimonio */}
            <div className="seccion-card card-glass">
              <div className="seccion-encabezado">
                <div className="seccion-encabezado-icono icono--resumen">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="seccion-titulo">Resumen de Patrimonio</p>
                  <p className="seccion-fuente">Registro Nacional CR</p>
                </div>
              </div>

              <div className="dato-fila">
                <span className="dato-etiqueta">Vehículos Registrados</span>
                <span className={`dato-valor ${patrimonio.totalVehiculos > 0 ? 'dato-valor--verde' : 'dato-valor--rojo'}`}>
                  {patrimonio.totalVehiculos} vehículo{patrimonio.totalVehiculos !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="dato-fila">
                <span className="dato-etiqueta">Propiedades Registradas</span>
                <span className={`dato-valor ${patrimonio.totalPropiedades > 0 ? 'dato-valor--verde' : 'dato-valor--rojo'}`}>
                  {patrimonio.totalPropiedades} propiedad{patrimonio.totalPropiedades !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="dato-fila">
                <span className="dato-etiqueta">Valor Estimado Vehículos</span>
                <span className="dato-valor dato-valor--blanco">
                  {patrimonio.totalVehiculos > 0 ? formatearColones(patrimonio.valorEstimadoVehiculos) : 'N/A'}
                </span>
              </div>
              <div className="dato-fila">
                <span className="dato-etiqueta">Valor Catastral Inmuebles</span>
                <span className="dato-valor dato-valor--blanco">
                  {patrimonio.totalPropiedades > 0 ? formatearColones(patrimonio.valorEstimadoPropiedades) : 'N/A'}
                </span>
              </div>
              <div className="dato-fila">
                <span className="dato-etiqueta">Patrimonio Total Estimado</span>
                <span className="dato-valor dato-valor--verde">
                  {formatearColones(patrimonio.valorEstimadoVehiculos + patrimonio.valorEstimadoPropiedades)}
                </span>
              </div>
            </div>

            {/* Tarjeta: Vehículos */}
            <div className="seccion-card card-glass validacion-seccion-ancha">
              <div className="seccion-encabezado">
                <div className="seccion-encabezado-icono icono--vehiculos">
                  <Car size={20} />
                </div>
                <div>
                  <p className="seccion-titulo">Bienes Muebles — Vehículos</p>
                  <p className="seccion-fuente">Registro Nacional · Ministerio de Obras Públicas y Transportes</p>
                </div>
              </div>

              {resultado.listaVehiculos.length === 0 ? (
                <div className="estado-vacio">
                  <Car size={32} />
                  <p>No se encontraron vehículos registrados a nombre de esta cédula.</p>
                </div>
              ) : (
                resultado.listaVehiculos.map((v, i) => (
                  <div key={i} className="item-card">
                    <p className="item-titulo">🚗 {v.marca} {v.modelo} — <span style={{ color: '#94a3b8' }}>Placa: {v.placa}</span></p>
                    <div className="item-detalle">
                      <span>Color: {v.color}</span>
                      <span>Cilindrada: {v.cilindrada}cc</span>
                    </div>
                    <p className="item-valor">Valor Fiscal: {formatearColones(v.valorFiscal)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Tarjeta: Propiedades */}
            <div className="seccion-card card-glass validacion-seccion-ancha">
              <div className="seccion-encabezado">
                <div className="seccion-encabezado-icono icono--inmuebles">
                  <Home size={20} />
                </div>
                <div>
                  <p className="seccion-titulo">Bienes Inmuebles — Propiedades</p>
                  <p className="seccion-fuente">Registro Nacional · Catastro Nacional de Costa Rica</p>
                </div>
              </div>

              {resultado.listaPropiedades.length === 0 ? (
                <div className="estado-vacio">
                  <Building size={32} />
                  <p>No se encontraron propiedades registradas a nombre de esta cédula.</p>
                </div>
              ) : (
                resultado.listaPropiedades.map((p, i) => (
                  <div key={i} className="item-card">
                    <p className="item-titulo">🏠 {p.tipo} — <span style={{ color: '#94a3b8' }}>Folio: {p.folio}</span></p>
                    <div className="item-detalle">
                      <span>Provincia: {p.provincia}</span>
                      <span>Distrito: {p.distrito}</span>
                      <span>Área: {p.areaConstruccion} m²</span>
                    </div>
                    <p className="item-valor">Valor Catastral: {formatearColones(p.valorCatastral)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* ── AVISO LEGAL ──────────────────────────────────── */}
      <div className="validacion-aviso">
        <AlertTriangle size={14} />
        <span>
          Uso exclusivo del personal bancario autorizado. Toda consulta queda registrada con bitácora de auditoría.
          Los datos tributarios son obtenidos en tiempo real desde el Ministerio de Hacienda de Costa Rica.
        </span>
      </div>
    </div>
  );
}
