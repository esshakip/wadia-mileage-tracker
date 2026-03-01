import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { computeDeduction, filterCurrentMonth } from './utils/calculations';
import { Header } from './components/Header';
import { DashboardCards } from './components/DashboardCards';
import { TabBar } from './components/TabBar';
import { TripLogTab } from './components/tabs/TripLogTab';
import { ManualTab } from './components/tabs/ManualTab';
import { CalendarTab } from './components/tabs/CalendarTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { LogTripModal } from './components/modals/LogTripModal';
import { HelpModal } from './components/modals/HelpModal';
import './App.css';

export default function App() {
  const [trips, setTrips] = useLocalStorage('wadia_trips', []);
  const [settings, setSettings] = useLocalStorage('wadia_settings', {
    officeLocation: '123 Office Plaza, San Francisco, CA',
    mileageRate: 0.70,
    gcalClientId: '',
  });
  const [activeTab, setActiveTab] = useState('log');
  const [showHelp, setShowHelp] = useState(false);
  const [logTripEvent, setLogTripEvent] = useState(null);
  const [gcalToken, setGcalToken] = useState('');

  // Computed metrics (derived, never stored)
  const totalTrips = trips.length;
  const totalMiles = trips.reduce((sum, t) => sum + Number(t.distance), 0);
  const thisMonthMiles = filterCurrentMonth(trips).reduce((sum, t) => sum + Number(t.distance), 0);
  const estDeduction = trips.reduce((sum, t) => sum + Number(t.deduction), 0);

  function addTrip(tripData) {
    const deduction = computeDeduction(tripData.distance, settings.mileageRate);
    const newTrip = {
      id: crypto.randomUUID(),
      ...tripData,
      deduction,
    };
    setTrips([newTrip, ...trips]);
  }

  function deleteTrip(id) {
    setTrips(trips.filter((t) => t.id !== id));
  }

  function saveSettings(newSettings) {
    const rateChanged = newSettings.mileageRate !== settings.mileageRate;
    // If the client ID changed, drop the in-memory token so the user re-authenticates
    if (newSettings.gcalClientId !== settings.gcalClientId) {
      setGcalToken('');
    }
    setSettings(newSettings);
    if (rateChanged) {
      setTrips(
        trips.map((t) => ({
          ...t,
          deduction: computeDeduction(t.distance, newSettings.mileageRate),
        }))
      );
    }
  }

  function handleLogTrip(event, distance) {
    addTrip({
      date: event.date,
      start: settings.officeLocation,
      end: event.location,
      distance: parseFloat(distance),
      purpose: event.title,
      type: 'calendar',
    });
    setLogTripEvent(null);
  }

  // Track which calendar events have already been logged
  const loggedEventIds = new Set(
    trips
      .filter((t) => t.type === 'calendar')
      .map((t) => t.purpose + '|' + t.date)
  );

  return (
    <div className="app">
      <Header onHelpClick={() => setShowHelp(true)} />

      <main className="main-content">
        <DashboardCards
          totalTrips={totalTrips}
          totalMiles={totalMiles}
          thisMonthMiles={thisMonthMiles}
          estDeduction={estDeduction}
          mileageRate={settings.mileageRate}
        />

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="tab-content">
          {activeTab === 'log' && (
            <TripLogTab trips={trips} onDelete={deleteTrip} />
          )}
          {activeTab === 'manual' && (
            <ManualTab
              officeLocation={settings.officeLocation}
              onAddTrip={addTrip}
            />
          )}
          {activeTab === 'calendar' && (
            <CalendarTab
              loggedEventIds={loggedEventIds}
              onLogTrip={(event) => setLogTripEvent(event)}
              gcalToken={gcalToken}
              gcalClientId={settings.gcalClientId}
              onGcalConnect={setGcalToken}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              onSave={saveSettings}
              gcalToken={gcalToken}
              onGcalConnect={setGcalToken}
              onGcalDisconnect={() => setGcalToken('')}
            />
          )}
        </div>
      </main>

      {logTripEvent && (
        <LogTripModal
          event={logTripEvent}
          officeLocation={settings.officeLocation}
          onConfirm={(distance) => handleLogTrip(logTripEvent, distance)}
          onClose={() => setLogTripEvent(null)}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
