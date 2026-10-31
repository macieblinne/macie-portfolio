// System — 404 · Off route (Figma 5408:8686 summer / 5417:9861 winter).
import { IconTent, IconQuestionMark } from '@tabler/icons-react';
import SiteHeader from '../../site/SiteHeader.jsx';
import { Link } from '../../site/router.jsx';
import SystemTerrain from './SystemTerrain.jsx';
import './system.css';

export default function NotFound() {
  return (
    <div className="page sys-404">
      <SiteHeader />
      <main className="sys-404__main" id="main">
        <div className="sys-404__copy">
          <p className="sys-404__eyebrow">404 · Off route</p>
          <h1 className="sys-404__title">
            <span>You’ve wandered</span> <span>off the trail.</span>
          </h1>
          <p className="sys-404__lede">This page isn’t on the map. The route back is short.</p>
          <div className="sys-404__actions">
            <Link to="/" className="sys-btn sys-btn--primary">
              <IconTent size={16} stroke={2} aria-hidden="true" />
              Back to the trailhead
            </Link>
            <Link to="/work" className="sys-btn sys-btn--ghost">See the work</Link>
          </div>
          <p className="sys-404__sticker">No cell service up here</p>
        </div>

        <div className="sys-404__art" aria-hidden="true">
          <SystemTerrain viewBox="0 200 940 660" className="sys-404__terrain" />
          {/* Unmapped pin: floats above the model, stem doesn't reach the ground */}
          <div className="sys-404__pin">
            <span className="sys-404__pin-head"><IconQuestionMark size={22} stroke={2} /></span>
            <span className="sys-404__pin-stem" />
            <span className="sys-404__pin-foot" />
          </div>
          <div className="sys-404__plate">
            <strong>Unmapped</strong>
            <span>Elevation unknown</span>
          </div>
        </div>
      </main>
    </div>
  );
}
