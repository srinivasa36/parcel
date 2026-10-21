export const isEmail = (v = '') => /^\S+@\S+\.\S+$/.test(v.trim());

export const formatCardNumber = (v = '') => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
export const formatExpiry = (v = '') => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export function validateRequired(values, labels) {
  const errors = {};
  Object.entries(labels).forEach(([key, label]) => {
    if (!String(values[key] ?? '').trim()) errors[key] = `${label} is required`;
  });
  return errors;
}
