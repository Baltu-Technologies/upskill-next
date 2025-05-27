'use client';

import DashboardContent from '../components/DashboardContent';

export default function DashboardPage() {
  // Use the extracted dashboard content without layout wrapper
  // since the layout is now handled by the (dashboard) layout
  return <DashboardContent />;
} 