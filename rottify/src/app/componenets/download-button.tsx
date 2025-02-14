import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadButtonProps {
  isEnabled: boolean
}

export function DownloadButton({ isEnabled }: DownloadButtonProps) {
  return (
    <Button
      disabled={!isEnabled}
      className={`w-full ${
        isEnabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-neutral-400 text-neutral-600 cursor-not-allowed"
      } transition-colors duration-300`}
    >
      <Download className="mr-2 h-4 w-4" />
      {isEnabled ? "Download Brain Melt" : "Waiting for Brain Juice..."}
    </Button>
  )
}

