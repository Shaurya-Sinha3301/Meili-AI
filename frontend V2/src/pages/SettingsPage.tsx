import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Settings } from '../features/settings/Settings';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs crumbs={[{ label: 'Settings' }]} />
      </div>
      <Settings />
    </>
  );
}
