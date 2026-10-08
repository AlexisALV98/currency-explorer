# Currency Explorer · Starter Project

## Integrantes
- Estudiante A: Javier Zarza Rojas
- Estudiante B: Alexis Acosta Alvarez

## Pair Programming
| Misión | Driver | Navigator | Commit / evidencia |
|---|---|---|---|
| 04 | Javier Zarza Rojas | Alexis Acosta Alvarez | LAS MONEDAS SE LEEN DE LOS SELECT ELEGIDOS POR EL USUARIO. |
| 05 |Alexis Acosta Alvarez | Javier Zarza Rojas | calcular y delegar la presentacion a otra funcion.|
| 06 | Javier Zarza Rojas| Alexis Acosta Alvarez| Intercambia las monedas seleccionadas y recalcula.|
| 07 |Alexis Acosta Alvarez | Javier Zarza Rojas |validación completa de cantidad y monedas iguales |
| 08 |Javier Zarza Rojas | Alexis Acosta Alvarez |activa o desactiva el estado visual de carga. |
| 09 |Alexis Acosta Alvarez | Javier Zarza Rojas | response.ok y mensajes de error por tipo |
| 10 |Javier Zarza Rojas |Alexis Acosta Alvarez | diseño responsive y foco visible |

## Objetivo
Completar una aplicación frontend que consuma Frankfurter API para convertir divisas y demostrar comprensión de eventos, DOM, `fetch()`, JSON, asincronía, validación y manejo de errores.

## Ejecución
1. Descomprime el proyecto.
2. Abre la carpeta en VS Code.
3. Ejecuta `index.html` con Live Server o un servidor local equivalente.
4. Abre DevTools → Console y Network para observar el comportamiento.

## API
Endpoint de referencia:
`https://api.frankfurter.dev/v2/rate/{origen}/{destino}`

## Decisiones técnicas
Registra aquí al menos dos decisiones tomadas por la pareja y explica por qué.

## Decisiones técnicas

1. Validar antes de consultar la API. 
Separamos la validación en la función `validarCantidad()`, que devuelve un mensaje de error o `null`, y además comprobamos que origen y destino sean diferentes. Así cada error tiene un mensaje claro y no se envían peticiones innecesarias a la API con datos inválidos.

2. Revisar `response.ok` y usar `finally` para el estado de carga.
 Descubrimos que `fetch()` solo falla con errores de red, pero no cuando la API responde 404 o 500. Por eso lanzamos un error manualmente con `throw` si `response.ok` es falso, y la función `obtenerMensajeError()` traduce cada tipo de error a un mensaje comprensible. Además, `mostrarCargando(false)` se ejecuta dentro de `finally` para que los botones siempre se desbloqueen, aunque la consulta falle.


## Revisión cruzada
- Aspecto bien resuelto:
 la separación de responsabilidades. `convertirMoneda()` coordina el flujo, mientras que `validarCantidad()`, `mostrarResultado()`, `mostrarCargando()` y `mostrarError()` tienen una sola tarea cada una, lo que hace el código más fácil de leer y modificar.

- Error o comportamiento mejorable:
la lista de monedas está escrita a mano en el HTML y solo incluye 5 divisas, aunque la API ofrece muchas más.

- Propuesta de mejora:
cargar las monedas dinámicamente desde el endpoint `/v2/currencies` al abrir la página y generar las opciones de los `<select>` con JavaScript.

- Cambio incorporado después de la revisión:
 durante la Misión 04, el Navigator probó convertir EUR → EUR y observó que la aplicación hacía una petición innecesaria a la API. Esa observación se incorporó en la Misión 07 como una validación que impide consultar cuando ambas monedas son iguales.

## Reflexión final

El principal aprendizaje técnico fue entender que consumir una API es un recorrido con varias etapas: el clic dispara un evento, `fetch()` envía la solicitud, la respuesta HTTP se convierte en un objeto JavaScript con `response.json()` y, finalmente, el resultado se muestra en el DOM. Descubrimos que `fetch()` no lanza un error cuando la API responde 404 o 500, por lo que tuvimos que revisar `response.ok` manualmente para que la aplicación no mostrara resultados incorrectos.

La dificultad más relevante no fue el código, sino Git: al ser nuestro primer repositorio, al inicio lo creamos en la carpeta equivocada, después trabajamos en dos carpetas distintas sin darnos cuenta y tuvimos un conflicto al hacer `git pull` con cambios sin guardar, que resolvimos con `git stash`.

La decisión colaborativa más importante surgió del Navigator: al probar la Misión 04, observó que elegir EUR → EUR enviaba una petición innecesaria a la API, y esa observación se convirtió en una validación de la Misión 07. Alternar roles nos obligó a explicar cada línea en voz alta antes de hacer commit.
