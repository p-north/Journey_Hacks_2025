"use client"

import { useState } from "react"
import { VideoPreview } from "@/components/video-preview"
import { DownloadButton } from "@/components/download-button"

export function RightPanel() {
  const [isVideoGenerated, setIsVideoGenerated] = useState(false)

  const handleVideoGenerated = () => {
    setIsVideoGenerated(true)
  }

  return (
    <div className="w-full md:w-1/2 space-y-4 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">Brain Melt Preview</h2>
      <VideoPreview onVideoGenerated={handleVideoGenerated} />
      <DownloadButton isEnabled={isVideoGenerated} />
    </div>
  )
}

