import PersistentLayout from '../components/PersistentLayout';

export default function GuideAccessLayout({
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