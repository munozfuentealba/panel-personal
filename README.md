# Panel Personal

Dashboard personal de Diego Muñoz. Sitio estático, sin build ni dependencias:
HTML, CSS y JavaScript con módulos ES nativos.

## Secciones

| Sección | Qué muestra |
| --- | --- |
| Resumen | Balance del mes, seguidores, facturación, tareas, clima y agenda |
| Clima | Osorno y Puerto Montt, pronóstico a 7 días |
| Finanzas Personales | Ingresos, gastos, presupuestos por categoría y ahorro |
| Marca Personal | Objetivos, pilares de contenido e hitos |
| Empresa | Facturación, pipeline y proyectos |
| Red Social | Seguimiento de Instagram (@munozfuentealba) |
| Producción Musical | Proyectos, horas de estudio e ideas |
| Iglesia | Compromisos, servicio y repertorio |
| Familia | Planes, fechas importantes e intenciones |
| Trabajo | Tareas, prioridades y horas de foco |

## Dónde viven los datos

Cada cambio se guarda solo, al instante, en el **localStorage de tu navegador**.
No hay servidor, base de datos ni cuenta: nada de lo que escribas se sube a este
repositorio ni sale de tu equipo.

**Los datos no están en GitHub, y no pueden estarlo**, por dos razones:

1. Este repositorio es público. Guardar aquí las finanzas, la facturación o los
   asuntos de familia los dejaría visibles para cualquiera — y el historial de
   git no olvida, así que borrarlos después no los borraría.
2. Un sitio en GitHub Pages solo sirve archivos; no puede escribir en su propio
   repositorio. Para lograrlo haría falta un token con permiso de escritura
   dentro del navegador, que en un sitio público queda expuesto a cualquiera.

GitHub aloja la *aplicación*; tu navegador guarda los *datos*. Son cosas
distintas: borrar tus datos no borra la app, y la app estando en GitHub no
respalda tus datos.

### Para no perder nada

**Ajustes → Respaldo automático**: eliges un archivo una vez (por ejemplo dentro
de iCloud Drive) y desde ahí cada cambio se escribe también ahí, solo. Como
iCloud sincroniza, los datos quedan en todos tus equipos. Usa la File System
Access API: funciona en Chrome y Edge, no en Safari ni Firefox.

**Ajustes → Copia manual**: Exportar descarga un JSON; Importar lo restaura.
Funciona en cualquier navegador.

Sin respaldo, si borras los datos de navegación o abres el panel en otro equipo,
verás los datos de ejemplo.

## Sobre la sección de Instagram

Las métricas se ingresan **a mano**. Instagram no permite leer datos de un
perfil sin autenticación, y las métricas reales (alcance, interacciones) solo
están disponibles vía la API de Meta con un token propio.

Los números están en la app: **Perfil → Panel profesional → Ver todo**. Cada
vez que guardas, el panel registra un punto en el historial y arma solo el
gráfico de crecimiento.

## Clima

Datos de [Open-Meteo](https://open-meteo.com), que es abierta y no requiere API
key — importante, porque este repositorio es público y una clave quedaría
expuesta. Se cachean 30 minutos; si no hay conexión, se muestra el último
pronóstico descargado.

## Desarrollo

Los módulos ES requieren HTTP; abrir `index.html` con `file://` no funciona.

```sh
python3 -m http.server 4321
# http://localhost:4321
```

```
index.html
assets/
  css/styles.css      Sistema de diseño, temas y transiciones
  js/
    app.js            Arranque, router, tema y navegación
    sections.js       Render de cada sección
    components.js     Tarjetas, métricas, barras y gráficos
    store.js          Estado y persistencia en localStorage
    backup.js         Respaldo automático en archivo (File System Access)
    weather.js        Open-Meteo
    utils.js          Formato (es-CL) y utilidades de DOM
```

## Licencia

MIT
