import PersistentLayout from '../components/PersistentLayout';

export default function CourseCreatorLayout({
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