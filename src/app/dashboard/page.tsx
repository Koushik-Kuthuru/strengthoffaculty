
import { DashboardLayout } from "@/components/dashboard-layout";
import { InstitutionDashboard } from "@/components/institution-dashboard";
import { TeacherDashboard } from "@/components/teacher-dashboard";

export default function DashboardPage() {
  // For now, we will default to the Institution Dashboard to show the new UI.
  // In the future, we will add logic to determine the user's role.
  const userRole = 'institution'; // or 'teacher'

  return (
    <DashboardLayout>
      {userRole === 'teacher' ? <TeacherDashboard /> : <InstitutionDashboard />}
    </DashboardLayout>
  );
}
