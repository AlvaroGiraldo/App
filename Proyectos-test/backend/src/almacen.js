// LEE Y ESCRIBE DATOS DE NOTICIAS EN EL ALMACÉN LOCAL (localStorage) DEL NAVEGADOR
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';

const RUTA = new URL('../data/noticias.json', import.meta.url);
const TEMPORAL = new URL('../data/noticias.json.tmp', import.meta.url);

export async function leerNoticias() {
  try {
    return JSON.parse(await readFile(RUTA, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return []; // primera vez: aún no hay archivo
    throw error;
  }
}

export async function guardarNoticias(noticias) {
  await mkdir(new URL('../data/', import.meta.url), { recursive: true });
  await writeFile(TEMPORAL, JSON.stringify(noticias, null, 2), 'utf8');
  await rename(TEMPORAL, RUTA); // el cambio es de todo o nada
}