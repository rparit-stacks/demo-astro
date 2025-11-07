"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Send, Paperclip, MoreVertical, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const initialMessages = [
  {
    id: 1,
    sender: "astrologer",
    text: "Namaste! I'm Dr. Rajesh Sharma. How can I help you today?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "user",
    text: "Hello! I wanted to ask about my career prospects.",
    time: "10:31 AM",
  },
  {
    id: 3,
    sender: "astrologer",
    text: "Of course! I'd be happy to help. Can you please share your date of birth, time, and place?",
    time: "10:31 AM",
  },
]

export default function ChatConsultationPage() {
  const router = useRouter()
  const params = useParams()
  const [messages, setMessages] = useState(initialMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [duration, setDuration] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSend = () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setInputMessage("")

    // Simulate astrologer response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: "astrologer",
        text: "Thank you for sharing. Let me analyze your birth chart...",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="border-b bg-card/95 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/indian-astrologer-male.jpg" />
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">Dr. Rajesh Sharma</h2>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
              <Clock className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">{formatDuration(duration)}</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground shadow-sm"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`mt-1 text-xs ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card/95 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="rounded-full">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
