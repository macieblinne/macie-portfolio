// Shared footer for inner pages. Page agents: if a frame's footer differs, build it
// inside your page instead of editing this file.
import { LINKS } from './site.jsx';
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="site-footer__mark">© Macie Linne · Boulder, CO</span>
      <nav className="site-footer__links" aria-label="Contact">
        <a href={LINKS.email}>{LINKS.emailLabel}</a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={LINKS.resume}>Resume</a>
      </nav>
    </footer>
  );
}
