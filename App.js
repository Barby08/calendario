import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const CALENDAR_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>Mi Calendario Home / Oficina 🎀</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --rosa: #FF8FC1;
    --rosa-fuerte: #FF5FA8;
    --morado: #B18CFF;
    --morado-fuerte: #9163F5;
    --morado-oscuro: #5B3A73;
    --azul: #6FD6EF;
    --azul-fuerte: #45C4E6;
    --fondo: #FFF6FB;
    --blanco: #ffffff;
    --gris: #E8DFF0;
    --gris-txt: #A79AB8;
    --sombra: 0 10px 30px rgba(155, 108, 200, 0.15);
    --sombra-fuerte: 0 15px 40px rgba(155, 108, 200, 0.25);
    --radio: 24px;
    --radio-chico: 14px;
  }

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  html, body {
    margin: 0;
    padding: 0;
    background: var(--fondo);
    color: var(--morado-oscuro);
    font-family: 'Quicksand', system-ui, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
  }

  h1, h2, h3, h4 {
    font-family: 'Fredoka', system-ui, sans-serif;
    font-weight: 600;
    color: var(--morado-oscuro);
    margin: 0;
  }

  button {
    font-family: 'Quicksand', system-ui, sans-serif;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  input, select {
    font-family: 'Quicksand', system-ui, sans-serif;
    color: var(--morado-oscuro);
    font-size: 16px; /* Prevent iOS zoom on focus */
  }

  /* ---------- Fondo con blobs animados ---------- */
  .fondo-blobs {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.55;
    animation: flotar 18s ease-in-out infinite;
  }
  .blob.rosa   { background: var(--rosa);   width: 380px; height: 380px; top: -80px; left: -80px; animation-delay: 0s; }
  .blob.morado { background: var(--morado); width: 340px; height: 340px; top: 40%; right: -100px; animation-delay: -6s; }
  .blob.azul   { background: var(--azul);   width: 300px; height: 300px; bottom: -80px; left: 30%; animation-delay: -12s; }
  .blob.rosa2  { background: #FFB5D8;      width: 260px; height: 260px; top: 20%; left: 45%; animation-delay: -3s; opacity: 0.4; }

  @keyframes flotar {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(30px, -40px) scale(1.08); }
    66%      { transform: translate(-25px, 20px) scale(0.95); }
  }
  @media (prefers-reduced-motion: reduce) {
    .blob { animation: none; }
  }

  /* ---------- Layout general ---------- */
  .app {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px 16px 60px;
    overflow-x: hidden;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 12px;
  }
  header h1 {
    font-size: clamp(1.3rem, 4vw, 2rem);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-ajustes {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--blanco);
    box-shadow: var(--sombra);
    font-size: 1.3rem;
    transition: transform .35s ease, box-shadow .25s ease;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  /* ---------- Tarjeta Hoy ---------- */
  .card {
    background: var(--blanco);
    border-radius: var(--radio);
    box-shadow: var(--sombra);
    padding: 18px;
    margin-bottom: 18px;
  }

  .card-hoy {
    background: linear-gradient(135deg, #FFE8F3 0%, #F1E4FF 100%);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
    align-items: center;
    padding: 22px;
  }
  .emoji-hoy {
    font-size: clamp(3rem, 10vw, 5rem);
    line-height: 1;
    filter: drop-shadow(0 4px 8px rgba(155, 108, 200, 0.25));
  }
  .info-hoy .etiqueta { font-size: .82rem; font-weight: 600; color: var(--morado-fuerte); text-transform: uppercase; letter-spacing: 1px; }
  .info-hoy h2 { font-size: clamp(1.3rem, 4.5vw, 2.1rem); margin-top: 4px; }
  .info-hoy .fecha { margin-top: 6px; font-weight: 500; color: var(--morado-oscuro); opacity: 0.85; font-size: .9rem; }
  .info-hoy .semana { display: inline-block; margin-top: 8px; padding: 4px 12px; border-radius: 20px; background: var(--blanco); font-size: .8rem; font-weight: 600; color: var(--morado-fuerte); }

  /* ---------- Proximos dias ---------- */
  .proximos {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 8px;
  }
  .prox-dia {
    background: var(--blanco);
    border-radius: var(--radio-chico);
    padding: 10px 4px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(155, 108, 200, 0.08);
  }
  .prox-dia .p-dia { font-size: .7rem; font-weight: 600; color: var(--gris-txt); text-transform: uppercase; }
  .prox-dia .p-emoji { font-size: 1.4rem; margin: 3px 0; }
  .prox-dia .p-num { font-size: 1rem; font-weight: 700; font-family: 'Fredoka', sans-serif; }

  /* ---------- Buscador ---------- */
  .buscador { display: flex; gap: 8px; align-items: stretch; }
  .buscador input {
    flex: 1;
    min-width: 0;
    padding: 12px 14px;
    border-radius: var(--radio-chico);
    border: 2px solid var(--gris);
    background: var(--fondo);
    font-size: 1rem;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .buscador input:focus { outline: none; border-color: var(--rosa-fuerte); box-shadow: 0 0 0 3px rgba(255, 95, 168, 0.2); }
  .buscador button {
    padding: 0 16px;
    border-radius: var(--radio-chico);
    background: linear-gradient(135deg, var(--rosa-fuerte), var(--morado-fuerte));
    color: white;
    font-weight: 600;
    font-size: .95rem;
    box-shadow: 0 4px 12px rgba(255, 95, 168, 0.35);
    white-space: nowrap;
  }

  .resultado-busqueda {
    margin-top: 12px;
    padding: 12px 14px;
    background: linear-gradient(135deg, #FFF0F7, #F3EBFF);
    border-radius: var(--radio-chico);
    display: none;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .resultado-busqueda.mostrar { display: flex; }
  .resultado-busqueda .r-info { display: flex; align-items: center; gap: 8px; }
  .resultado-busqueda .r-emoji { font-size: 1.8rem; }
  .resultado-busqueda button {
    padding: 8px 14px;
    background: var(--blanco);
    border-radius: 12px;
    font-weight: 600;
    color: var(--morado-fuerte);
    box-shadow: 0 2px 8px rgba(155, 108, 200, 0.15);
  }

  /* ---------- Calendario ---------- */
  .cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .cal-header h3 { font-size: 1.2rem; text-transform: capitalize; }
  .cal-nav { display: flex; gap: 6px; }
  .cal-nav button {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--fondo);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--morado-fuerte);
  }

  .cal-dias-semana, .cal-cuadricula {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .cal-dias-semana { margin-bottom: 6px; }
  .cal-dias-semana div {
    text-align: center;
    font-size: .7rem;
    font-weight: 700;
    color: var(--gris-txt);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 4px 0;
  }

  .cal-celda {
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    border: 2px solid transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Fredoka', sans-serif;
    font-weight: 500;
    font-size: .85rem;
    position: relative;
    cursor: pointer;
    padding: 2px;
  }
  .cal-celda.vacio { visibility: hidden; cursor: default; }
  .cal-celda.home { background: linear-gradient(135deg, #FFC9E1, #FF9DC5); color: #7A2A56; }
  .cal-celda.oficina { background: linear-gradient(135deg, #B5E9F7, #7CD5EE); color: #17516A; }
  .cal-celda.finde { background: var(--gris); color: var(--gris-txt); }
  .cal-celda .c-emoji { font-size: .95rem; line-height: 1; }
  .cal-celda .c-num { line-height: 1; margin-top: 1px; }
  .cal-celda .c-marca {
    position: absolute;
    top: 1px;
    right: 3px;
    font-size: .6rem;
  }
  .cal-celda.hoy {
    border-color: var(--morado-fuerte);
    box-shadow: 0 0 0 3px rgba(145, 99, 245, 0.25);
    transform: scale(1.03);
  }

  /* ---------- Leyenda ---------- */
  .leyenda {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px dashed var(--gris);
    font-size: .82rem;
  }
  .leyenda .item { display: flex; align-items: center; gap: 5px; }
  .leyenda .pastilla { width: 16px; height: 16px; border-radius: 5px; }
  .leyenda .pastilla.home    { background: linear-gradient(135deg, #FFC9E1, #FF9DC5); }
  .leyenda .pastilla.oficina { background: linear-gradient(135deg, #B5E9F7, #7CD5EE); }
  .leyenda .pastilla.finde   { background: var(--gris); }

  /* ---------- Modales ---------- */
  .modal-fondo {
    position: fixed;
    inset: 0;
    background: rgba(91, 58, 115, 0.35);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 100;
  }
  .modal-fondo.abierto { display: flex; }
  .modal {
    background: var(--blanco);
    border-radius: var(--radio);
    box-shadow: var(--sombra-fuerte);
    max-width: 420px;
    width: 100%;
    padding: 24px;
    max-height: 85vh;
    overflow-y: auto;
  }
  .modal h3 { font-size: 1.3rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
  .modal p.desc { color: var(--gris-txt); margin: 4px 0 16px; font-size: .9rem; }

  .campo { margin-bottom: 14px; }
  .campo label { display: block; font-weight: 600; margin-bottom: 5px; font-size: .9rem; }
  .campo input, .campo select {
    width: 100%;
    padding: 12px 14px;
    border-radius: var(--radio-chico);
    border: 2px solid var(--gris);
    background: var(--fondo);
    font-size: 16px;
  }
  .campo input:focus, .campo select:focus {
    outline: none;
    border-color: var(--rosa-fuerte);
    box-shadow: 0 0 0 3px rgba(255, 95, 168, 0.2);
  }

  .radios { display: flex; gap: 8px; }
  .radios label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    border: 2px solid var(--gris);
    border-radius: var(--radio-chico);
    cursor: pointer;
    background: var(--fondo);
    font-weight: 600;
    font-size: .9rem;
  }
  .radios input[type="radio"] { display: none; }
  .radios input[type="radio"]:checked + span { color: var(--morado-fuerte); }
  .radios label:has(input:checked) {
    background: linear-gradient(135deg, #FFE8F3, #F1E4FF);
    border-color: var(--rosa-fuerte);
  }

  .modal-acciones { display: flex; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
  .btn-primario, .btn-secundario, .btn-peligro {
    flex: 1;
    min-width: 100px;
    padding: 12px 14px;
    border-radius: var(--radio-chico);
    font-weight: 700;
    font-size: .9rem;
  }
  .btn-primario {
    background: linear-gradient(135deg, var(--rosa-fuerte), var(--morado-fuerte));
    color: white;
    box-shadow: 0 4px 14px rgba(255, 95, 168, 0.35);
  }
  .btn-secundario {
    background: var(--fondo);
    color: var(--morado-oscuro);
    border: 2px solid var(--gris);
  }
  .btn-peligro { background: #FFE0EC; color: #B8235F; }

  /* ---------- Excepcion modal ---------- */
  .info-dia {
    background: linear-gradient(135deg, #FFF0F7, #F3EBFF);
    padding: 14px;
    border-radius: var(--radio-chico);
    margin-bottom: 14px;
    text-align: center;
  }
  .info-dia .fecha-grande { font-family: 'Fredoka', sans-serif; font-size: 1.1rem; font-weight: 600; }
  .info-dia .estado-actual { margin-top: 6px; font-size: .85rem; color: var(--morado-fuerte); }
  .opciones-excepcion { display: flex; flex-direction: column; gap: 8px; }
  .opciones-excepcion button {
    padding: 12px;
    border-radius: var(--radio-chico);
    background: var(--fondo);
    border: 2px solid var(--gris);
    text-align: left;
    font-size: .95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .opciones-excepcion button .emoji-op { font-size: 1.3rem; }

  .aviso {
    background: #FFE0EC;
    color: #B8235F;
    padding: 10px 14px;
    border-radius: 12px;
    margin-top: 10px;
    font-size: .85rem;
    display: none;
  }
  .aviso.mostrar { display: block; }

  @media (max-width: 500px) {
    .card-hoy { grid-template-columns: 1fr; text-align: center; }
    .cal-celda { font-size: .75rem; border-radius: 8px; }
    .cal-celda .c-emoji { font-size: .8rem; }
    .cal-dias-semana div { font-size: .6rem; }
    .proximos { gap: 5px; }
    .prox-dia { padding: 8px 2px; }
    .prox-dia .p-emoji { font-size: 1.2rem; }
    .prox-dia .p-num { font-size: .9rem; }
  }

  @media (max-width: 370px) {
    .app { padding: 14px 10px 50px; }
    .cal-celda .c-emoji { display: none; }
    .cal-celda { font-size: .7rem; }
    .cal-cuadricula { gap: 3px; }
    .buscador { flex-direction: column; }
    .buscador button { padding: 10px; }
    .leyenda { font-size: .75rem; gap: 8px; }
  }
</style>
</head>
<body>

<div class="fondo-blobs" aria-hidden="true">
  <div class="blob rosa"></div>
  <div class="blob morado"></div>
  <div class="blob azul"></div>
  <div class="blob rosa2"></div>
</div>

<div class="app">

  <header>
    <h1>🎀 Mi semana <span aria-hidden="true">🌸</span></h1>
    <button class="btn-ajustes" id="btnAjustes" aria-label="Abrir ajustes" title="Ajustes">⚙️</button>
  </header>

  <section class="card card-hoy" aria-labelledby="hoy-titulo">
    <div class="emoji-hoy" id="emojiHoy" aria-hidden="true">🎀</div>
    <div class="info-hoy">
      <div class="etiqueta">Hoy toca</div>
      <h2 id="hoy-titulo">Cargando…</h2>
      <div class="fecha" id="fechaHoy"></div>
      <div class="semana" id="semanaHoy"></div>
    </div>
  </section>

  <section class="card" aria-label="Proximos dias laborales">
    <h3 style="margin-bottom: 10px; font-size: 1rem;">Próximos días 🌈</h3>
    <div class="proximos" id="proximos"></div>
  </section>

  <section class="card" aria-label="Buscar fecha">
    <h3 style="margin-bottom: 10px; font-size: 1rem;">Consultar una fecha 🔎</h3>
    <div class="buscador">
      <input type="text" id="inputBusqueda" placeholder="Ej: 8 de diciembre, 15 enero 2027…" aria-label="Escribe una fecha" />
      <button id="btnBuscar">Buscar</button>
    </div>
    <div class="resultado-busqueda" id="resultadoBusqueda" role="status" aria-live="polite">
      <div class="r-info">
        <span class="r-emoji" id="rEmoji"></span>
        <div>
          <div id="rTexto" style="font-weight: 600;"></div>
          <div id="rDetalle" style="font-size: .82rem; opacity: .8;"></div>
        </div>
      </div>
      <button id="btnIrFecha">Ir al calendario →</button>
    </div>
    <div class="aviso" id="avisoBusqueda">No entendí esa fecha. Prueba con algo como "8 de diciembre" o "15 enero 2027".</div>
  </section>

  <section class="card" aria-label="Calendario mensual">
    <div class="cal-header">
      <h3 id="tituloMes"></h3>
      <div class="cal-nav">
        <button id="mesPrev" aria-label="Mes anterior">‹</button>
        <button id="mesHoy" aria-label="Ir a mes actual" title="Mes actual">🌸</button>
        <button id="mesNext" aria-label="Mes siguiente">›</button>
      </div>
    </div>
    <div class="cal-dias-semana" aria-hidden="true">
      <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
    </div>
    <div class="cal-cuadricula" id="calCuadricula" role="grid"></div>
    <div class="leyenda">
      <div class="item"><span class="pastilla home"></span> 🏠 Home</div>
      <div class="item"><span class="pastilla oficina"></span> 🏢 Oficina</div>
      <div class="item"><span class="pastilla finde"></span> 🌈 Finde</div>
      <div class="item"><span aria-hidden="true">✨</span> Excepción</div>
    </div>
  </section>
</div>

<!-- Modal setup / ajustes -->
<div class="modal-fondo" id="modalConfig" role="dialog" aria-modal="true" aria-labelledby="tituloConfig">
  <div class="modal">
    <h3 id="tituloConfig">🎀 Configurar patrón</h3>
    <p class="desc">Necesito una fecha de referencia y qué tipo de semana era, para calcular todo lo demás.</p>
    <div class="campo">
      <label for="anclaFecha">Fecha ancla</label>
      <input type="date" id="anclaFecha" />
    </div>
    <div class="campo">
      <label>¿Qué tipo de semana era esa?</label>
      <div class="radios">
        <label>
          <input type="radio" name="tipoSem" value="A" checked>
          <span>Tipo A 🌸<br><small style="font-weight: 500; font-size: .75rem;">Jue-Vie home</small></span>
        </label>
        <label>
          <input type="radio" name="tipoSem" value="B">
          <span>Tipo B 🎀<br><small style="font-weight: 500; font-size: .75rem;">Lun-Mié home</small></span>
        </label>
      </div>
    </div>
    <div class="modal-acciones">
      <button class="btn-secundario" id="cancelarConfig" style="display:none;">Cancelar</button>
      <button class="btn-primario" id="guardarConfig">Guardar ✨</button>
    </div>
  </div>
</div>

<!-- Modal excepcion -->
<div class="modal-fondo" id="modalExcepcion" role="dialog" aria-modal="true" aria-labelledby="tituloExcepcion">
  <div class="modal">
    <h3 id="tituloExcepcion">✨ Editar día</h3>
    <p class="desc">Puedes forzar este día a home u oficina, o volver al patrón automático.</p>
    <div class="info-dia">
      <div class="fecha-grande" id="excFecha"></div>
      <div class="estado-actual" id="excEstado"></div>
    </div>
    <div class="opciones-excepcion">
      <button data-tipo="home"><span class="emoji-op">🏠</span> Home office</button>
      <button data-tipo="oficina"><span class="emoji-op">🏢</span> Oficina</button>
      <button data-tipo="auto"><span class="emoji-op">🌈</span> Automático (quitar excepción)</button>
    </div>
    <div class="modal-acciones">
      <button class="btn-secundario" id="cerrarExcepcion">Cerrar</button>
    </div>
  </div>
</div>

<script>
(function() {
  'use strict';

  // ============ Storage usando localStorage (funciona en WebView) ============
  var CLAVE_CONFIG = 'cal_config';
  var CLAVE_EXC = 'cal_exceptions';

  function leerConfig() {
    try {
      var raw = localStorage.getItem(CLAVE_CONFIG);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function guardarConfig(cfg) {
    try { localStorage.setItem(CLAVE_CONFIG, JSON.stringify(cfg)); }
    catch (e) { console.warn('guardarConfig fallo', e); }
  }
  function leerExcepciones() {
    try {
      var raw = localStorage.getItem(CLAVE_EXC);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) { return {}; }
  }
  function guardarExcepciones(dic) {
    try { localStorage.setItem(CLAVE_EXC, JSON.stringify(dic)); }
    catch (e) { console.warn('guardarExcepciones fallo', e); }
  }

  // ============ Utilidades de fecha ============
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var DIAS_SEMANA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  var DIAS_CORTOS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  function claveFecha(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function parseISOLocal(s) {
    var partes = s.split('-');
    return new Date(parseInt(partes[0],10), parseInt(partes[1],10)-1, parseInt(partes[2],10));
  }
  function lunesDeSemana(fecha) {
    var d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    var dow = d.getDay();
    var diff = dow === 0 ? -6 : 1 - dow;
    d.setDate(d.getDate() + diff);
    return d;
  }
  function diasEntre(a, b) {
    return Math.round((b.getTime() - a.getTime()) / (1000*60*60*24));
  }
  function fmtFechaLarga(d) {
    return DIAS_SEMANA[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function fmtMesAnio(d) {
    return MESES[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ============ Logica de tipo de semana ============
  function tipoSemanaPara(fecha) {
    var cfg = leerConfig();
    if (!cfg) return null;
    var ancla = parseISOLocal(cfg.anclaFecha);
    var tipoAncla = cfg.tipo;
    var lunAncla = lunesDeSemana(ancla);
    var lunTarget = lunesDeSemana(fecha);
    var semanas = Math.round(diasEntre(lunAncla, lunTarget) / 7);
    var par = ((semanas % 2) + 2) % 2 === 0;
    return par ? tipoAncla : (tipoAncla === 'A' ? 'B' : 'A');
  }

  function estadoAutomatico(fecha) {
    var dow = fecha.getDay();
    if (dow === 0 || dow === 6) return 'finde';
    var t = tipoSemanaPara(fecha);
    if (!t) return null;
    if (t === 'A') return (dow >= 1 && dow <= 3) ? 'oficina' : 'home';
    else return (dow >= 1 && dow <= 3) ? 'home' : 'oficina';
  }
  function estadoDe(fecha) {
    var exc = leerExcepciones();
    var k = claveFecha(fecha);
    if (exc[k] === 'home' || exc[k] === 'oficina') return { estado: exc[k], excepcion: true };
    return { estado: estadoAutomatico(fecha), excepcion: false };
  }

  // ============ Parseo de fecha en espanol ============
  var _rxDiacriticos = new RegExp('[\\u0300-\\u036f]', 'g');
  function normalizarTexto(s) {
    return s.toLowerCase().normalize('NFD').replace(_rxDiacriticos, '').replace(/[^a-z0-9\\s]/g, ' ').replace(/\\s+/g, ' ').trim();
  }
  function parseFechaES(texto) {
    if (!texto) return null;
    var t = normalizarTexto(texto);
    var mDia = t.match(/(\\d{1,2})/);
    if (!mDia) return null;
    var dia = parseInt(mDia[1], 10);
    var mesIdx = -1;
    var mesNorm = MESES.map(function(m){ return normalizarTexto(m); });
    var extras = { 'setiembre': 8 };
    for (var i = 0; i < mesNorm.length; i++) {
      if (t.indexOf(mesNorm[i]) !== -1) { mesIdx = i; break; }
    }
    if (mesIdx === -1) {
      for (var k in extras) {
        if (t.indexOf(k) !== -1) { mesIdx = extras[k]; break; }
      }
    }
    if (mesIdx === -1) return null;
    var mAnio = t.match(/\\b(19\\d{2}|20\\d{2}|21\\d{2})\\b/);
    var anio = mAnio ? parseInt(mAnio[1], 10) : (new Date()).getFullYear();
    if (dia < 1 || dia > 31) return null;
    var d = new Date(anio, mesIdx, dia);
    if (d.getFullYear() !== anio || d.getMonth() !== mesIdx || d.getDate() !== dia) return null;
    return d;
  }

  // ============ Render ============
  var hoyGlobal = new Date();
  hoyGlobal.setHours(0,0,0,0);
  var mesVista = new Date(hoyGlobal.getFullYear(), hoyGlobal.getMonth(), 1);

  function emojiPara(estado) {
    return estado === 'home' ? '🏠' : estado === 'oficina' ? '🏢' : '🌈';
  }
  function nombrePara(estado) {
    return estado === 'home' ? 'Home office' : estado === 'oficina' ? 'Oficina' : 'Finde libre';
  }

  function renderHoy() {
    var res = estadoDe(hoyGlobal);
    var estado = res.estado;
    var el = {
      emoji: document.getElementById('emojiHoy'),
      titulo: document.getElementById('hoy-titulo'),
      fecha: document.getElementById('fechaHoy'),
      semana: document.getElementById('semanaHoy')
    };
    if (!estado) {
      el.emoji.textContent = '🎀';
      el.titulo.textContent = 'Configura tu patrón';
      el.fecha.textContent = 'Toca ⚙️ arriba para empezar';
      el.semana.textContent = '';
      return;
    }
    el.emoji.textContent = emojiPara(estado);
    el.titulo.textContent = nombrePara(estado) + (res.excepcion ? ' ✨' : '');
    el.fecha.textContent = fmtFechaLarga(hoyGlobal);
    var tsem = tipoSemanaPara(hoyGlobal);
    el.semana.textContent = 'Semana tipo ' + tsem + (tsem === 'A' ? ' 🌸' : ' 🎀');
  }

  function renderProximos() {
    var cont = document.getElementById('proximos');
    cont.innerHTML = '';
    var cfg = leerConfig();
    if (!cfg) {
      cont.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color: var(--gris-txt); padding: 10px;">Configura tu patrón para ver los próximos días 🎀</div>';
      return;
    }
    var encontrados = 0;
    var d = new Date(hoyGlobal);
    var iter = 0;
    while (encontrados < 4 && iter < 30) {
      d.setDate(d.getDate() + 1);
      iter++;
      var dow = d.getDay();
      if (dow === 0 || dow === 6) continue;
      var st = estadoDe(d);
      var div = document.createElement('div');
      div.className = 'prox-dia';
      div.innerHTML =
        '<div class="p-dia">' + DIAS_CORTOS[d.getDay()] + '</div>' +
        '<div class="p-emoji">' + emojiPara(st.estado) + (st.excepcion ? ' <span style="font-size:.6rem;">✨</span>' : '') + '</div>' +
        '<div class="p-num">' + d.getDate() + '</div>';
      cont.appendChild(div);
      encontrados++;
    }
  }

  function renderCalendario() {
    var titulo = document.getElementById('tituloMes');
    var cuadricula = document.getElementById('calCuadricula');
    titulo.textContent = fmtMesAnio(mesVista);
    cuadricula.innerHTML = '';
    var primer = new Date(mesVista.getFullYear(), mesVista.getMonth(), 1);
    var ultimo = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 0);
    var dowPrimer = primer.getDay();
    var offset = dowPrimer === 0 ? 6 : dowPrimer - 1;
    for (var i = 0; i < offset; i++) {
      var v = document.createElement('div');
      v.className = 'cal-celda vacio';
      cuadricula.appendChild(v);
    }
    for (var d = 1; d <= ultimo.getDate(); d++) {
      var fecha = new Date(mesVista.getFullYear(), mesVista.getMonth(), d);
      var st = estadoDe(fecha);
      var estado = st.estado || 'finde';
      var celda = document.createElement('button');
      celda.className = 'cal-celda ' + estado;
      if (fecha.getTime() === hoyGlobal.getTime()) celda.classList.add('hoy');
      celda.setAttribute('type', 'button');
      celda.dataset.fecha = claveFecha(fecha);
      celda.innerHTML =
        (st.excepcion ? '<span class="c-marca">✨</span>' : '') +
        '<span class="c-emoji">' + emojiPara(estado) + '</span>' +
        '<span class="c-num">' + d + '</span>';
      celda.addEventListener('click', function() {
        abrirExcepcion(this.dataset.fecha);
      });
      cuadricula.appendChild(celda);
    }
  }

  function renderTodo() {
    renderHoy();
    renderProximos();
    renderCalendario();
  }

  // ============ Modales ============
  function abrirModal(id) {
    document.getElementById(id).classList.add('abierto');
  }
  function cerrarModal(id) {
    document.getElementById(id).classList.remove('abierto');
  }

  function abrirConfig(esPrimeraVez) {
    var cfg = leerConfig();
    var inputFecha = document.getElementById('anclaFecha');
    var radios = document.getElementsByName('tipoSem');
    if (cfg) {
      inputFecha.value = cfg.anclaFecha;
      for (var i = 0; i < radios.length; i++) if (radios[i].value === cfg.tipo) radios[i].checked = true;
    } else {
      var lun = lunesDeSemana(hoyGlobal);
      inputFecha.value = claveFecha(lun);
    }
    document.getElementById('cancelarConfig').style.display = esPrimeraVez ? 'none' : '';
    document.getElementById('tituloConfig').textContent = esPrimeraVez ? '🎀 ¡Bienvenida! Configura tu patrón' : '⚙️ Ajustes';
    abrirModal('modalConfig');
  }

  document.getElementById('guardarConfig').addEventListener('click', function() {
    var fecha = document.getElementById('anclaFecha').value;
    if (!fecha) { alert('Elige una fecha ancla 🎀'); return; }
    var tipo = 'A';
    var radios = document.getElementsByName('tipoSem');
    for (var i = 0; i < radios.length; i++) if (radios[i].checked) tipo = radios[i].value;
    guardarConfig({ anclaFecha: fecha, tipo: tipo });
    cerrarModal('modalConfig');
    renderTodo();
  });
  document.getElementById('cancelarConfig').addEventListener('click', function() {
    cerrarModal('modalConfig');
  });
  document.getElementById('btnAjustes').addEventListener('click', function() {
    abrirConfig(false);
  });

  // Excepcion modal
  var fechaExcepcionActual = null;
  function abrirExcepcion(claveISO) {
    fechaExcepcionActual = claveISO;
    var fecha = parseISOLocal(claveISO);
    document.getElementById('excFecha').textContent = fmtFechaLarga(fecha);
    var st = estadoDe(fecha);
    document.getElementById('excEstado').textContent = 'Actualmente: ' + (st.estado ? nombrePara(st.estado) : '—') + (st.excepcion ? ' ✨ (excepción manual)' : ' (automático)');
    abrirModal('modalExcepcion');
  }
  document.querySelectorAll('.opciones-excepcion button').forEach(function(b) {
    b.addEventListener('click', function() {
      var tipo = this.dataset.tipo;
      var exc = leerExcepciones();
      if (tipo === 'auto') delete exc[fechaExcepcionActual];
      else exc[fechaExcepcionActual] = tipo;
      guardarExcepciones(exc);
      cerrarModal('modalExcepcion');
      renderTodo();
    });
  });
  document.getElementById('cerrarExcepcion').addEventListener('click', function() {
    cerrarModal('modalExcepcion');
  });

  // Cerrar modales con click fuera / Escape
  document.querySelectorAll('.modal-fondo').forEach(function(f) {
    f.addEventListener('click', function(e) {
      if (e.target === f) {
        if (f.id === 'modalConfig' && !leerConfig()) return;
        f.classList.remove('abierto');
      }
    });
  });

  // Navegacion de meses
  document.getElementById('mesPrev').addEventListener('click', function() {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1);
    renderCalendario();
  });
  document.getElementById('mesNext').addEventListener('click', function() {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1);
    renderCalendario();
  });
  document.getElementById('mesHoy').addEventListener('click', function() {
    mesVista = new Date(hoyGlobal.getFullYear(), hoyGlobal.getMonth(), 1);
    renderCalendario();
  });

  // Buscador
  function ejecutarBusqueda() {
    var txt = document.getElementById('inputBusqueda').value;
    var res = document.getElementById('resultadoBusqueda');
    var aviso = document.getElementById('avisoBusqueda');
    res.classList.remove('mostrar');
    aviso.classList.remove('mostrar');
    var fecha = parseFechaES(txt);
    if (!fecha) { aviso.classList.add('mostrar'); return; }
    if (!leerConfig()) { aviso.textContent = 'Primero configura tu patrón con el ⚙️'; aviso.classList.add('mostrar'); return; }
    var st = estadoDe(fecha);
    document.getElementById('rEmoji').textContent = emojiPara(st.estado);
    document.getElementById('rTexto').textContent = 'Te toca ' + nombrePara(st.estado) + (st.excepcion ? ' ✨' : '');
    document.getElementById('rDetalle').textContent = fmtFechaLarga(fecha);
    res.classList.add('mostrar');
    res.dataset.fecha = claveFecha(fecha);
  }
  document.getElementById('btnBuscar').addEventListener('click', ejecutarBusqueda);
  document.getElementById('inputBusqueda').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') ejecutarBusqueda();
  });
  document.getElementById('btnIrFecha').addEventListener('click', function() {
    var res = document.getElementById('resultadoBusqueda');
    var fk = res.dataset.fecha;
    if (!fk) return;
    var f = parseISOLocal(fk);
    mesVista = new Date(f.getFullYear(), f.getMonth(), 1);
    renderCalendario();
    document.querySelector('.cal-header').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function() {
      var celda = document.querySelector('.cal-celda[data-fecha="' + fk + '"]');
      if (celda) {
        celda.style.transition = 'all .3s ease';
        celda.style.transform = 'scale(1.15)';
        celda.style.boxShadow = '0 0 0 4px rgba(255, 95, 168, 0.4)';
        setTimeout(function() {
          celda.style.transform = '';
          celda.style.boxShadow = '';
        }, 1400);
      }
    }, 400);
  });

  // ============ Arranque ============
  renderTodo();
  if (!leerConfig()) abrirConfig(true);
})();
</script>
</body>
</html>`;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF6FB" />
      <WebView
        source={{ html: CALENDAR_HTML }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
        textZoom={100}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6FB',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFF6FB',
  },
});
