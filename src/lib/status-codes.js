export function assertValidStatusCode(value) {
  if (isNaN(value)) throw new Error('statusCode must be number');
  if (value < 0) throw new Error('statusCode must be positive number');
  if (Math.floor(value) !== value) throw new Error('statusCode must be whole number');
}
