// STUB — built from Figma "System — Loading" (5408:8614) / "· Winter" (5417:9789)
// Contract: rendered by App above everything while `visible`; must fade itself out
// when `visible` turns false (App unmounts it ~400ms later).
export default function LoadingScreen({ visible }) { return visible ? <div role="status" aria-live="polite">Loading</div> : null; }
