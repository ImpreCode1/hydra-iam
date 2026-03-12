import { HubLayout } from "@/components/layout/HubLayout"
import { PlatformGrid } from "@/components/hub/PlatformGrid"

export default function DashboardPage() {
  return (
    <HubLayout>

      <div className="max-w-7xl mx-auto">

        <PlatformGrid />

      </div>

    </HubLayout>
  )
}