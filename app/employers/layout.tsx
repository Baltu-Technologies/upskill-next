import PersistentLayout from '../components/PersistentLayout';

export default function EmployersLayout({
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