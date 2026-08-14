export function formatDate(dateStr, lang) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatCount(value, lang, { pad = false } = {}) {
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  if (pad && value < 10) {
    const zero = (0).toLocaleString(locale);
    return zero + value.toLocaleString(locale);
  }
  return value.toLocaleString(locale);
}