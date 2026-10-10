export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim());

export function validateLogin({ email, password }) {
  const e = {};
  if (!email || !email.trim()) e.email = 'Enter your email address.';
  else if (!isEmail(email)) e.email = 'Enter a valid email address, like name@example.com.';
  if (!password) e.password = 'Enter your password.';
  return e;
}

export function validateRegister({ name, email, password, confirmPassword }) {
  const e = {};
  if (!name || name.trim().length < 2) e.name = 'Enter your full name (at least 2 characters).';
  if (!email || !email.trim()) e.email = 'Enter your email address.';
  else if (!isEmail(email)) e.email = 'Enter a valid email address, like name@example.com.';
  if (!password) e.password = 'Create a password.';
  else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
    e.password = 'Use at least 8 characters, with at least one letter and one number.';
  if (!confirmPassword) e.confirmPassword = 'Re-enter your password.';
  else if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match.';
  return e;
}

export function validateEvent(f, { requireFuture = true } = {}) {
  const e = {};
  const title = (f.title || '').trim();
  if (title.length < 3) e.title = 'Enter an event title (at least 3 characters).';
  else if (title.length > 100) e.title = 'Keep the title under 100 characters.';
  if ((f.description || '').trim().length < 10) e.description = 'Describe the event in at least 10 characters.';
  if (!f.date) e.date = 'Choose a date.';
  else if (Number.isNaN(new Date(`${f.date}T00:00:00`).getTime())) e.date = 'Choose a valid date.';
  if (!f.time) e.time = 'Choose a start time.';
  if (!(f.location || '').trim()) e.location = 'Enter a location.';
  const cap = Number(f.capacity);
  if (f.capacity === '' || f.capacity === undefined || f.capacity === null) e.capacity = 'Enter the seat capacity.';
  else if (!Number.isInteger(cap) || cap < 1 || cap > 5000) e.capacity = 'Capacity must be a whole number from 1 to 5000.';
  if (!e.date && !e.time && requireFuture && new Date(`${f.date}T${f.time}:00`).getTime() <= Date.now())
    e.date = 'Choose a date and time in the future.';
  return e;
}

export function validateClub(f) {
  const e = {};
  const name = (f.name || '').trim();
  if (name.length < 3) e.name = 'Enter a club name (at least 3 characters).';
  else if (name.length > 80) e.name = 'Keep the name under 80 characters.';
  if ((f.description || '').trim().length < 10) e.description = 'Describe the club in at least 10 characters.';
  if (!f.category) e.category = 'Choose a category.';
  return e;
}
