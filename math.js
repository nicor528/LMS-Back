const base = 2;
const exponente = 21;
const divisor = 13;

// Calcula 2^21 y luego obtiene el resto al dividirlo por 13
const resultado = Math.pow(base, exponente) % divisor;

console.log(resultado);