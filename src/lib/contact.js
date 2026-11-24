/* Contact-form rules shared by the form (src/components/ContactForm.jsx) and the API
   (api/contact.js), so the browser and the server accept exactly the same enquiries. */

export const LIMITS = { name: 100, email: 254, phone: 20, company: 120, service: 80, budget: 40, details: 5000 };
export const FIELDS = Object.keys(LIMITS);

export function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address, like name@company.com.";
  if (f.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(f.phone.trim())) e.phone = "Enter a valid phone number, or leave this empty.";
  if (!f.service) e.service = "Choose the service you need.";
  if (f.details.trim().length < 20) e.details = "Tell us a little more — at least 20 characters.";
  for (const k of FIELDS) if (!e[k] && (f[k] ?? "").length > LIMITS[k]) e[k] = `Keep this under ${LIMITS[k]} characters.`;
  return e;
}
