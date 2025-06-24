import PersistentLayout from '../components/PersistentLayout';

export default function SkillsAssessmentLayout({
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