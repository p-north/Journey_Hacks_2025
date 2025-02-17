import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BarLoader from "react-spinners/BarLoader";

export function LeftPanel() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);

  // Step 1: Generate Script from Text
  const handleGenerateScript = async () => {
    if (!text.trim()) {
      console.error("Text is empty, cannot generate script");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      const data = await response.json();
      if (response.ok) {
        // After generating the script, proceed to Step 2 to generate the audio
        handleGenerateAudio(data.script); // Pass the script from response for audio generation
      } else {
        console.error("Error generating script:", data.error);
      }
    } catch (error) {
      console.error("Error generating script:", error);
    }
  };

  // Step 2: Generate Audio from Script
  const handleGenerateAudio = async (script: string) => {
    if (!script.trim()) {
      console.error("Script is empty, cannot generate audio");
      return;
    }

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: script }), // Pass script to generate audio
      });

      const data = await response.json();
      if (response.ok) {
        setAudioUrl(data.audioUrl); // Set the audio URL after generation
        // Once audio is ready, proceed to Step 3
        handleMergeVideo(audioUrl); // Automatically call to merge with video
      } else {
        console.error("Error generating audio:", data.error);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  // Step 3: Merge Audio with Video
  const handleMergeVideo = async (audioUrl: string) => {
    if (!audioUrl.trim()) {
      console.error("Audio URL is empty, cannot merge video");
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
        // setVideoUrl(data.outputPath);  // Set the final video URL after merging audio with video
        // Once video is ready, proceed to Step 4
        handleAddCaptions(data.outputPath); // Automatically call to add captions
      } else {
        console.error("Error merging video:", data.error);
      }
    } catch (error) {
      console.error("Error merging video:", error);
    }
  };

  // Step 4: Add Captions to Video
  const handleAddCaptions = async (videoUrl: string) => {
    try {
      const response = await fetch("/api/add-captions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setVideoUrl(data.videoUrl); // Set the video URL after adding captions
      } else {
        console.error("Error adding captions:", data.error);
      }
    } catch (error) {
      console.error("Error adding captions:", error);
    } finally {
      setIsProcessing(false); // End processing once all steps are completed
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) {
      console.error("No video URL available for download");
      return;
    }

    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "captioned_video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full md:w-1/2 space-y-6 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
      {isProcessing ? (
        <div className="p-6 ml-4">
          <p>Processing...</p>
          <BarLoader color={"#8E24AA"} loading={isProcessing} className="scale-150"/>
        </div>
      ) : (
        <>
          <div>
            <Label
              htmlFor="text-input"
              className="text-lg font-medium mb-2 block text-pink-600 dark:text-pink-400"
            >
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
          <div>
            <button
              onClick={handleGenerateScript}
              className="bg-purple-600 text-white px-4 py-2 rounded-md"
              disabled={isProcessing}
            >
              Generate Video
            </button>
          </div>
        </>
      )}
      {videoUrl && (
        <div>
          <video controls src={videoUrl} />
          <button
            onClick={handleDownloadVideo}
            className="bg-green-600 text-white px-4 py-2 mt-4 rounded-md"
          >
            Download Captioned Video
          </button>
        </div>
      )}
    </div>
  );
}
