import { HubLayout } from "@/components/layout/HubLayout";
import { PlatformGrid } from "@/components/hub/PlatformGrid";
import { ExternalSitesFab } from "@/components/hub/ExternalSitesFab";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <HubLayout>
        <div className="max-w-7xl mx-auto">
          <PlatformGrid />
        </div>
        <ExternalSitesFab />
        <div className="fixed bottom-6 left-6 z-40 animate-bounce-slow">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white px-5 py-3 rounded-lg shadow-xl border border-[#3d3d3d] flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <div>
              <p className="text-sm font-medium">Desliza hacia abajo</p>
              <p className="text-xs text-gray-400">para encontrar los formularios</p>
            </div>
          </div>
        </div>
      </HubLayout>
    </AuthGuard>
  );
}
