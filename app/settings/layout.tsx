import PersistentLayout from '../components/PersistentLayout';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistentLayout>
      {children}
    </PersistentLayout>
  );
} 