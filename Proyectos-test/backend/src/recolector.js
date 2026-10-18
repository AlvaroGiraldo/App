//LEE LOS RSS Y GUARDA NOTICIAS NUEVAS
import Parser from 'rss-parser';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { FEEDS } from './fuentes.js';
import { leerNoticias, guardarNoticias } from './almacen.js';

const parser = new Parser();
const DIAS_A_CONSERVAR = 30;
const LARGO_RESUMEN = 280;

async function descargar(url) {
  const respuesta = await fetch(url, {
    headers: { 'User-Agent': 'ContrasteBot/0.1' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return respuesta.text();
}

/* Quita rastreadores y fragmento; devuelve null si no es https válido. */
function limpiarEnlace(enlace) {
  try {
    const url = new URL(enlace);
    if (url.protocol !== 'https:') return null;
    [...url.searchParams.keys()]
      .filter((k) => k.startsWith('utm_') || k === 'fbclid')
      .forEach((k) => url.searchParams.delete(k));
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function resumir(texto = '') {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  return limpio.length > LARGO_RESUMEN ? limpio.slice(0, LARGO_RESUMEN - 1) + '…' : limpio;
}

function normalizarItem(item, feed, ahora) {
  const enlace = limpiarEnlace(item.link || '');
  const titular = (item.title || '').trim();
  if (!enlace || !titular) return null;

  let publicada = item.isoDate ? new Date(item.isoDate) : ahora;
  if (Number.isNaN(publicada.getTime()) || publicada > ahora) publicada = ahora;

  const hash = createHash('sha1').update(enlace).digest('hex').slice(0, 12);
  return {
    id: `${feed.fuenteId}-${hash}`,
    titular,
    resumen: resumir(item.contentSnippet || item.summary),
    enlace,
    fuenteRss: feed.fuenteId,
    cobertura: [feed.fuenteId],
    ambito: feed.ambito,
    categoria: null,
    palabrasClave: (item.categories || []).map((c) => String(c).trim()).filter(Boolean),
    publicadaEn: publicada.toISOString(),
    recolectadaEn: ahora.toISOString(),
    analisis: null,
  };
}

async function leerFeed(feed, ahora) {
  const xml = await descargar(feed.url);
  const { items } = await parser.parseString(xml);
  return items.map((i) => normalizarItem(i, feed, ahora)).filter(Boolean);
}

export async function recolectar() {
  const ahora = new Date();
  const activos = FEEDS.filter((f) => f.url);
  const existentes = await leerNoticias();
  const conocidos = new Set(existentes.map((n) => n.enlace));

  const resultados = await Promise.allSettled(activos.map((f) => leerFeed(f, ahora)));

  const informe = [];
  const nuevas = [];
  resultados.forEach((r, i) => {
    const id = activos[i].fuenteId;
    if (r.status === 'rejected') {
      informe.push({ feed: id, ok: false, error: r.reason.message });
      return;
    }
    const sinRepetir = r.value.filter((n) => {
      if (conocidos.has(n.enlace)) return false;
      conocidos.add(n.enlace);
      return true;
    });
    nuevas.push(...sinRepetir);
    informe.push({ feed: id, ok: true, leidas: r.value.length, nuevas: sinRepetir.length });
  });

  const limite = ahora.getTime() - DIAS_A_CONSERVAR * 24 * 3600 * 1000;
  const todas = [...nuevas, ...existentes]
    .filter((n) => new Date(n.publicadaEn).getTime() >= limite)
    .sort((a, b) => b.publicadaEn.localeCompare(a.publicadaEn));

  await guardarNoticias(todas);
  return { informe, total: todas.length };
}

/* Si lo ejecutas con "npm run recolectar", corre y muestra el informe. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { informe, total } = await recolectar();
  console.table(informe);
  console.log(`Total guardado: ${total} noticias`);
  const sinUrl = FEEDS.filter((f) => !f.url).map((f) => f.fuenteId);
  if (sinUrl.length) console.log('Feeds sin URL (omitidos):', sinUrl.join(', '));
}