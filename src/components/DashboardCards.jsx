import { Car, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { formatMiles, formatCurrency } from '../utils/calculations';

function MetricCard({ icon, iconClass, value, label, sublabel }) {
  return (
    <div className="metric-card">
      <div className={`metric-card-icon ${iconClass}`}>{icon}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {sublabel && <div className="metric-sublabel">{sublabel}</div>}
    </div>
  );
}

export function DashboardCards({ totalTrips, totalMiles, thisMonthMiles, estDeduction, mileageRate, year }) {
  return (
    <div className="dashboard-cards">
      <MetricCard
        icon={<Car size={18} />}
        iconClass="teal"
        value={totalTrips}
        label="Trips This Year"
      />
      <MetricCard
        icon={<MapPin size={18} />}
        iconClass="navy"
        value={formatMiles(totalMiles)}
        label="Total Miles"
        sublabel={`${year} YTD`}
      />
      <MetricCard
        icon={<Calendar size={18} />}
        iconClass="orange"
        value={formatMiles(thisMonthMiles)}
        label="Miles This Month"
      />
      <MetricCard
        icon={<TrendingUp size={18} />}
        iconClass="green"
        value={formatCurrency(estDeduction)}
        label="Est. Deduction"
        sublabel={`@$${Number(mileageRate).toFixed(2)}/mile (${year})`}
      />
    </div>
  );
}
