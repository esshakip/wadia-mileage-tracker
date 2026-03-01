import { HelpCircle } from 'lucide-react';
import logo from '../assets/wadia-logo.png';

export function Header({ onHelpClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <img src={logo} alt="Wadia logo" className="header-logo" />
          <div className="header-subtitle">Business mileage &amp; tax deduction log</div>
        </div>
        <button className="header-help-btn" onClick={onHelpClick}>
          <HelpCircle size={16} />
          <span>Help</span>
        </button>
      </div>
    </header>
  );
}
