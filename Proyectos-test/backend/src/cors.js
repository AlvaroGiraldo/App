// PERMITE QUE EL FRONTEND (OTRO ORIGEN) LEA LA API
/* En desarrollo: acepta páginas de tu propio equipo en cualquier puerto
   (Live Server, python -m http.server, etc.). Solo http y solo localhost
   o 127.0.0.1. Cuando publiques, define ORIGENES_PERMITIDOS en .env. */
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

export function crearCors(env = process.env.ORIGENES_PERMITIDOS) {
  const lista = env ? new Set(env.split(',').map((o) => o.trim()).filter(Boolean)) : null;
  const permitido = (origen) => (lista ? lista.has(origen) : LOCAL.test(origen));

  return function cors(req, res, next) {
    const origen = req.headers.origin;
    res.setHeader('Vary', 'Origin');
    if (origen && permitido(origen)) {
      res.setHeader('Access-Control-Allow-Origin', origen);
    }
    next();
  };
}