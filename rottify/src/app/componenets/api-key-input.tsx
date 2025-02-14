"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key } from "lucide-react"

interface ApiKeyInputProps {
  onValidation: (isValid: boolean) => void
}

export function ApiKeyInput({ onValidation }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("")

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value
    setApiKey(newApiKey)
    // Simple validation: API key must be at least 8 characters long
    onValidation(newApiKey.length >= 8)
  }

  return (
    <div className="mb-6">
      <Label htmlFor="api-key" className="text-lg font-medium mb-2 block text-purple-600 dark:text-purple-400">
        Unlock Your Brain Power
      </Label>
      <div className="relative">
        <Input
          id="api-key"
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-purple-500 focus:border-purple-500 pl-10"
        />
        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </div>
    </div>
  )
}

