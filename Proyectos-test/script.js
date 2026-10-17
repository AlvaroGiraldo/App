function calcularTarifa(distanciaKm) {
  if (distanciaKm <= 5) return 8000;
  if (distanciaKm <= 10) return 12000;
  return 16000;
}

const distancia = 12;
console.log(calcularTarifa(distancia)); // 12000
