import PersistentLayout from '../components/PersistentLayout';

export default function StudyHubLayout({
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