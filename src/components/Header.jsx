import { HelpCircle } from 'lucide-react';
import logo from '../assets/logo.svg';

export function Header({ onHelpClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <img src={logo} alt="Wadia logo" className="header-logo" />
          <div>
            <div className="header-title">Wadia MileageTracker</div>
            <div className="header-subtitle">Business mileage &amp; tax deduction log</div>
          </div>
        </div>
        <button className="header-help-btn" onClick={onHelpClick}>
          <HelpCircle size={16} />
          <span>Help</span>
        </button>
      </div>
    </header>
  );
}
