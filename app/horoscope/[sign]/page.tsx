"use client"

import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Heart, Briefcase, DollarSign, HeartPulse, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const horoscopeData = {
  daily: {
    overview:
      "Today brings exciting opportunities in your professional life. The planetary alignment suggests that your hard work will finally be recognized. Stay focused and maintain your positive attitude.",
    love: "Your romantic life is looking bright today. Single Aries might meet someone special, while those in relationships will experience deeper connection with their partner.",
    career:
      "A great day for career advancement. Your innovative ideas will be well-received by superiors. Consider taking on new responsibilities.",
    finance:
      "Financial prospects are favorable. This is a good time to make investments or start that savings plan you've been thinking about.",
    health:
      "Energy levels are high today. Perfect time to start a new fitness routine or outdoor activity. Remember to stay hydrated.",
    luckyNumber: 7,
    luckyColor: "Orange",
    compatibility: "Leo, Sagittarius",
  },
}

export default function SignHoroscopePage() {
  const router = useRouter()
  const params = useParams()
  const sign = params.sign as string
  const signName = sign.charAt(0).toUpperCase() + sign.slice(1)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{signName} Horoscope</h1>
            <p className="text-sm text-muted-foreground">Today's Predictions</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4 py-4">
        {/* Overview Card */}
        <GlassmorphicCard gradient className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Today's Overview</h2>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="leading-relaxed text-muted-foreground">{horoscopeData.daily.overview}</p>
        </GlassmorphicCard>

        {/* Lucky Info */}
        <div className="grid grid-cols-3 gap-3">
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">Lucky Number</p>
            <p className="text-2xl font-bold text-primary">{horoscopeData.daily.luckyNumber}</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">Lucky Color</p>
            <p className="text-sm font-bold text-foreground">{horoscopeData.daily.luckyColor}</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">Rating</p>
            <p className="text-2xl font-bold text-primary">4.5</p>
          </GlassmorphicCard>
        </div>

        {/* Detailed Predictions */}
        <Tabs defaultValue="love" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="love">Love</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="finance">Money</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="love" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-50">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Love & Relationships</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={85} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">85%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.daily.love}</p>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="career" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Career & Business</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={90} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">90%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.daily.career}</p>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="finance" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Finance & Wealth</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={75} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">75%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.daily.finance}</p>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="health" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <HeartPulse className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Health & Wellness</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={80} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">80%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.daily.health}</p>
            </GlassmorphicCard>
          </TabsContent>
        </Tabs>

        {/* Compatibility */}
        <GlassmorphicCard className="p-6">
          <h3 className="mb-3 font-semibold text-foreground">Best Compatibility</h3>
          <p className="text-sm text-muted-foreground">{horoscopeData.daily.compatibility}</p>
        </GlassmorphicCard>
      </div>
    </div>
  )
}
