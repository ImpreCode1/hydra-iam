import { HubLayout } from "@/components/layout/HubLayout";
import { PlatformGrid } from "@/components/hub/PlatformGrid";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <HubLayout>
        <div className="max-w-7xl mx-auto">
          <PlatformGrid />
        </div>
      </HubLayout>
    </AuthGuard>
  );
}
