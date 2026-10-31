// STUB — built from Figma "Concept 09 — AI notes drawer (open)" (5367:6857) + "AI notes drawer · full scroll" (5401:8028)
export default function AINotesDrawer({ open, onClose }) {
  if (!open) return null;
  return (<aside role="dialog" aria-label="How I use AI in my work"><button onClick={onClose}>Close</button></aside>);
}
