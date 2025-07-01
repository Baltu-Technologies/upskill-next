import PersistentLayout from '../components/PersistentLayout';

export default function EmployerAccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PersistentLayout>
      {children}
    </PersistentLayout>
  );
} 