import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PdfUpload } from "@/components/pdf-upload"

export function LeftPanel() {
  return (
    <div className="w-full md:w-1/2 space-y-6 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
      {/* <div>
        <Label htmlFor="pdf-upload" className="text-lg font-medium mb-2 block text-purple-600 dark:text-purple-400">
          Upload Your Brain Fuel (PDF)
        </Label>
        <PdfUpload id="pdf-upload" />
      </div> */}
      <div>
        <Label htmlFor="text-input" className="text-lg font-medium mb-2 block text-pink-600 dark:text-pink-400">
          Inject Your Thoughts
        </Label>
        <Textarea
          id="text-input"
          placeholder="Pour your brain juice here..."
          className="bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-purple-500 focus:border-purple-500 h-40"
        />
      </div>
    </div>
  )
}

