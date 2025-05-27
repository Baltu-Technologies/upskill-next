import PersistentLayout from '../components/PersistentLayout';

export default function ProfileLayout({
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