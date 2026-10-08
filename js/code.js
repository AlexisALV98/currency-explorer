// ============================================================
// CURRENCY EXPLORER · STARTER PROJECT
// Archivo principal de trabajo para las misiones de JavaScript
// ============================================================

// 1. REFERENCIAS AL DOM
const cantidad = document.querySelector("#cantidad");
const origen = document.querySelector("#origen");
const destino = document.querySelector("#destino");
const btnConvertir = document.querySelector("#convertir");
const btnIntercambiar = document.querySelector("#intercambiar");
const resultado = document.querySelector("#resultado");
const resultadoTexto = document.querySelector("#resultadoTexto");
const detalleTasa = document.querySelector("#detalleTasa");

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);

// 3. FUNCIÓN PRINCIPAL
async function convertirMoneda() {
  // Misiones guiadas 1-3: ya existe un flujo mínimo funcional EUR -> USD.
  // A partir de la Misión 4 debes convertirlo en una solución dinámica.

  
  // MISIÓN 07: validar antes de convertir el texto a número.
  const errorCantidad = validarCantidad(cantidad.value);
  if (errorCantidad) {
    mostrarError(errorCantidad);
    return;
  }

  const valor = Number(cantidad.value);

  // TODO · MISIÓN 04: LAS MONEDAS SE LEEN DE LOS SELECT ELEGIDOS POR EL USUARIO.
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

    // MISIÓN 07: no tiene sentido consultar la API si ambas monedas son iguales.
  if (monedaOrigen === monedaDestino) {
    mostrarError("Elige dos monedas diferentes para convertir.");
    return;
  }

  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;

  try {
    // TODO · MISIÓN 08: activar un estado visual de carga antes de consultar.
    const respuesta = await fetch(url);

    // TODO · MISIÓN 09: comprobar response.ok y lanzar un error si corresponde.
    const datos = await respuesta.json();

        // MISIÓN 05: calcular y delegar la presentación a otra función.
    const conversion = valor * datos.rate;
    mostrarResultado(valor, conversion, monedaOrigen, monedaDestino, datos);

  } catch (error) {
    // TODO · MISIÓN 09: mejora el mensaje y analiza qué errores pueden llegar aquí.
    mostrarError("No fue posible completar la consulta.");
    console.error(error);
  }
}

// MISIÓN 06: intercambia las monedas seleccionadas y recalcula.
function intercambiarMonedas() {
  const temporal = origen.value;     // 1) guardar el origen
  origen.value = destino.value;      // 2) origen toma el valor de destino
  destino.value = temporal;          //    destino toma el origen guardado
  convertirMoneda();                 // 3) volver a calcular
}

// MISIÓN 07: devuelve un mensaje de error, o null si la cantidad es válida.
function validarCantidad(texto) {
  if (texto.trim() === "") {
    return "Escribe una cantidad para convertir.";
  }

  const numero = Number(texto);

  if (!Number.isFinite(numero)) {
    return "La cantidad no es un número válido.";
  }
  if (numero <= 0) {
    return "La cantidad debe ser mayor que cero.";
  }
  if (numero > 1e12) {
    return "La cantidad es demasiado grande (máximo 1,000,000,000,000).";
  }

  return null;
}
// MISIÓN 05: formatea un número con separador de miles y 2 decimales.
function formatearNumero(numero) {
  return numero.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// MISIÓN 05: muestra la conversión en el DOM.
function mostrarResultado(valor, conversion, monedaOrigen, monedaDestino, datos) {
  resultado.classList.remove("error");
  resultadoTexto.textContent =
    `${formatearNumero(valor)} ${monedaOrigen} = ${formatearNumero(conversion)} ${monedaDestino}`;
  detalleTasa.textContent =
    `1 ${monedaOrigen} = ${datos.rate} ${monedaDestino} · Fecha: ${datos.date}`;
}

// 4. UTILIDADES DE INTERFAZ
function mostrarError(mensaje) {
  resultado.classList.add("error");
  resultadoTexto.textContent = mensaje;
  detalleTasa.textContent = "Revisa los datos e inténtalo nuevamente.";
}

// PISTA PARA EL RETO:
// origen.value        -> moneda seleccionada como origen
// destino.value       -> moneda seleccionada como destino
// cantidad.value      -> texto escrito en el input
// Number(...)         -> convierte texto a número
// response.ok         -> indica si la respuesta HTTP fue satisfactoria
// resultado.textContent -> permite modificar texto del DOM
