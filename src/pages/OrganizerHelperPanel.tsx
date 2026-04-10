import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { mockEvents, mockRegistrations } from '@/data/mockData';
import { Calendar, QrCode, Users, Settings } from 'lucide-react';

const OrganizerHelperPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);

  const assignedEventIds = user?.assignedEvents || ['e1', 'e3'];
  const myEvents = mockEvents.filter(e => assignedEventIds.includes(e.id));
  const myRegistrations = mockRegistrations.filter(r => assignedEventIds.includes(r.eventId));

  const tabs = [
    { id: 'events', label: 'My Events', icon: <Calendar className="h-4 w-4" /> },
    { id: 'scanner', label: 'QR Scanner', icon: <QrCode className="h-4 w-4" /> },
    { id: 'attendees', label: 'Attendees', icon: <Users className="h-4 w-4" /> },
    { id: 'status', label: 'Event Status', icon: <Settings className="h-4 w-4" /> },
  ];

  const handleScan = () => {
    const reg = mockRegistrations.find(r => r.qrCode === qrInput);
    if (reg) {
      setScanResult(`✅ ${reg.userName} — checked in for ${reg.eventTitle}`);
    } else {
      setScanResult('❌ Invalid QR code. No registration found.');
    }
  };

  return (
    <DashboardLayout role="helper" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'events' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">My Assigned Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {myEvents.map(e => (
              <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.date} • {e.time}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.venue}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{e.seatsLeft}/{e.capacity} seats</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    e.status === 'upcoming' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'
                  }`}>{e.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'scanner' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">QR Code Check-in</h2>
          <div className="dashboard-section max-w-md">
            <p className="mb-4 text-sm text-muted-foreground">Enter or scan a QR code to check in an attendee</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                placeholder="e.g., CAMPUS-E1-U8-2024"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button onClick={handleScan} className="panel-accent-btn text-sm">Check In</button>
            </div>
            {scanResult && (
              <div className={`mt-4 rounded-lg p-4 text-sm ${scanResult.startsWith('✅') ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {scanResult}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendees' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Attendee List</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">QR Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Checked In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myRegistrations.map(r => (
                  <tr key={r.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{r.userName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.eventTitle}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{r.qrCode}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.checkedIn ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {r.checkedIn ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Update Event Status</h2>
          {myEvents.map(e => (
            <div key={e.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
              <div>
                <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.date}</p>
              </div>
              <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" defaultValue={e.status}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrganizerHelperPanel;
