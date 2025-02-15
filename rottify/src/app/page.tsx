"use client";

import { ChangeEvent, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LeftPanel } from "@/components/left-panel";
import { RightPanel } from "@/components/right-panel";
import { ApiKeyInput } from "@/components/api-key-input";
import { ActionButtons } from "@/components/action-buttons";

export default function DashboardPage() {
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [content, setContent] = useState("");
  const [script, setScript] = useState("");

  const handleTextContent = (e: ChangeEvent) => {
    setContent((e) => e.target.value);
  };

  const handleApiKeyValidation = (isValid: boolean) => {
    setIsApiKeyValid(isValid);
  };

  const handleScriptGeneration = async () => {
    if (!content) return;
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await response.json();
      if (data.script) {
        setScript(data.script);
      }
    } catch (error) {
      console.error("Error generating script");
    }
  };

  <button onClick={handleScriptGeneration}>Generate Script</button>;

  return (
    <DashboardLayout>
      <ApiKeyInput onValidation={handleApiKeyValidation} />
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <input type="text" onChange={(e) => handleTextContent(e)}></input>
        <LeftPanel />
        <RightPanel />
      </div>
      <ActionButtons isEnabled={isApiKeyValid} />
    </DashboardLayout>
  );
}

// "use client"; // Add this line at the top to make it a client component

// import { useState } from "react";

// export default function BrainRotInput() {
//   const [prompt, setPrompt] = useState(""); // The text input from the user
//   const [audioUrl, setAudioUrl] = useState(""); // State to store the audio URL

//   const handleGenerateSpeech = async () => {
//     try {
//       // Send the POST request to the backend API with the user input text
//       const response = await fetch("/api/voice", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: prompt }), // Send the text prompt
//       });

//       const data = await response.json(); // Parse the response data

//       // If we received the audio URL, set it in the state
//       if (data.audioUrl) {
//         setAudioUrl(data.audioUrl);
//       }
//     } catch (error) {
//       console.error("Error generating speech:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Brain Rot Video Generator</h1>
//       <textarea
//         placeholder="Enter your brain rot prompt here..."
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)} // Update prompt state
//       />
//       <button onClick={handleGenerateSpeech}>Generate Brain Rot Voice</button>

//       {/* Render audio player only if audioUrl is set */}
//       {audioUrl && (
//         <div>
//           <h2>Generated Speech:</h2>
//           <audio controls>
//             <source src={audioUrl} type="audio/mp3" />
//             Your browser does not support the audio element.
//           </audio>
//         </div>
//       )}
//     </div>
//   );
// }
