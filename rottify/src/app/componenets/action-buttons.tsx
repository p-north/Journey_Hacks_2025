"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Zap } from "lucide-react"

export function ActionButtons() {
  const [isUploaded, setIsUploaded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleUpload = () => {
    setIsUploaded(true)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="flex justify-center space-x-4 mt-8">
      <Button
        size="lg"
        onClick={handleUpload}
        disabled={isUploaded}
        className={`${
          isUploaded ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
        } text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploaded ? "Brain Fuel Loaded" : "Upload Brain Fuel"}
      </Button>
      <Button
        size="lg"
        onClick={handleGenerate}
        disabled={!isUploaded || isGenerating}
        className={`${
          isGenerating ? "bg-yellow-600 hover:bg-yellow-700" : "bg-pink-600 hover:bg-pink-700"
        } text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
      >
        <Zap className="mr-2 h-4 w-4" />
        {isGenerating ? "Melting Brains..." : "Generate Brain Rot"}
      </Button>
    </div>
  )
}

