export function applyPhoneMask(value: string): string {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length <= 10) {
    // (00) 0000-0000
    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // (00) 00000-0000
    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }
}