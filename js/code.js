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

// MISIÓN 11: referencias del histórico
const periodo = document.querySelector("#periodo");
const btnHistorico = document.querySelector("#verHistorico");
const historicoEstado = document.querySelector("#historicoEstado");
const grafica = document.querySelector("#grafica");

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);
btnHistorico.addEventListener("click", verHistorico);

// 3. FUNCIONES DE LA APLICACIÓN

async function convertirMoneda() {
  // MISIÓN 07: validar antes de convertir el texto a número.
  const errorCantidad = validarCantidad(cantidad.value);
  if (errorCantidad) {
    mostrarError(errorCantidad);
    return;
  }

  const valor = Number(cantidad.value);

  // MISIÓN 04: las monedas se leen de los <select> elegidos por el usuario.
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

  // MISIÓN 07: no tiene sentido consultar la API si ambas monedas son iguales.
  if (monedaOrigen === monedaDestino) {
    mostrarError("Elige dos monedas diferentes para convertir.");
    return;
  }

  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;

  try {
    // MISIÓN 08: avisar al usuario y bloquear botones mientras se consulta.
    mostrarCargando(true);

    const respuesta = await fetch(url);

    // MISIÓN 09: fetch no falla con 404/500, hay que revisarlo nosotros.
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    // MISIÓN 09: asegurarnos de que el JSON trae una tasa numérica.
    if (!Number.isFinite(datos.rate)) {
      throw new Error("Respuesta sin tasa válida");
    }

    // MISIÓN 05: calcular y delegar la presentación a otra función.
    const conversion = valor * datos.rate;
    mostrarResultado(valor, conversion, monedaOrigen, monedaDestino, datos);

  } catch (error) {
    // MISIÓN 09: mostrar un mensaje según el tipo de error.
    mostrarError(obtenerMensajeError(error));
    console.error(error);

  } finally {
    // MISIÓN 08: se ejecuta SIEMPRE, haya salido bien o mal.
    mostrarCargando(false);
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

// MISIÓN 11: consulta la serie temporal mensual y la dibuja.
async function verHistorico() {
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

  if (monedaOrigen === monedaDestino) {
    historicoEstado.textContent = "Elige dos monedas diferentes para ver el histórico.";
    grafica.innerHTML = "";
    return;
  }

  const desde = calcularFechaInicio(Number(periodo.value));
  const url = `https://api.frankfurter.dev/v2/rates?base=${monedaOrigen}&quotes=${monedaDestino}&from=${desde}&group=month`;

  try {
    btnHistorico.disabled = true;
    historicoEstado.textContent = "Consultando histórico...";
    grafica.innerHTML = "";

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    // La serie temporal es un ARREGLO de objetos { date, base, quote, rate }.
    if (!Array.isArray(datos) || datos.length === 0) {
      throw new Error("Sin datos históricos");
    }

    // map() transforma el arreglo de objetos en dos arreglos simples.
    const fechas = datos.map(item => item.date);
    const tasas = datos.map(item => item.rate);

    dibujarGrafica(fechas, tasas);
    historicoEstado.textContent = `Evolución mensual de 1 ${monedaOrigen} en ${monedaDestino}.`;

  } catch (error) {
    historicoEstado.textContent = obtenerMensajeError(error);
    console.error(error);

  } finally {
    btnHistorico.disabled = false;
  }
}

// MISIÓN 11: devuelve la fecha (AAAA-MM-01) de hace N meses.
function calcularFechaInicio(meses) {
  const fecha = new Date();
  fecha.setDate(1);                           // primero el día 1 para evitar saltos de mes
  fecha.setMonth(fecha.getMonth() - meses);   // retroceder N meses
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${anio}-${mes}-01`;
}

// 4. UTILIDADES DE INTERFAZ

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

// MISIÓN 08: activa o desactiva el estado visual de carga.
function mostrarCargando(activo) {
  btnConvertir.disabled = activo;
  btnIntercambiar.disabled = activo;
  btnConvertir.textContent = activo ? "Consultando..." : "Convertir";

  if (activo) {
    resultado.classList.remove("error");
    resultadoTexto.textContent = "Consultando...";
    detalleTasa.textContent = "Esperando respuesta de Frankfurter API.";
  }
}

// MISIÓN 11: dibuja una barra por mes; la altura depende de la tasa.
function dibujarGrafica(fechas, tasas) {
  const minimo = Math.min(...tasas);
  const maximo = Math.max(...tasas);
  const rango = maximo - minimo || 1;   // evita dividir entre 0 si todas son iguales

  grafica.innerHTML = tasas.map((tasa, i) => {
    // La barra más baja mide 20% y la más alta 100%, para que se note la variación.
    const altura = 20 + ((tasa - minimo) / rango) * 80;
    const etiqueta = `${fechas[i].slice(5, 7)}/${fechas[i].slice(2, 4)}`;  // "2026-03-01" -> "03/26"

    return `
      <div class="barra" style="height:${altura}%" title="${fechas[i]}: ${tasa}">
        <span class="barra-valor">${tasa.toFixed(4)}</span>
        <span class="barra-fecha">${etiqueta}</span>
      </div>`;
  }).join("");
}

// MISIÓN 09: traduce el error técnico a un mensaje claro para el usuario.
function obtenerMensajeError(error) {
  if (!navigator.onLine) {
    return "Sin conexión a internet. Revisa tu red e inténtalo de nuevo.";
  }
  if (error instanceof TypeError) {
    return "No se pudo conectar con el servidor de tipos de cambio.";
  }
  if (error.message === "HTTP 404") {
    return "La API no encontró ese par de monedas.";
  }
  if (error.message.startsWith("HTTP 5")) {
    return "El servicio de tipos de cambio no está disponible. Intenta más tarde.";
  }
  if (error.message.startsWith("HTTP")) {
    return `La API respondió con un error (${error.message}).`;
  }
  return "La respuesta de la API no tiene el formato esperado.";
}

function mostrarError(mensaje) {
  resultado.classList.add("error");
  resultadoTexto.textContent = mensaje;
  detalleTasa.textContent = "Revisa los datos e inténtalo nuevamente.";
}