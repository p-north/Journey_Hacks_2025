"use client"

import { useState } from "react"
import { Upload, FileText } from "lucide-react"

export function PdfUpload({ id }: { id: string }) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setIsUploading(true)
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsUploading(false)
    }
  }

  return (
    <div className="relative">
      <input type="file" id={id} accept=".pdf" onChange={handleFileChange} className="hidden" disabled={isUploading} />
      <label
        htmlFor={id}
        className={`flex items-center justify-center w-full h-32 px-4 transition bg-neutral-200 dark:bg-neutral-700 border-2 border-purple-400 dark:border-purple-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-500 focus:outline-none ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="flex items-center space-x-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          ) : fileName ? (
            <FileText className="w-6 h-6 text-purple-500 dark:text-purple-400" />
          ) : (
            <Upload className="w-6 h-6 text-purple-500 dark:text-purple-400" />
          )}
          <span className="font-medium text-neutral-600 dark:text-neutral-300">
            {isUploading ? "Uploading..." : fileName ? fileName : "Drop your brain dump (PDF) here or click to upload"}
          </span>
        </span>
      </label>
    </div>
  )
}

