"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LeftPanel } from "@/components/left-panel"
import { RightPanel } from "@/components/right-panel"
import { ApiKeyInput } from "@/components/api-key-input"
import { ActionButtons } from "@/components/action-buttons"

export default function DashboardPage() {
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)

  const handleApiKeyValidation = (isValid: boolean) => {
    setIsApiKeyValid(isValid)
  }

  return (
    <DashboardLayout>
      <ApiKeyInput onValidation={handleApiKeyValidation} />
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <LeftPanel />
        <RightPanel />
      </div>
      <ActionButtons isEnabled={isApiKeyValid} />
    </DashboardLayout>
  )
}

