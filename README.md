
# Rottify: AI-Powered Text-to-Video Generator

Rottify turns text into viral-ready, high-energy microlearning videos using AI. Automatically create engaging content with AI voiceovers, captions, and meme-like visuals.

## 🚀 Features
- **Text-to-Video**: Converts text into ~40-second, TikTok-style videos.
- **AI Voiceovers**: Gen-Z-style narrations with custom voice presets.
- **Video Synthesis**: Dynamic captions and effects using ZapCapAI + FFmpeg.
- **Optimized Performance**: Edge-cached for 3x faster processing.

## 🛠️ Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind
- **Backend**: Supabase
- **AI Models**: Perplexity Sonar, ElevenLabs 
- **Video Processing**: FFmpeg, ZapCapAI
- **Containerization**: Docker

## ⚙️ How It Works
1. **Text Processing**: Perplexity Sonar analyzes and rewrites text into viral-friendly scripts.
2. **Voiceover**: ElevenLabs generates energetic, AI-powered voiceovers.
3. **Video Creation**: FFmpeg syncs visuals, ZapCap AI adds captions and visual effects for TikTok-style videos.

## 🏗️ Installation

### Prerequisites
- Docker
- Node.js
- Supabase

### Steps
1. Clone the repo:
   ```bash
   git clone https://github.com/your-repository/rottify.git
   cd rottify
   ```
2. Set up Docker:
   ```bash
   docker-compose up --build
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## 🤖 Challenges
- **AI Syncing**: Fine-tuned voice-visual synchronization with FFmpeg.
- **Performance**: Moved processes to edge functions for faster performance.
- **Engagement**: Experimented with TikTok video styles for higher interaction.

## 🎉 Contributing
Feel free to fork and submit pull requests to improve the app.
