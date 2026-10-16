/**
 * Converte um valor em minutos para o formato legível com horas e minutos.
 * Exemplo: 125 minutos -> "2h05min", 9 minutos -> "9min", -180 minutos -> "-3h00min"
 */
export function formatarMinutosHoras(
  minutos: number | null | undefined,
  options?: { showSign?: boolean }
): string {
  if (minutos === null || minutos === undefined || isNaN(minutos)) {
    return "0min";
  }

  const rounded = Math.round(minutos);
  const absMin = Math.abs(rounded);
  const sign = rounded < 0 ? "-" : options?.showSign && rounded > 0 ? "+" : "";

  if (absMin < 60) {
    return `${sign}${absMin}min`;
  }

  const h = Math.floor(absMin / 60);
  const m = absMin % 60;
  const mPad = m.toString().padStart(2, "0");

  return `${sign}${h}h${mPad}min`;
}
