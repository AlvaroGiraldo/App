import { FUENTES } from './datos/fuentes.js';
import { NOTICIAS } from './datos/noticias.js';

/* ----------------------------------------------------------
   Elementos del DOM que vamos a usar varias veces
   ---------------------------------------------------------- */
const chips = document.querySelectorAll('.chip');
const contenedorResultados = document.getElementById('resultados-fuentes');
const formFuentes = document.getElementById('form-fuentes');
const inputBusqueda = document.getElementById('busqueda-fuentes');

/* Recordamos qué categoría está activa. Empieza en "todas". */
let categoriaActiva = 'todas';

/* ----------------------------------------------------------
   Utilidad: evita que un nombre o descripción con < o >
   se interprete como HTML. La reutilizaremos en más partes
   del proyecto, así que ya la escribimos pensando en eso.
   ---------------------------------------------------------- */
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/* Traduce la clave interna ("oficial") a lo que se lee en pantalla. */
function etiquetaCategoria(categoria) {
  const etiquetas = { oficial: 'Oficial', verificador: 'Verificador', medio: 'Medio' };
  return etiquetas[categoria] || categoria;
}

/* ----------------------------------------------------------
   Filtra FUENTES según la categoría activa y el texto buscado.
   No modifica FUENTES — genera una lista nueva cada vez.
   ---------------------------------------------------------- */
function filtrarFuentes() {
  const termino = inputBusqueda.value.trim().toLowerCase();

  return FUENTES.filter((fuente) => {
    const coincideCategoria = categoriaActiva === 'todas' || fuente.categoria === categoriaActiva;
    if (!coincideCategoria) return false;

    if (termino === '') return true; // sin texto escrito, solo filtra por categoría

    const enNombre = fuente.nombre.toLowerCase().includes(termino);
    const enDescripcion = fuente.descripcion.toLowerCase().includes(termino);
    const enTemas = fuente.temas.some((tema) => tema.toLowerCase().includes(termino));

    return enNombre || enDescripcion || enTemas;
  });
}

/* Convierte UNA fuente en el HTML de su tarjeta (versión compacta). */
function dibujarTarjeta(fuente) {
  return `
    <a class="tarjeta-fuente" href="${escapar(fuente.url)}" target="_blank" rel="noopener noreferrer">
      <span class="tarjeta-fuente__nombre">${escapar(fuente.nombre)}</span>
      <div class="tarjeta-fuente__meta">
        <span class="tarjeta-fuente__categoria">${escapar(etiquetaCategoria(fuente.categoria))}</span>
        <span class="tarjeta-fuente__ambito">${escapar(fuente.ambito)}</span>
      </div>
    </a>`;
}

/* ¿Hay una búsqueda en marcha? Sí, si hay texto escrito o si se
   eligió una categoría distinta de "todas". */
function hayBusqueda() {
  return inputBusqueda.value.trim() !== '' || categoriaActiva !== 'todas';
}

/* Junta el filtrado y el dibujado, y lo mete en la página. */
function renderizarResultados() {
  if (!hayBusqueda()) {
    contenedorResultados.innerHTML = ''; // sin búsqueda: no mostramos nada
    return;
  }

  const resultados = filtrarFuentes();

  if (resultados.length === 0) {
    contenedorResultados.innerHTML =
      '<p class="estado-vacio">No encontramos fuentes que coincidan. Prueba con otra palabra.</p>';
    return;
  }

  contenedorResultados.innerHTML = resultados.map(dibujarTarjeta).join('');
}

/* ----------------------------------------------------------
   Chips de categoría
   ---------------------------------------------------------- */
function seleccionarChip(chipElegido) {
  chips.forEach((chip) => {
    const esElegido = chip === chipElegido;
    chip.classList.toggle('is-activo', esElegido);
    chip.setAttribute('aria-pressed', String(esElegido));
  });
  categoriaActiva = chipElegido.dataset.categoria;
  renderizarResultados();
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => seleccionarChip(chip));
});

/* ----------------------------------------------------------
   Barra de búsqueda
   ---------------------------------------------------------- */
formFuentes.addEventListener('submit', (evento) => {
  evento.preventDefault(); // sin esto, el formulario recargaría la página
  renderizarResultados();
});

inputBusqueda.addEventListener('input', () => {
  renderizarResultados(); // filtra mientras escribes, no solo al enviar
});

/* ----------------------------------------------------------
   Arranque: mostrar todas las fuentes apenas carga la página
   ---------------------------------------------------------- */
renderizarResultados();




// Sección de noticias del día a revisar, con veredicto y fuentes asociadas. Se puede filtrar por ámbito y categoría.




/* ============================================================
   NOTICIAS DEL DÍA - PEDAZO A POR REVISAR!!!!
   ============================================================ */
const tabsAmbito = document.querySelectorAll('.tab-ambito');
const listaNoticias = document.getElementById('lista-noticias');

let ambitoActivo = 'todos';

const TEMAS = {
  economia: 'Economía',
  politica: 'Política',
  salud: 'Salud',
  seguridad: 'Seguridad',
  internacional: 'Internacional',
  medioambiente: 'Medio ambiente',
};

const ETIQUETAS_VEREDICTO = {
  verificado: 'Verificado',
  dudoso: 'Dudoso',
  falso: 'Falso',
  sindatos: 'Sin datos',
};

/* Convierte una marca de tiempo en "Hace 3 h", "Hace 25 min", etc. */
function tiempoRelativo(marcaTiempo) {
  const minutos = Math.round((Date.now() - marcaTiempo) / 60000);
  if (minutos < 1) return 'Ahora mismo';
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.round(horas / 24);
  return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
}

/* "1 oficial" / "2 oficiales": elige singular o plural según la cantidad. */
function conteo(cantidad, singular, plural) {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}

/* Las píldoras de cobertura: solo aparecen las que tienen al menos 1. */ // A REVISAR PARTE B!!!
/* Devuelve las fichas completas de las fuentes que cubrieron la noticia. */
function fuentesDeNoticia(noticia) {
  return noticia.cobertura
    .map((id) => FUENTES.find((fuente) => fuente.id === id))
    .filter(Boolean); // descarta los ids que no existan en el catálogo
}

/* Las píldoras de cobertura: solo aparecen las que tienen al menos 1. */
function dibujarCobertura(noticia) {
  const fuentes = fuentesDeNoticia(noticia);
  const contar = (categoria) => fuentes.filter((fuente) => fuente.categoria === categoria).length;
  const oficiales = contar('oficial');
  const verificadores = contar('verificador');
  const medios = contar('medio');

  const pildoras = [];
  if (oficiales > 0) {
    pildoras.push(`<span class="pildora pildora--oficial">${conteo(oficiales, 'oficial', 'oficiales')}</span>`);
  }
  if (verificadores > 0) {
    pildoras.push(`<span class="pildora pildora--verificador">${conteo(verificadores, 'verificador', 'verificadores')}</span>`);
  }
  if (medios > 0) {
    pildoras.push(`<span class="pildora pildora--medio">${conteo(medios, 'medio', 'medios')}</span>`);
  }
  return pildoras.join('');
}

/* Si la noticia no tiene veredicto (null), devuelve texto vacío. */
function dibujarVeredicto(veredicto) {
  if (!veredicto) return '';
  return `<span class="veredicto-etiqueta veredicto-etiqueta--${veredicto}">${ETIQUETAS_VEREDICTO[veredicto]}</span>`;
}

/* ----------------------------------------------------------
   Contenido que aparece al expandir la tarjeta A REVISAR PARTE B !!!
   ---------------------------------------------------------- */
const ETIQUETAS_SECTORES = {
  gobierno: 'Gobierno nacional',
  independientes: 'Medios independientes',
  ciudadania: 'Ciudadanía',
};

const GRUPOS_CONCLUSION = [
  { clave: 'establecido', titulo: 'Establecido', vacio: 'Aún no hay hechos confirmados por fuentes primarias.' },
  { clave: 'enDisputa', titulo: 'En disputa', vacio: 'Nada en disputa por ahora.' },
  { clave: 'faltaConfirmar', titulo: 'Falta confirmar', vacio: 'No hay puntos pendientes de confirmar.' },
];

/* Lista con viñetas; si no hay elementos, muestra un mensaje en su lugar. */
function dibujarLista(items, textoVacio) {
  if (!items || items.length === 0) {
    return `<p class="detalle__vacio">${escapar(textoVacio)}</p>`;
  }
  return `<ul class="detalle__lista">${items.map((item) => `<li>${escapar(item)}</li>`).join('')}</ul>`;
}

function dibujarSectores(sectores) {
  return Object.entries(ETIQUETAS_SECTORES)
    .map(([clave, etiqueta]) =>
      `<dt>${etiqueta}</dt><dd>${escapar(sectores[clave] || 'Sin información todavía.')}</dd>`)
    .join('');
}

/* Las fuentes que cubrieron la noticia, con nombre y enlace. */
function dibujarFuentesNombradas(noticia) {
  return fuentesDeNoticia(noticia)
    .map((fuente) => `
      <li>
        <a href="${escapar(fuente.url)}" target="_blank" rel="noopener noreferrer">${escapar(fuente.nombre)}</a>
        <span class="detalle__tipo">${escapar(etiquetaCategoria(fuente.categoria))}</span>
      </li>`)
    .join('');
}

function dibujarReferencias(referencias) {
  return referencias.map((referencia) => {
    const fuente = FUENTES.find((f) => f.id === referencia.fuenteId);
    const url = fuente ? fuente.url : '#';
    const nombre = fuente ? fuente.nombre : referencia.fuenteId;
    return `
      <li>
        <a href="${escapar(url)}" target="_blank" rel="noopener noreferrer">${escapar(referencia.titulo)}</a>
        <span class="detalle__tipo">${escapar(nombre)}</span>
      </li>`;
  }).join('');
}

function dibujarConclusion(conclusion) {
  return GRUPOS_CONCLUSION.map((grupo) => `
    <div class="detalle__grupo">
      <h5 class="detalle__subtitulo">${grupo.titulo}</h5>
      ${dibujarLista(conclusion[grupo.clave], grupo.vacio)}
    </div>`).join('');
}

/* Las seis secciones, en el orden que acordamos. */
function dibujarDetalle(noticia) {
  const d = noticia.detalle;
  return `
    ${noticia.esEjemplo ? '<p class="detalle__aviso">Contenido de ejemplo: no son hechos reales.</p>' : ''}

    <section class="detalle__seccion">
      <h4 class="detalle__titulo">Qué pasó</h4>
      <p>${escapar(d.queOcurrio)}</p>
    </section>

    <section class="detalle__seccion">
      <h4 class="detalle__titulo">Qué dice cada sector</h4>
      <dl class="detalle__sectores">${dibujarSectores(d.sectores)}</dl>
    </section>

    <section class="detalle__seccion">
      <h4 class="detalle__titulo">Quién lo cubrió</h4>
      <ul class="detalle__lista">${dibujarFuentesNombradas(noticia)}</ul>
    </section>

    <section class="detalle__seccion">
      <h4 class="detalle__titulo">Posibles sesgos en la cobertura</h4>
      ${dibujarLista(d.sesgos, 'No identificamos sesgos de encuadre.')}
    </section>

    <section class="detalle__seccion detalle__seccion--conclusion">
      <h4 class="detalle__titulo">Para formarte una conclusión</h4>
      ${dibujarConclusion(d.conclusion)}
    </section>

    <section class="detalle__seccion">
      <h4 class="detalle__titulo">Referencias</h4>
      <ul class="detalle__lista">${dibujarReferencias(d.referencias)}</ul>
    </section>`;
}

/// Hasta aqui
// NUEVO DIBUJAR NOTICIA REVISAR
function dibujarNoticia(noticia) {
  return `
    <article class="tarjeta-noticia">
      <div class="tarjeta-noticia__imagen" aria-hidden="true"></div>
      <div class="tarjeta-noticia__cuerpo">
        <div class="tarjeta-noticia__meta">
          <span class="tarjeta-noticia__tema">${escapar(TEMAS[noticia.categoria] || noticia.categoria)}</span>
          ${dibujarVeredicto(noticia.veredicto)}
        </div>
        <h3 class="tarjeta-noticia__titular">
          <button type="button" class="tarjeta-noticia__boton" aria-haspopup="dialog" data-id="${noticia.id}">${escapar(noticia.titular)}</button>
        </h3>
        <p class="tarjeta-noticia__resumen">${escapar(noticia.resumen)}</p>
        <div class="tarjeta-noticia__cobertura">${dibujarCobertura(noticia)}</div>
        <p class="tarjeta-noticia__tiempo">${escapar(noticia.ambito)} · ${tiempoRelativo(noticia.marcaTiempo)}</p>
      </div>
    </article>`;
}
//Hasta aqui
// PARTE C A REVISAR!!!!

function renderizarNoticias() {
  const visibles = NOTICIAS
    .filter((noticia) => ambitoActivo === 'todos' || noticia.ambito === ambitoActivo)
    .sort((a, b) => b.marcaTiempo - a.marcaTiempo); // la más reciente primero

  listaNoticias.innerHTML = visibles.map(dibujarNoticia).join('');
}

function seleccionarTab(tabElegido) {
  tabsAmbito.forEach((tab) => {
    const esElegido = tab === tabElegido;
    tab.classList.toggle('is-activo', esElegido);
    tab.setAttribute('aria-pressed', String(esElegido));
  });
  ambitoActivo = tabElegido.dataset.ambito;
  renderizarNoticias();
}

tabsAmbito.forEach((tab) => {
  tab.addEventListener('click', () => seleccionarTab(tab));
});

/* ----------------------------------------------------------
   Ventana emergente (modal) con el detalle de la noticia
   ----------------------------------------------------------  REVISARRRRR!!!*/
const modal = document.getElementById('detalle-noticia');
const modalContenido = document.getElementById('modal-contenido');
const modalCerrar = document.getElementById('modal-cerrar');

/* La parte de arriba de la ventana: tema, veredicto, titular y cobertura. */
function dibujarEncabezadoModal(noticia) {
  return `
    <header class="modal__encabezado">
      <div class="tarjeta-noticia__meta">
        <span class="tarjeta-noticia__tema">${escapar(TEMAS[noticia.categoria] || noticia.categoria)}</span>
        ${dibujarVeredicto(noticia.veredicto)}
      </div>
      <h3 id="modal-titulo" class="modal__titulo">${escapar(noticia.titular)}</h3>
      <p class="tarjeta-noticia__tiempo">${escapar(noticia.ambito)} · ${tiempoRelativo(noticia.marcaTiempo)}</p>
      <div class="tarjeta-noticia__cobertura">${dibujarCobertura(noticia)}</div>
    </header>`;
}

/* Llena la ventana con la noticia elegida y la abre. */
function abrirDetalle(id) {
  const noticia = NOTICIAS.find((n) => n.id === id);
  if (!noticia) return;

  modalContenido.innerHTML = dibujarEncabezadoModal(noticia) + dibujarDetalle(noticia);
  modal.showModal();
  modal.scrollTop = 0; // si venía de leer otra noticia, empieza desde arriba
}

modalCerrar.addEventListener('click', () => modal.close());

/* Clic sobre el fondo oscuro: el clic cae sobre el <dialog> mismo,
   no sobre algo de su interior. Así sabemos que fue "afuera". */
modal.addEventListener('click', (evento) => {
  if (evento.target === modal) modal.close();
});

/* Un solo listener para todos los titulares (event delegation): las
   tarjetas se vuelven a dibujar al cambiar de pestaña, y un listener
   puesto directamente sobre un botón viejo se perdería con él. */
listaNoticias.addEventListener('click', (evento) => {
  const boton = evento.target.closest('.tarjeta-noticia__boton');
  if (boton) abrirDetalle(boton.dataset.id);
});

renderizarNoticias();