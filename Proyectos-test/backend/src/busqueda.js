// NORMALIZA EL TEXTO Y COMPRUEBA SI UNA NOTICIA COINCIDE CON UNA CONSULTA
/* Minúsculas, sin tildes y espacios simples. */
export function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Texto donde se busca: titular, resumen y palabras clave. */
export function textoBuscable(noticia) {
  const partes = [
    noticia.titular,
    noticia.resumen,
    ...(Array.isArray(noticia.palabrasClave) ? noticia.palabrasClave : []),
  ];
  return normalizar(partes.join(' '));
}

/* Todas las palabras de la consulta deben aparecer. Consulta vacía = coincide. */
export function coincideConConsulta(noticia, consulta) {
  const palabras = normalizar(consulta).split(' ').filter(Boolean);
  if (palabras.length === 0) return true;
  const texto = textoBuscable(noticia);
  return palabras.every((p) => texto.includes(p));
}