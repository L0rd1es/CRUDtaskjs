export function isAlphabetic(input: string): boolean {
  return /^[A-Za-z]+$/.test(input);
}
