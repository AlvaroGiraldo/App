// LISTA DE MEDIOS RSS (LA FUENTE DE VERDAD DEL RECOLECTOR)

/* Feeds RSS que lee el recolector. fuenteId debe existir en el
   catálogo FUENTES del frontend. Un feed sin url se omite. */
export const FEEDS = [
  { fuenteId: 'eltiempo',     tipo: 'medio', ambito: 'Colombia', url: 'https://www.eltiempo.com/rss/colombia.xml' }, 
  { fuenteId: 'eltiempo',     tipo: 'medio', ambito: 'Colombia', url: 'https://www.eltiempo.com/rss/politica.xml' }, 
  { fuenteId: 'elespectador', tipo: 'medio', ambito: 'Colombia', url: 'https://blogs.elespectador.com/feed/' },
  { fuenteId: 'lasillavacia',       tipo: 'medio', ambito: 'Colombia', url: 'https://www.lasillavacia.com/rss' },
  { fuenteId: 'colombiano',       tipo: 'medio', ambito: 'Colombia', url: 'https://www.elcolombiano.com/rss/inicio.xml' },
];