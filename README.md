# Sensores para monitorear un cultivo

Presentación educativa e interactiva sobre sensores integrables con Arduino para observar las condiciones del suelo y el ambiente. Las fichas usan los cuatro modelos seleccionados: YL-69, TMP36, MQ-2 y LDR de 5 mm.

## Cómo abrirla

Abre `index.html` directamente en un navegador moderno. No requiere instalación ni compilación. Las diapositivas y sus ilustraciones locales funcionan sin conexión; los enlaces bibliográficos sí necesitan internet.

## Navegación e interactividad

- Botones **anterior / siguiente** y puntos de progreso.
- Teclas **← / →**, **espacio**, **Inicio** y **Fin**.
- Deslizar a los lados en pantallas táctiles.
- Botón de pantalla completa.
- Simulador didáctico de humedad del suelo en la diapositiva 5. Sus valores son ilustrativos y no provienen de un sensor real.
- Los marcadores de cita llevan a la referencia APA correspondiente.

## Señales y pines sugeridos

La asignación supone un **Arduino Uno R3** y reserva una entrada analógica por sensor:

| Sensor | Tipo de señal | Pin recomendado |
| --- | --- | --- |
| YL-69 | AO analógica; DO opcional si se usa el módulo comparador | A0; D4 para DO |
| TMP36 | Salida de tensión analógica (VOUT) | A1 |
| MQ-2 | Tensión analógica del circuito de carga o salida AO del módulo; DO opcional en placa comparadora | A2; D4 para DO |
| LDR de 5 mm | Tensión analógica desde el punto medio de un divisor resistivo (p. ej., 10 kΩ) | A3 |

Los pines digitales D4 opcionales no deben conectarse simultáneamente a dos salidas. Calibra el YL-69 para el sustrato real; la LDR entrega una variación relativa, no lux precisos. El MQ-2 responde a humo y gases combustibles: necesita calentamiento y calibración, no mide CO₂ ni es un detector de seguridad certificado.

## Archivos

```text
index.html          Estructura y contenido de las 9 diapositivas
styles.css          Diseño responsive, componentes y animaciones
app.js              Navegación, controles y simulador
img/hero-farm.svg   Ilustración vectorial original de portada
img/sensor-yl69.svg Ilustración referencial YL-69
img/sensor-tmp36.svg Ilustración referencial TMP36
img/sensor-mq2.svg  Ilustración referencial MQ-2
img/sensor-ldr5mm.svg Ilustración referencial LDR de 5 mm
```

Las cuatro ilustraciones de sensores son SVG locales, recreadas como recursos vectoriales a partir de las referencias visuales compartidas; no son fotografías oficiales ni réplicas exactas de los productos. Los nombres de modelo aparecen en las fichas para identificarlos con claridad.

No se utilizan frameworks, bibliotecas ni recursos externos para renderizar la presentación. Las referencias bibliográficas y sus enlaces están reunidos en la última diapositiva.
