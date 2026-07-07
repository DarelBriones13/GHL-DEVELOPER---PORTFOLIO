/**
 * Smoothly scrolls to a section by its element id.
 * Does NOT change the URL — avoids blank-screen reloads in SPAs.
 */
export const scrollTo = (id, offset = 80) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};
