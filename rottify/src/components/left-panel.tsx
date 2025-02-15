import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PdfUpload } from "@/components/pdf-upload";

export function LeftPanel() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleTextChange = (e: any) => setText(e.target.value);

  const handleGenerateAudio = async () => {
    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setAudioUrl(data.audioUrl);
      } else {
        console.error("Error generating audio:", data.error);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  const handleMergeVideo = async () => {
    if (!audioUrl) {
      console.error("Audio URL is missing");
      return;
    }

    try {
      const response = await fetch("/api/merge-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setVideoUrl(data.outputPath);
      } else {
        console.error("Error merging video:", data.error);
      }
    } catch (error) {
      console.error("Error merging video:", error);
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) {
      console.error("No video URL available for download");
      return;
    }

    // Create a temporary download link and trigger download
    const link = document.createElement("a");
    link.href = `/public/videos/${videoUrl}`;  // Modify based on your actual video file path
    link.download = "merged_video.mp4";  // Filename for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full md:w-1/2 space-y-6 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
      <div>
        <Label htmlFor="text-input" className="text-lg font-medium mb-2 block text-pink-600 dark:text-pink-400">
          Inject Your Thoughts
        </Label>
        <Textarea
          id="text-input"
          placeholder="Pour your brain juice here..."
          value={text}
          onChange={handleTextChange}
          className="bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-purple-500 focus:border-purple-500 h-40"
        />
      </div>
      <button
        onClick={handleGenerateAudio}
        className="bg-purple-600 text-white px-4 py-2 rounded-md"
      >
        Generate Audio
      </button>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
          <button
            onClick={handleMergeVideo}
            className="bg-pink-600 text-white px-4 py-2 mt-4 rounded-md"
          >
            Merge with Video
          </button>
        </div>
      )}
      {videoUrl && (
        <div>
          <button
            onClick={handleDownloadVideo}
            className="bg-green-600 text-white px-4 py-2 mt-4 rounded-md"
          >
            Download Video
          </button>
        </div>
      )}
    </div>
  );
}
