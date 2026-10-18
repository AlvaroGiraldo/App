// LISTA DE MEDIOS RSS (LA FUENTE DE VERDAD DEL RECOLECTOR)

/* Feeds RSS que lee el recolector. fuenteId debe existir en el
   catálogo FUENTES del frontend. Un feed sin url se omite. */
export const FEEDS = [
  { fuenteId: 'eltiempo',     tipo: 'medio', ambito: 'Colombia', url: 'https://www.eltiempo.com/rss' }, // pega aquí el RSS
  { fuenteId: 'elespectador', tipo: 'medio', ambito: 'Colombia', url: 'https://www.elespectador.com/rss' },
  { fuenteId: 'cambio',       tipo: 'medio', ambito: 'Colombia', url: 'https://cambiocolombia.com/rss' },
  { fuenteId: 'lasillavacia',       tipo: 'medio', ambito: 'Colombia', url: 'https://www.lasillavacia.com/rss' },
  { fuenteId: 'elpais',       tipo: 'medio', ambito: 'Colombia', url: 'https://www.elpais.com.co/rss' },
  { fuenteId: 'colombiano',       tipo: 'medio', ambito: 'Colombia', url: 'https://www.elcolombiano.com/rss' },
];