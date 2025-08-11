
import { DashboardLayout } from "@/components/dashboard-layout";
import { TeacherDashboard } from "@/components/teacher-dashboard";

export default function DashboardPage() {
  // For now, we will default to the Teacher Dashboard.
  // In the future, we will add logic to determine the user's role.
  return (
    <DashboardLayout>
      <TeacherDashboard />
    </DashboardLayout>
  );
}
