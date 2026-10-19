// ARRANCA EXPRESS Y EXPONE LA API
import express from 'express';
import { timingSafeEqual } from 'node:crypto';
import { recolectar } from './recolector.js';
import { leerNoticias } from './almacen.js';

const PUERTO = Number(process.env.PUERTO) || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const INTERVALO_MIN = Number(process.env.INTERVALO_MIN ?? 30);
const CLAVE = process.env.CLAVE_RECOLECTAR || '';
const LIMITE_POR_DEFECTO = 50;
const LIMITE_MAXIMO = 100;

/* ----------------------------------------------------------
   Estado en memoria: qué está pasando y cómo salió la última vez.
   ---------------------------------------------------------- */
const estado = {
  enCurso: false,
  ultima: null,        // { origen, inicio, fin, ok, informe, total, error }
  proximaEn: null,     // cuándo toca la siguiente ejecución automática
};

/* Ejecuta el recolector con cerrojo: nunca dos a la vez.
   Devuelve null si ya había una en curso. */
async function ejecutar(origen) {
  if (estado.enCurso) return null;
  estado.enCurso = true;
  const inicio = new Date();
  let resultado;

  try {
    const { informe, total } = await recolectar();
    resultado = { origen, inicio, fin: new Date(), ok: true, informe, total, error: null };
  } catch (error) {
    resultado = { origen, inicio, fin: new Date(), ok: false, informe: [], total: null, error: error.message };
    console.error(`[recolector:${origen}] falló:`, error);
  } finally {
    estado.enCurso = false;
  }

  estado.ultima = resultado;
  const nuevas = resultado.informe.reduce((suma, f) => suma + (f.nuevas || 0), 0);
  console.log(`[recolector:${origen}] ${resultado.ok ? 'ok' : 'con error'} · nuevas: ${nuevas} · total: ${resultado.total}`);
  return resultado;
}

/* Compara claves sin filtrar información por el tiempo de respuesta. */
function claveValida(recibida = '') {
  const a = Buffer.from(String(recibida));
  const b = Buffer.from(CLAVE);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ----------------------------------------------------------
   Rutas
   ---------------------------------------------------------- */
const app = express();
app.disable('x-powered-by');

app.get('/api/estado', (req, res) => {
  res.json(estado);
});

app.get('/api/noticias', async (req, res) => {
  const { ambito, limite } = req.query;

  let max = LIMITE_POR_DEFECTO;
  if (limite !== undefined) {
    max = Number(limite);
    if (!Number.isInteger(max) || max < 1 || max > LIMITE_MAXIMO) {
      return res.status(400).json({ error: `limite debe ser un entero entre 1 y ${LIMITE_MAXIMO}.` });
    }
  }
  if (ambito !== undefined && typeof ambito !== 'string') {
    return res.status(400).json({ error: 'ambito debe ser un solo valor.' });
  }

  try {
    const todas = await leerNoticias();
    const filtradas = ambito
      ? todas.filter((n) => n.ambito.toLowerCase() === ambito.toLowerCase())
      : todas;
    res.json({ total: filtradas.length, noticias: filtradas.slice(0, max) });
  } catch (error) {
    console.error('[api/noticias] no se pudo leer noticias.json:', error);
    res.status(500).json({ error: 'No se pudieron leer las noticias.' });
  }
});

app.post('/api/recolectar', async (req, res) => {
  if (!CLAVE) {
    return res.status(503).json({ error: 'Endpoint deshabilitado: falta CLAVE_RECOLECTAR en .env.' });
  }
  if (!claveValida(req.get('x-clave'))) {
    return res.status(401).json({ error: 'Clave incorrecta.' });
  }

  const resultado = await ejecutar('manual');
  if (!resultado) {
    return res.status(409).json({ error: 'Ya hay una recolección en curso.' });
  }
  res.status(resultado.ok ? 200 : 500).json(resultado);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

/* ----------------------------------------------------------
   Arranque y programación automática
   ---------------------------------------------------------- */
const servidor = app.listen(PUERTO, HOST, () => {
  console.log(`Servidor en http://${HOST}:${PUERTO}`);
  if (!CLAVE) console.warn('Aviso: sin CLAVE_RECOLECTAR, la recolección manual está deshabilitada.');
});

let temporizador = null;

if (INTERVALO_MIN > 0) {
  const cadaMs = INTERVALO_MIN * 60 * 1000;
  const programar = () => { estado.proximaEn = new Date(Date.now() + cadaMs); };

  ejecutar('automatico').then(programar);
  temporizador = setInterval(() => {
    ejecutar('automatico').then(programar);
  }, cadaMs);
  console.log(`Recolección automática cada ${INTERVALO_MIN} min.`);
} else {
  console.log('Recolección automática desactivada (INTERVALO_MIN=0).');
}

/* Cierre ordenado con Ctrl + C. */
function cerrar() {
  console.log('\nCerrando servidor…');
  if (temporizador) clearInterval(temporizador);
  servidor.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref(); // por si algo no cierra
}
process.on('SIGINT', cerrar);
process.on('SIGTERM', cerrar);