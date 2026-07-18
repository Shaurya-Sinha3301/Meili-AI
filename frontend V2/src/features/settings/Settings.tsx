import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import { Button } from '../../components/ui/Button';

type Tab = 'general' | 'notifications' | 'ai' | 'team' | 'billing';

const TABS: { id: Tab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'ai', label: 'AI Preferences' },
  { id: 'team', label: 'Team' },
  { id: 'billing', label: 'Billing' },
];

const TEAM = [
  { name: 'James Davidson', email: 'james@agency.com', role: 'Owner', status: 'active' },
  { name: 'Elena Marchetti', email: 'elena@agency.com', role: 'Agent', status: 'active' },
  { name: 'Tom Wright', email: 'tom@agency.com', role: 'Agent', status: 'active' },
  { name: 'Marc Renaud', email: 'marc@agency.com', role: 'Viewer', status: 'invited' },
];

function GeneralTab() {
  const { data: profile, isLoading } = useSettings();
  const { mutate: updateProfile, isPending } = useUpdateSettings();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (profile?.full_name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(profile.full_name);
    }
  }, [profile]);

  if (isLoading) return <div className="p-4">Loading profile...</div>;

  const handleSave = () => {
    updateProfile({ full_name: fullName });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <Card padding="md">
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full h-9 px-3 rounded text-sm focus:outline-none"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Email address</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full h-9 px-3 rounded text-sm focus:outline-none opacity-50"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Role</label>
            <input
              type="text"
              value={profile?.role || ''}
              disabled
              className="w-full h-9 px-3 rounded text-sm focus:outline-none opacity-50"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Timezone</label>
            <select
              className="w-full h-9 px-3 rounded text-sm focus:outline-none"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
              defaultValue="Europe/London"
            >
              <option value="Europe/London">Europe/London (GMT+1)</option>
              <option value="Europe/Paris">Europe/Paris (GMT+2)</option>
              <option value="America/New_York">America/New_York (GMT-4)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Button variant="primary" size="md" onClick={handleSave} disabled={isPending || fullName === profile?.full_name}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    optimization_complete: true,
    approval_required: true,
    feedback_received: false,
    budget_alert: true,
    weekly_summary: true,
    email: true,
    inapp: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(p => ({ ...p, [key]: !p[key] }));

  const events = [
    { key: 'optimization_complete' as const, label: 'Optimization completed', description: 'When an AI optimization job finishes' },
    { key: 'approval_required' as const, label: 'Approval required', description: 'When a change needs your review' },
    { key: 'feedback_received' as const, label: 'Feedback received', description: 'When a customer submits feedback' },
    { key: 'budget_alert' as const, label: 'Budget alerts', description: 'When spending exceeds 80% of budget' },
    { key: 'weekly_summary' as const, label: 'Weekly summary', description: 'Weekly optimization performance digest' },
  ];

  return (
    <div className="space-y-4 max-w-lg">
      <Card padding="none">
        {events.map((e, i) => (
          <div
            key={e.key}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < events.length - 1 ? '1px solid var(--border)' : undefined }}
          >
            <div>
              <p className="text-xs font-medium">{e.label}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{e.description}</p>
            </div>
            <button
              onClick={() => toggle(e.key)}
              className="w-9 h-5 rounded-full relative transition-colors duration-200"
              style={{ backgroundColor: settings[e.key] ? 'var(--primary)' : 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: '#fff',
                  left: settings[e.key] ? 'calc(100% - 18px)' : '2px',
                }}
              />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AIPrefsTab() {
  const [prefs, setPrefs] = useState({
    autoApprove: false,
    confidenceThreshold: 95,
    goal: 'balanced',
  });

  return (
    <div className="space-y-6 max-w-lg">
      <Card padding="md">
        <CardHeader><CardTitle>Automation</CardTitle></CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Auto-approve high-confidence changes</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Automatically apply changes above the confidence threshold without manual review
              </p>
            </div>
            <button
              onClick={() => setPrefs(p => ({ ...p, autoApprove: !p.autoApprove }))}
              className="w-9 h-5 rounded-full relative transition-colors duration-200 ml-4 shrink-0"
              style={{ backgroundColor: prefs.autoApprove ? 'var(--primary)' : 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                style={{ backgroundColor: '#fff', left: prefs.autoApprove ? 'calc(100% - 18px)' : '2px' }}
              />
            </button>
          </div>

          {prefs.autoApprove && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium">Confidence threshold</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{prefs.confidenceThreshold}%</span>
              </div>
              <input
                type="range" min={70} max={99} value={prefs.confidenceThreshold}
                onChange={e => setPrefs(p => ({ ...p, confidenceThreshold: Number(e.target.value) }))}
                className="w-full" style={{ accentColor: 'var(--primary)' }}
              />
              <div className="flex justify-between text-[11px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
                <span>70% (permissive)</span><span>99% (strict)</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card padding="md">
        <CardHeader><CardTitle>Optimization goal</CardTitle></CardHeader>
        <div className="space-y-2">
          {[
            { id: 'cost', label: 'Minimize cost', desc: 'Prioritize budget savings above all else' },
            { id: 'comfort', label: 'Maximize comfort', desc: 'Prefer premium options and generous timings' },
            { id: 'balanced', label: 'Balanced (recommended)', desc: 'Weighted optimization across cost, comfort, and schedule' },
            { id: 'sustainability', label: 'Sustainability', desc: 'Prefer low-carbon transport and eco-certified hotels' },
          ].map(g => (
            <label
              key={g.id}
              className="flex items-start gap-3 p-3 rounded cursor-pointer transition-colors duration-150"
              style={{
                border: `1px solid ${prefs.goal === g.id ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: prefs.goal === g.id ? 'color-mix(in srgb, var(--primary) 5%, var(--card))' : 'var(--card)',
              }}
            >
              <input
                type="radio" name="goal" value={g.id} checked={prefs.goal === g.id}
                onChange={() => setPrefs(p => ({ ...p, goal: g.id }))}
                style={{ accentColor: 'var(--primary)', marginTop: 1 }}
              />
              <div>
                <p className="text-xs font-medium">{g.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{g.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="primary" size="md">Save AI preferences</Button>
        </div>
      </Card>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{TEAM.length} members</p>
        <Button variant="primary" size="sm">Invite member</Button>
      </div>
      <Card padding="none">
        {TEAM.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3"
            style={{ borderBottom: i < TEAM.length - 1 ? '1px solid var(--border)' : undefined }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ backgroundColor: `hsl(${i * 80} 30% 60%)`, color: '#fff' }}
            >
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{m.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{m.email}</p>
            </div>
            <span
              className="text-[11px] px-2 py-0.5 rounded"
              style={{
                backgroundColor: m.status === 'invited' ? 'color-mix(in srgb, var(--warning) 12%, transparent)' : 'var(--muted)',
                color: m.status === 'invited' ? 'var(--warning)' : 'var(--muted-foreground)',
              }}
            >
              {m.status === 'invited' ? 'Invited' : m.role}
            </span>
            <Button variant="ghost" size="sm">···</Button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-4 max-w-lg">
      <Card padding="md">
        <CardHeader><CardTitle>Current plan</CardTitle></CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>Agency Pro</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Up to 10 agents · Unlimited trips · Priority optimization</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>€249</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>per month</p>
          </div>
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--muted-foreground)' }}>Next billing date</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>August 1, 2024</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="sm">Change plan</Button>
          <Button variant="ghost" size="sm">View invoices</Button>
        </div>
      </Card>
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const content = {
    general: <GeneralTab />,
    notifications: <NotificationsTab />,
    ai: <AIPrefsTab />,
    team: <TeamTab />,
    billing: <BillingTab />,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
      </div>

      <div className="flex gap-8">
        {/* Tab nav */}
        <nav className="w-40 shrink-0 space-y-0.5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full text-left text-xs px-3 py-2 rounded transition-colors duration-150 font-medium"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--muted)' : 'transparent',
                color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">{content[activeTab]}</div>
      </div>
    </div>
  );
}
