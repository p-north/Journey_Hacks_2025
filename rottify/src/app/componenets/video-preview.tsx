"use client"

import { useEffect, useRef } from "react"

interface VideoPreviewProps {
  onVideoGenerated: () => void
}

export function VideoPreview({ onVideoGenerated }: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const draw = (time: number) => {
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Enhanced brain rot effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, `hsl(${(time / 50) % 360}, 100%, 50%)`)
      gradient.addColorStop(0.5, `hsl(${(time / 50 + 180) % 360}, 100%, 30%)`)
      gradient.addColorStop(1, "black")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Neuron-like connections
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 1
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.stroke()
      }

      // Pulsating circles
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.sin(time / 1000 + i) * 20 + 20,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = `hsla(${(time / 50 + i * 60) % 360}, 100%, 50%, 0.3)`
        ctx.fill()
      }

      // Animated text overlay
      ctx.font = "bold 24px Arial"
      ctx.fillStyle = `hsl(${(time / 50) % 360}, 100%, 70%)`
      ctx.fillText("Brainrot in Progress", 20, 40)

      ctx.font = "16px Arial"
      ctx.fillStyle = "white"
      ctx.fillText("Melting Minds...", 20, canvas.height - 20)

      animationFrameId = requestAnimationFrame(draw)
    }

    draw(0)

    // Simulate video generation after 5 seconds
    setTimeout(() => {
      onVideoGenerated()
    }, 5000)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [onVideoGenerated])

  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-neutral-900 rounded-lg overflow-hidden shadow-lg">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" width={640} height={360} />
    </div>
  )
}

