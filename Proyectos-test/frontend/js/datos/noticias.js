/* ============================================================
   DATOS / noticias.js
   ------------------------------------------------------------
   Noticias del día, Colombia y mundo. Por ahora viven aquí a
   mano; el día que exista una fuente real (RSS, API de noticias),
   este archivo cambia DE DÓNDE vienen los datos, no cómo se
   muestran — mismo patrón que datos/fuentes.js.

   FORMA DE CADA NOTICIA
   - Los campos de arriba (titular, resumen...) son los de la
     tarjeta cerrada.
   - cobertura: lista de ids de FUENTES (datos/fuentes.js) que
     cubrieron la noticia. Las píldoras "2 oficiales · 3 medios"
     se CALCULAN a partir de esta lista; ya no se escriben a mano.
   - detalle: lo que se muestra al expandir la tarjeta.
   - esEjemplo: true marca contenido de demostración. Cuando haya
     datos reales, este campo pasa a false y la tarjeta puede dejar
     de mostrar el aviso de "contenido de ejemplo".
   ============================================================ */

// Atajo para escribir "hace X horas" sin calcular a mano cada vez.
const horasAtras = (n) => Date.now() - n * 60 * 60 * 1000;

// Texto de relleno para las tres perspectivas. Es el mismo en todas
// las noticias de ejemplo; en datos reales cada noticia tendría el suyo.
const SECTORES_EJEMPLO = {
  gobierno: 'Ejemplo: aquí irá la postura oficial del Gobierno Nacional, con enlace al documento.',
  independientes: 'Ejemplo: aquí irá cómo lo presentan los medios independientes, citando cada uno.',
  ciudadania: 'Ejemplo: aquí irán reacciones y datos de opinión, solo con fuente y fecha.',
};

export const NOTICIAS = [
  {
    id: 'banrep-tasa-interes',
    ambito: 'Colombia',
    categoria: 'economia',
    titular: 'Banco de la República ajusta la tasa de interés',
    resumen: 'La junta directiva explicó el cambio y su efecto esperado en la inflación de los próximos meses.',
    veredicto: null, // null = todavía no hay un veredicto propio sobre esta noticia
    marcaTiempo: horasAtras(3),
    esEjemplo: true,
    cobertura: ['banrep', 'dane', 'eltiempo', 'elespectador', 'cambio'],
    palabrasClave: ['tasa', 'inflación', 'Banco de la República', 'interes'],
    detalle: {
      queOcurrio: 'Ejemplo: la junta directiva anuncia un ajuste en la tasa de interés de referencia. Aquí irá el resumen de los hechos confirmados, con fecha y cifras.',
      sectores: SECTORES_EJEMPLO,
      sesgos: ['Algunos titulares destacan el efecto en el crédito y omiten el efecto en el ahorro.'],
      conclusion: {
        establecido: ['La decisión fue comunicada por la junta directiva (ejemplo).'],
        enDisputa: ['Qué tanto bajará la inflación como consecuencia (ejemplo).'],
        faltaConfirmar: ['El efecto real en los próximos meses (ejemplo).'],
      },
      referencias: [
        { fuenteId: 'banrep', titulo: 'Comunicado de la junta directiva (ejemplo)' },
        { fuenteId: 'eltiempo', titulo: 'Cobertura de la decisión (ejemplo)' },
      ],
    },
  },
  {
    id: 'registraduria-calendario',
    ambito: 'Colombia',
    categoria: 'politica',
    titular: 'Registraduría confirma el calendario electoral',
    resumen: 'Circula una versión distinta en redes sociales; esta es la fecha según la fuente oficial.',
    veredicto: 'verificado',
    marcaTiempo: horasAtras(6),
    esEjemplo: true,
    palabrasClave: ['calendario electoral', 'registraduria', 'elecciones'],
    cobertura: ['registraduria', 'colombiacheck', 'eltiempo', 'elespectador', 'cambio'],
    detalle: {
      queOcurrio: 'Ejemplo: en redes circulan dos fechas distintas para las elecciones. La Registraduría publicó el calendario oficial, que coincide con una de ellas.',
      sectores: SECTORES_EJEMPLO,
      sesgos: ['Varias publicaciones en redes citan la fecha sin enlazar la fuente oficial.'],
      conclusion: {
        establecido: ['La fecha oficial es la publicada por la Registraduría (ejemplo).'],
        enDisputa: [],
        faltaConfirmar: [],
      },
      referencias: [
        { fuenteId: 'registraduria', titulo: 'Calendario electoral oficial (ejemplo)' },
        { fuenteId: 'colombiacheck', titulo: 'Verificación de la fecha (ejemplo)' },
      ],
    },
  },
  {
    id: 'onu-informe-clima',
    ambito: 'Mundial',
    categoria: 'medioambiente',
    titular: 'Nuevo informe de la ONU sobre temperatura global',
    resumen: 'El organismo presentó cifras actualizadas de los últimos cinco años y sus proyecciones.',
    veredicto: null,
    marcaTiempo: horasAtras(8),
    esEjemplo: true,
    palabrasClave: ['clima', 'cambio climático', 'calentamiento', 'temperatura'],
    cobertura: ['afpfactual', 'eltiempo', 'elespectador', 'cambio'],
    detalle: {
      queOcurrio: 'Ejemplo: un organismo internacional presenta un informe con cifras de temperatura de los últimos cinco años y proyecciones a futuro.',
      sectores: SECTORES_EJEMPLO,
      sesgos: [
        'Algunos titulares destacan solo el escenario más alarmante del informe.',
        'Las cifras se citan sin indicar el periodo que comparan.',
      ],
      conclusion: {
        establecido: ['Existe un informe publicado con cifras de temperatura (ejemplo).'],
        enDisputa: ['Cómo interpretar las proyecciones a futuro (ejemplo).'],
        faltaConfirmar: ['La metodología completa de las proyecciones (ejemplo).'],
      },
      referencias: [
        { fuenteId: 'afpfactual', titulo: 'Cobertura del informe (ejemplo)' },
        { fuenteId: 'eltiempo', titulo: 'Nota sobre el informe (ejemplo)' },
      ],
    },
  },
  {
    id: 'cadena-vacuna-falsa',
    ambito: 'Colombia',
    categoria: 'salud',
    titular: 'Cadena de WhatsApp sobre efectos de una vacuna',
    resumen: 'El mensaje reenviado no coincide con lo publicado por el Ministerio de Salud ni por la OMS.',
    veredicto: 'falso',
    marcaTiempo: horasAtras(5),
    esEjemplo: true,
    palabrasClave: ['vacuna', 'salud', 'verificación'],
    cobertura: ['minsalud', 'colombiacheck', 'afpfactual', 'eltiempo'],
    detalle: {
      queOcurrio: 'Ejemplo: un mensaje reenviado por WhatsApp afirma efectos de una vacuna. Aquí irá lo que dicen las autoridades sanitarias y los verificadores.',
      sectores: SECTORES_EJEMPLO,
      sesgos: [
        'El mensaje no cita ninguna fuente ni fecha.',
        'Usa lenguaje de alarma para que se reenvíe sin revisar.',
      ],
      conclusion: {
        establecido: ['Las autoridades sanitarias no respaldan lo que afirma el mensaje (ejemplo).'],
        enDisputa: [],
        faltaConfirmar: ['El origen del mensaje original (ejemplo).'],
      },
      referencias: [
        { fuenteId: 'minsalud', titulo: 'Comunicado de salud pública (ejemplo)' },
        { fuenteId: 'colombiacheck', titulo: 'Verificación del mensaje (ejemplo)' },
      ],
    },
  },
  {
    id: 'dane-cifras-empleo',
    ambito: 'Colombia',
    categoria: 'economia',
    titular: 'DANE publica cifras de empleo del último trimestre',
    resumen: 'El dato se compara con el mismo periodo del año anterior y con el promedio regional.',
    veredicto: null,
    marcaTiempo: horasAtras(2),
    esEjemplo: true,
    palabrasClave: ['empleo', 'economía', 'DANE'],
    cobertura: ['dane', 'eltiempo', 'cambio'],
    detalle: {
      queOcurrio: 'Ejemplo: el DANE publica las cifras de empleo del último trimestre. Aquí irá el resumen con las cifras y el periodo exacto.',
      sectores: SECTORES_EJEMPLO,
      sesgos: ['Algunos medios comparan contra periodos distintos entre sí.'],
      conclusion: {
        establecido: ['Las cifras provienen de la publicación oficial del DANE (ejemplo).'],
        enDisputa: ['Qué comparación es la más adecuada para interpretarlas (ejemplo).'],
        faltaConfirmar: [],
      },
      referencias: [
        { fuenteId: 'dane', titulo: 'Boletín técnico de empleo (ejemplo)' },
        { fuenteId: 'cambio', titulo: 'Análisis de los datos (ejemplo)' },
      ],
    },
  },
  {
    id: 'cumbre-energia',
    ambito: 'Mundial',
    categoria: 'internacional',
    titular: 'Cumbre internacional sobre transición energética',
    resumen: 'Representantes de varios países discutieron metas conjuntas para la próxima década.',
    veredicto: null,
    marcaTiempo: horasAtras(10),
    esEjemplo: true,
    palabrasClave: ['transición energética', 'metas', 'cumbre internacional'],
    cobertura: ['eltiempo', 'elespectador', 'cambio'],
    detalle: {
      queOcurrio: 'Ejemplo: representantes de varios países discuten metas conjuntas de transición energética para la próxima década.',
      sectores: SECTORES_EJEMPLO,
      sesgos: ['La cobertura se apoya en pocas fuentes; falta la voz de varios países participantes.'],
      conclusion: {
        establecido: ['La cumbre se realizó y hubo discusión sobre metas (ejemplo).'],
        enDisputa: ['Qué tan vinculantes son las metas (ejemplo).'],
        faltaConfirmar: ['El texto final del acuerdo, si lo hay (ejemplo).'],
      },
      referencias: [
        { fuenteId: 'eltiempo', titulo: 'Cobertura de la cumbre (ejemplo)' },
        { fuenteId: 'elespectador', titulo: 'Crónica de las sesiones (ejemplo)' },
      ],
    },
  },
  {
    id: 'cifra-viral-pobreza',
    ambito: 'Colombia',
    categoria: 'economia',
    titular: 'Una cifra de pobreza circula sin fuente clara en redes',
    resumen: 'El dato que se comparte no coincide con el más reciente reportado por el DANE.',
    veredicto: 'dudoso',
    marcaTiempo: horasAtras(4),
    esEjemplo: true,
    palabrasClave: ['pobreza', 'DANE', 'verificación'],
    cobertura: ['dane', 'colombiacheck'],
    detalle: {
      queOcurrio: 'Ejemplo: circula una cifra de pobreza sin fuente. Se compara con el último dato publicado por el DANE.',
      sectores: SECTORES_EJEMPLO,
      sesgos: ['La cifra se comparte sin indicar el año ni la metodología.'],
      conclusion: {
        establecido: ['Existe una cifra oficial más reciente publicada por el DANE (ejemplo).'],
        enDisputa: ['Si la cifra viral corresponde a otra medición o a otro año (ejemplo).'],
        faltaConfirmar: ['El origen de la cifra que circula (ejemplo).'],
      },
      referencias: [
        { fuenteId: 'dane', titulo: 'Cifras oficiales de pobreza (ejemplo)' },
        { fuenteId: 'colombiacheck', titulo: 'Verificación de la cifra (ejemplo)' },
      ],
    },
  },
  {
    id: 'seguridad-frontera',
    ambito: 'Colombia',
    categoria: 'seguridad',
    titular: 'Reporte sobre operativo en zona fronteriza',
    resumen: 'Autoridades locales y nacionales dieron versiones con algunos detalles distintos.',
    veredicto: null,
    marcaTiempo: horasAtras(7),
    esEjemplo: true,
    palabrasClave: ['seguridad', 'frontera', 'operativo'],
    cobertura: ['procuraduria', 'eltiempo', 'elespectador', 'cambio'],
    detalle: {
      queOcurrio: 'Ejemplo: autoridades locales y nacionales entregan versiones con algunos detalles distintos sobre un operativo.',
      sectores: SECTORES_EJEMPLO,
      sesgos: ['Las versiones oficiales no han sido contrastadas con fuentes independientes en el terreno.'],
      conclusion: {
        establecido: ['El operativo ocurrió, según varias fuentes (ejemplo).'],
        enDisputa: ['Los detalles en los que difieren las versiones (ejemplo).'],
        faltaConfirmar: ['Un balance oficial y una verificación independiente (ejemplo).'],
      },
      referencias: [
        { fuenteId: 'procuraduria', titulo: 'Pronunciamiento oficial (ejemplo)' },
        { fuenteId: 'eltiempo', titulo: 'Cobertura del operativo (ejemplo)' },
      ],
    },
  },
];
