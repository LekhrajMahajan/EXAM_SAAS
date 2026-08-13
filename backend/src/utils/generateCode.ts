export const generateCode = (
  prefix: string,
  length = 6
): string => {
  const random = Math.floor(
    Math.random() * Math.pow(10, length)
  )
    .toString()
    .padStart(length, "0");

  return `${prefix}-${random}`;
};