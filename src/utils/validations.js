export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isTooLong = (value, max) => {
  return value.trim().length > max
}

export const isEmpty = (value) => {
  return value.trim() === ''
}
