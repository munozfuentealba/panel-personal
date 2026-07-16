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

Todo lo que ingresas se guarda en el **localStorage de tu navegador**. No hay
servidor, base de datos ni cuenta: nada de lo que escribas se sube a este
repositorio ni sale de tu equipo.

Consecuencias prácticas:

- Si abres el panel en otro equipo o navegador, verás los datos de ejemplo.
- Si borras los datos de navegación, se pierde lo ingresado.
- Usa **Ajustes → Exportar datos** para descargar un respaldo en JSON.

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
    weather.js        Open-Meteo
    utils.js          Formato (es-CL) y utilidades de DOM
```

## Licencia

MIT
