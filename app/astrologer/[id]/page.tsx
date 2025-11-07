"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Star, Phone, MessageCircle, Share2, Heart, Award, Clock, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// All astrologers data
const allAstrologersData: Record<number, any> = {
  1: {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "Vedic Astrology",
    experience: "15 years",
    rating: 4.9,
    totalReviews: 2340,
    price: 25,
    image: "/indian-astrologer-male.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Sanskrit"],
    consultations: 5000,
    about: "Dr. Rajesh Sharma is a renowned Vedic astrologer with over 15 years of experience. He specializes in career guidance, relationship counseling, and financial predictions. His accurate predictions have helped thousands of people find clarity in their lives.",
    expertise: ["Career Guidance", "Love & Relationships", "Financial Planning", "Health Predictions"],
    achievements: ["Gold Medalist in Astrology", "Featured in Times of India", "5000+ Happy Clients"],
    reviews: [
      { id: 1, name: "Rahul Kumar", rating: 5, comment: "Amazing experience! Dr. Sharma's predictions were spot on. Highly recommended.", date: "2 days ago" },
      { id: 2, name: "Priya Singh", rating: 5, comment: "Very helpful and accurate. Got clarity on my career path. Thank you!", date: "1 week ago" },
      { id: 3, name: "Amit Patel", rating: 4, comment: "Good consultation. He explained everything in detail and was very patient.", date: "2 weeks ago" },
    ],
  },
  2: {
    id: 2,
    name: "Priya Mehta",
    specialty: "Tarot Reading",
    experience: "10 years",
    rating: 4.8,
    totalReviews: 1890,
    price: 20,
    image: "/indian-astrologer-female.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Gujarati"],
    consultations: 3500,
    about: "Priya Mehta is an expert Tarot reader with 10 years of experience. She provides insightful readings about love, career, and life decisions. Her compassionate approach helps clients navigate through life's challenges.",
    expertise: ["Tarot Reading", "Love & Relationships", "Career Guidance", "Life Decisions"],
    achievements: ["Certified Tarot Master", "1000+ Successful Readings", "Featured in Astrology Today"],
    reviews: [
      { id: 1, name: "Sneha Patel", rating: 5, comment: "Priya's readings are incredibly accurate! She helped me make important life decisions.", date: "3 days ago" },
      { id: 2, name: "Ravi Desai", rating: 5, comment: "Best tarot reader I've consulted. Very detailed and helpful.", date: "1 week ago" },
      { id: 3, name: "Meera Shah", rating: 4, comment: "Great experience. The reading was insightful and gave me clarity.", date: "2 weeks ago" },
    ],
  },
  3: {
    id: 3,
    name: "Amit Patel",
    specialty: "Numerology",
    experience: "12 years",
    rating: 4.7,
    totalReviews: 1560,
    price: 22,
    image: "/indian-astrologer-male-2.jpg",
    isOnline: false,
    languages: ["Hindi", "English"],
    consultations: 2800,
    about: "Amit Patel is a skilled Numerologist with 12 years of expertise. He uses numerology to provide guidance on name changes, business decisions, and personal growth. His predictions have helped many achieve success.",
    expertise: ["Numerology", "Name Analysis", "Business Numerology", "Personal Growth"],
    achievements: ["Certified Numerologist", "Featured in Numerology Magazine", "2800+ Consultations"],
    reviews: [
      { id: 1, name: "Karan Singh", rating: 4, comment: "Amit's numerology analysis was very detailed and helpful for my business.", date: "4 days ago" },
      { id: 2, name: "Anjali Verma", rating: 5, comment: "Great numerologist! Helped me understand my life path better.", date: "1 week ago" },
      { id: 3, name: "Vikram Mehta", rating: 4, comment: "Good consultation. The name analysis was insightful.", date: "2 weeks ago" },
    ],
  },
  4: {
    id: 4,
    name: "Sunita Verma",
    specialty: "KP Astrology",
    experience: "18 years",
    rating: 4.9,
    totalReviews: 3120,
    price: 30,
    image: "/indian-astrologer-female-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Marathi"],
    consultations: 6200,
    about: "Sunita Verma is a renowned KP Astrologer with 18 years of experience. She specializes in precise predictions using KP system and has helped thousands with accurate timing of events and remedies.",
    expertise: ["KP Astrology", "Event Timing", "Remedial Measures", "Marriage Compatibility"],
    achievements: ["KP Astrology Expert", "6200+ Consultations", "Award Winner in Astrology"],
    reviews: [
      { id: 1, name: "Rajesh Kumar", rating: 5, comment: "Sunita's KP predictions are incredibly accurate! Highly recommended.", date: "2 days ago" },
      { id: 2, name: "Pooja Sharma", rating: 5, comment: "Best astrologer for marriage compatibility. Very detailed analysis.", date: "1 week ago" },
      { id: 3, name: "Anil Gupta", rating: 4, comment: "Great consultation. The timing predictions were spot on.", date: "2 weeks ago" },
    ],
  },
  5: {
    id: 5,
    name: "Dr. Vikram Singh",
    specialty: "Palmistry",
    experience: "20 years",
    rating: 4.8,
    totalReviews: 4200,
    price: 28,
    image: "/indian-astrologer-male.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Punjabi"],
    consultations: 8500,
    about: "Dr. Vikram Singh is an expert Palmist with 20 years of experience. He reads palm lines to provide insights about personality, career, health, and relationships. His readings are known for their accuracy and depth.",
    expertise: ["Palmistry", "Hand Analysis", "Personality Reading", "Health Predictions"],
    achievements: ["Master Palmist", "8500+ Consultations", "Featured in Multiple Publications"],
    reviews: [
      { id: 1, name: "Manish Tiwari", rating: 5, comment: "Dr. Vikram's palm reading was incredibly detailed and accurate!", date: "1 day ago" },
      { id: 2, name: "Kavita Reddy", rating: 5, comment: "Amazing palmist! The personality analysis was spot on.", date: "5 days ago" },
      { id: 3, name: "Rohit Malhotra", rating: 4, comment: "Good consultation. Very professional and insightful.", date: "1 week ago" },
    ],
  },
  6: {
    id: 6,
    name: "Kavita Desai",
    specialty: "Vastu Shastra",
    experience: "14 years",
    rating: 4.6,
    totalReviews: 2100,
    price: 24,
    image: "/indian-astrologer-female.jpg",
    isOnline: false,
    languages: ["Hindi", "English", "Gujarati"],
    consultations: 3800,
    about: "Kavita Desai is a Vastu Shastra expert with 14 years of experience. She helps clients create harmonious living and working spaces through Vastu principles. Her consultations have transformed many homes and businesses.",
    expertise: ["Vastu Shastra", "Home Consultation", "Office Vastu", "Remedial Measures"],
    achievements: ["Vastu Expert", "3800+ Consultations", "Certified Vastu Consultant"],
    reviews: [
      { id: 1, name: "Neha Patel", rating: 5, comment: "Kavita's Vastu consultation improved our home's energy significantly!", date: "3 days ago" },
      { id: 2, name: "Arjun Shah", rating: 4, comment: "Great Vastu expert. The office consultation was very helpful.", date: "1 week ago" },
      { id: 3, name: "Divya Mehta", rating: 5, comment: "Best Vastu consultant! Highly recommended for home consultation.", date: "2 weeks ago" },
    ],
  },
  7: {
    id: 7,
    name: "Ramesh Kumar",
    specialty: "Gemstone Consultation",
    experience: "16 years",
    rating: 4.7,
    totalReviews: 2900,
    price: 26,
    image: "/indian-astrologer-male-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English"],
    consultations: 5100,
    about: "Ramesh Kumar is a Gemstone Consultant with 16 years of expertise. He recommends appropriate gemstones based on birth charts to enhance positive energies and mitigate negative influences. His recommendations have helped many achieve success.",
    expertise: ["Gemstone Consultation", "Birth Chart Analysis", "Gemstone Selection", "Remedial Measures"],
    achievements: ["Gemstone Expert", "5100+ Consultations", "Certified Gemologist"],
    reviews: [
      { id: 1, name: "Suresh Agarwal", rating: 5, comment: "Ramesh's gemstone recommendation changed my life! Very effective.", date: "2 days ago" },
      { id: 2, name: "Priyanka Singh", rating: 4, comment: "Good consultation. The gemstone selection was perfect for me.", date: "1 week ago" },
      { id: 3, name: "Amit Joshi", rating: 5, comment: "Expert gemstone consultant! Highly recommended.", date: "2 weeks ago" },
    ],
  },
  8: {
    id: 8,
    name: "Meera Joshi",
    specialty: "Birth Chart Analysis",
    experience: "13 years",
    rating: 4.9,
    totalReviews: 3600,
    price: 27,
    image: "/indian-astrologer-female-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Marathi"],
    consultations: 5900,
    about: "Meera Joshi specializes in detailed Birth Chart Analysis with 13 years of experience. She provides comprehensive insights about personality, career, relationships, and life events based on precise birth chart calculations.",
    expertise: ["Birth Chart Analysis", "Dasha Analysis", "Planetary Positions", "Life Predictions"],
    achievements: ["Birth Chart Expert", "5900+ Consultations", "Featured Astrologer"],
    reviews: [
      { id: 1, name: "Sanjay Verma", rating: 5, comment: "Meera's birth chart analysis was incredibly detailed and accurate!", date: "1 day ago" },
      { id: 2, name: "Radhika Patel", rating: 5, comment: "Best birth chart reading I've ever had. Very insightful.", date: "4 days ago" },
      { id: 3, name: "Nikhil Shah", rating: 4, comment: "Great consultation. The dasha analysis was very helpful.", date: "1 week ago" },
    ],
  },
  9: {
    id: 9,
    name: "Anil Gupta",
    specialty: "Remedial Astrology",
    experience: "11 years",
    rating: 4.5,
    totalReviews: 1800,
    price: 21,
    image: "/indian-astrologer-male.jpg",
    isOnline: false,
    languages: ["Hindi", "English"],
    consultations: 3200,
    about: "Anil Gupta is a Remedial Astrologer with 11 years of experience. He provides effective remedies and solutions for various life problems through mantras, yantras, and other astrological remedies.",
    expertise: ["Remedial Astrology", "Mantra Chanting", "Yantra Installation", "Gemstone Remedies"],
    achievements: ["Remedial Expert", "3200+ Consultations", "Certified Astrologer"],
    reviews: [
      { id: 1, name: "Deepak Mehta", rating: 4, comment: "Anil's remedies have been very effective for me. Good consultation.", date: "3 days ago" },
      { id: 2, name: "Shilpa Reddy", rating: 5, comment: "Great remedial astrologer! The solutions provided really worked.", date: "1 week ago" },
      { id: 3, name: "Rahul Tiwari", rating: 4, comment: "Helpful consultation. The remedies were easy to follow.", date: "2 weeks ago" },
    ],
  },
  10: {
    id: 10,
    name: "Sneha Reddy",
    specialty: "Muhurat Selection",
    experience: "17 years",
    rating: 4.8,
    totalReviews: 4100,
    price: 29,
    image: "/indian-astrologer-female.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Telugu"],
    consultations: 7200,
    about: "Sneha Reddy is an expert in Muhurat Selection with 17 years of experience. She helps select auspicious dates and times for important events like weddings, business launches, house warming, and other ceremonies.",
    expertise: ["Muhurat Selection", "Auspicious Dates", "Marriage Dates", "Business Muhurat"],
    achievements: ["Muhurat Expert", "7200+ Consultations", "Award-Winning Astrologer"],
    reviews: [
      { id: 1, name: "Vikram Rao", rating: 5, comment: "Sneha selected the perfect muhurat for our wedding. Everything went smoothly!", date: "2 days ago" },
      { id: 2, name: "Lakshmi Nair", rating: 5, comment: "Best muhurat consultant! Very accurate and helpful.", date: "1 week ago" },
      { id: 3, name: "Ravi Kumar", rating: 4, comment: "Great consultation. The business muhurat was perfect for our launch.", date: "2 weeks ago" },
    ],
  },
}

export default function AstrologerProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [showRazorpayDialog, setShowRazorpayDialog] = useState(false)

  // Get astrologer ID from params
  const astrologerId = params?.id ? parseInt(params.id as string) : 1
  
  // Get astrologer data based on ID, fallback to first if not found
  const astrologerData = allAstrologersData[astrologerId] || allAstrologersData[1]

  const handleBookNow = () => {
    toast.error("Razorpay not enabled cannot book now", {
      description: "Payment gateway is not configured. Please try again later.",
      duration: 4000,
    })
  }

  const handleChatOrCall = () => {
    setShowRazorpayDialog(true)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Profile Header */}
        <GlassmorphicCard className="mb-4 p-6">
          <div className="flex gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={astrologerData.image || "/placeholder.svg"} alt={astrologerData.name} />
                <AvatarFallback>{astrologerData.name[0]}</AvatarFallback>
              </Avatar>
              {astrologerData.isOnline && (
                <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{astrologerData.name}</h1>
              <p className="text-sm text-muted-foreground">{astrologerData.specialty}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{astrologerData.rating}</span>
                  <span className="text-xs text-muted-foreground">({astrologerData.totalReviews})</span>
                </div>
                <Badge variant="secondary">{astrologerData.experience}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {astrologerData.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">{astrologerData.consultations}+</p>
              <p className="text-xs text-muted-foreground">Consultations</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">{astrologerData.experience}</p>
              <p className="text-xs text-muted-foreground">Experience</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">Top Rated</p>
              <p className="text-xs text-muted-foreground">Astrologer</p>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <GlassmorphicCard className="p-4">
              <h3 className="mb-2 font-semibold text-foreground">About</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{astrologerData.about}</p>
            </GlassmorphicCard>

            <GlassmorphicCard className="p-4">
              <h3 className="mb-3 font-semibold text-foreground">Achievements</h3>
              <div className="space-y-2">
                {astrologerData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="expertise" className="space-y-3">
            {astrologerData.expertise.map((skill, index) => (
              <GlassmorphicCard key={index} className="p-4">
                <p className="font-medium text-foreground">{skill}</p>
              </GlassmorphicCard>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-3">
            {astrologerData.reviews.map((review) => (
              <GlassmorphicCard key={review.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{review.name}</h4>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="mb-2 flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </GlassmorphicCard>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Consultation Fee</p>
              <p className="text-lg font-bold text-primary">₹{astrologerData.price}/min</p>
            </div>
            <Button 
              size="lg" 
              className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold"
              onClick={handleBookNow}
            >
              <Calendar className="h-5 w-5" />
              Book Now
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1 gap-2 bg-transparent"
              onClick={handleChatOrCall}
            >
              <MessageCircle className="h-5 w-5" />
              Chat
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
              onClick={handleChatOrCall}
            >
              <Phone className="h-5 w-5" />
              Call
            </Button>
          </div>
        </div>
      </div>

      {/* Razorpay Alert Dialog */}
      <AlertDialog open={showRazorpayDialog} onOpenChange={setShowRazorpayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Gateway Not Integrated</AlertDialogTitle>
            <AlertDialogDescription>
              Razorpay is not integrated. Please contact your developer to enable payment gateway.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowRazorpayDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
