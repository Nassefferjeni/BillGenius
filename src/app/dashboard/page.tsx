import { auth } from "@clerk/nextjs/server";
import DashboardPage from "@/app/dashboard/DashboardPage";

export default async function Dashboard() {
  const authResult = await auth();
  const { userId, orgId } = authResult;

  return <DashboardPage userId={userId} orgId={orgId} />;
}
