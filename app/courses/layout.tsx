import PersistentLayout from '../components/PersistentLayout';

interface CoursesLayoutProps {
  children: React.ReactNode;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  return (
    <PersistentLayout>
      {children}
    </PersistentLayout>
  );
} 