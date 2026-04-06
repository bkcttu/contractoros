import React, { useState, useEffect, useRef } from 'react'
import {
  Star,
  MessageSquare,
  Send,
  ThumbsUp,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
    </div>
  )
}

const demoReviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    date: '2 days ago',
    rating: 5,
    text: 'Excellent HVAC work, very professional. They showed up on time, explained everything clearly, and left the workspace spotless. Highly recommend!',
    responded: true,
    response: 'Thank you so much, Sarah! We take pride in our professionalism and cleanliness. It was a pleasure working with you!',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    date: '5 days ago',
    rating: 5,
    text: 'Best plumber in town, fair prices. Fixed our water heater in under two hours and even gave us tips on maintenance. Will definitely call again.',
    responded: true,
    response: 'Thanks James! Glad we could get your water heater running smoothly. Don\'t hesitate to reach out anytime!',
  },
  {
    id: 3,
    name: 'Karen Phillips',
    date: '1 week ago',
    rating: 4,
    text: 'Good work but took longer than expected. The end result was great though, and the crew was friendly and respectful of our property.',
    responded: false,
    response: '',
  },
  {
    id: 4,
    name: 'David Chen',
    date: '2 weeks ago',
    rating: 5,
    text: 'Amazing roof job, cleaned up everything. You\'d never know they were here. The new shingles look fantastic and they finished ahead of schedule.',
    responded: true,
    response: 'Thank you David! Our team takes extra care to leave every job site clean. Enjoy your new roof!',
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    date: '3 weeks ago',
    rating: 3,
    text: 'Work was okay but communication could be better. Had to call multiple times for updates. The final result was decent but I expected more for the price.',
    responded: false,
    response: '',
  },
]

const aiResponses: Record<number, string> = {
  3: 'Thank you for your feedback, Karen! We appreciate your patience and are glad you\'re happy with the end result. We\'re always working to improve our estimated timelines and will take your feedback to heart. We\'d love the chance to exceed your expectations next time!',
  5: 'Thank you for your honest feedback, Lisa. We sincerely apologize for the communication gaps. We\'ve since implemented a new system to send automatic progress updates. We\'d love the opportunity to make it right — please reach out to us directly and we\'ll ensure a better experience.',
}

const funnelData = [
  { label: 'Reviews requested', value: 52, width: '100%', color: 'bg-navy' },
  { label: 'Reviews received', value: 47, percent: '90%', width: '90%', color: 'bg-blue-600' },
  { label: '5-star reviews', value: 41, percent: '87%', width: '79%', color: 'bg-amber-500' },
  { label: 'Negative intercepted', value: 3, percent: '', width: '6%', color: 'bg-red-500' },
]

export function Reviews() {
  const [autoRequest, setAutoRequest] = useState(true)
  const [delayHours, setDelayHours] = useState(24)
  const [reviews, setReviews] = useState(demoReviews)
  const [draftingId, setDraftingId] = useState<number | null>(null)
  const [draftTexts, setDraftTexts] = useState<Record<number, string>>({})
  const [typingId, setTypingId] = useState<number | null>(null)
  const typingRef = useRef<number | null>(null)

  // Simulate AI typing effect
  useEffect(() => {
    if (typingId === null) return
    const fullText = aiResponses[typingId] || 'Thank you for your review! We truly appreciate your feedback and look forward to serving you again.'
    let i = 0
    setDraftTexts((prev) => ({ ...prev, [typingId]: '' }))

    const interval = setInterval(() => {
      i++
      setDraftTexts((prev) => ({ ...prev, [typingId]: fullText.slice(0, i) }))
      if (i >= fullText.length) {
        clearInterval(interval)
        setTypingId(null)
      }
    }, 15)

    typingRef.current = interval as unknown as number
    return () => clearInterval(interval)
  }, [typingId])

  const handleAIDraft = (reviewId: number) => {
    setDraftingId(reviewId)
    setTypingId(reviewId)
  }

  const handlePostResponse = (reviewId: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, responded: true, response: draftTexts[reviewId] || r.response }
          : r
      )
    )
    setDraftingId(null)
    setDraftTexts((prev) => {
      const next = { ...prev }
      delete next[reviewId]
      return next
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-50">
            <Star className="h-6 w-6 text-amber-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">
            Reputation Manager
          </h1>
        </div>
        <p className="text-gray-500 ml-14">
          Monitor, request, and respond to reviews on autopilot
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-navy mb-1">4.8</p>
            <StarRating rating={5} size="sm" />
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
            <p className="text-3xl font-bold text-navy">47</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3.5 w-3.5" /> +12 this quarter
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">This Month</p>
            <p className="text-3xl font-bold text-navy">6</p>
            <p className="text-sm text-gray-400 mt-1">new reviews</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">Response Rate</p>
            <p className="text-3xl font-bold text-navy">92%</p>
            <p className="text-sm text-green-600 mt-1">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Request Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-accent" />
            Review Request Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-request toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy">Auto-request reviews after job completion</p>
              <p className="text-sm text-gray-500">Automatically send review requests when a job is marked complete</p>
            </div>
            <button
              onClick={() => setAutoRequest(!autoRequest)}
              className={cn(
                'relative w-12 h-6 rounded-full transition-colors',
                autoRequest ? 'bg-accent' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  autoRequest ? 'translate-x-6' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          {/* Delay setting */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">Send review request</p>
            <select
              value={delayHours}
              onChange={(e) => setDelayHours(Number(e.target.value))}
              className="border rounded-lg px-3 py-1.5 text-sm text-navy"
            >
              <option value={2}>2</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={72}>72</option>
            </select>
            <p className="text-sm text-gray-600">hours after job complete</p>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-400 uppercase font-medium mb-2">Preview: Review Request SMS</p>
            <div className="bg-white rounded-lg p-3 border max-w-sm">
              <p className="text-sm text-gray-700">
                Hi {'{{client_name}}'}! Thanks for choosing Demo Contractor. We'd love your feedback!
                Leave us a review here: <span className="text-accent underline">contractoros.com/review/demo</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-400" />
          Recent Reviews
        </h2>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <StarRating rating={review.rating} />
                      <Badge
                        variant={review.responded ? 'default' : 'destructive'}
                        className={cn(
                          review.responded
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                        )}
                      >
                        {review.responded ? (
                          <><Check className="h-3 w-3 mr-1" /> Responded</>
                        ) : (
                          <><AlertTriangle className="h-3 w-3 mr-1" /> Needs Response</>
                        )}
                      </Badge>
                    </div>
                    <p className="font-medium text-navy">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">"{review.text}"</p>

                {/* Existing response */}
                {review.responded && review.response && draftingId !== review.id && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-green-600 font-medium mb-1">Your Response:</p>
                    <p className="text-sm text-gray-700">{review.response}</p>
                  </div>
                )}

                {/* AI Draft area */}
                {draftingId === review.id && (
                  <div className="space-y-3 mt-3">
                    <Textarea
                      value={draftTexts[review.id] || ''}
                      onChange={(e) =>
                        setDraftTexts((prev) => ({ ...prev, [review.id]: e.target.value }))
                      }
                      placeholder="AI is drafting a response..."
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="gap-2 bg-accent hover:bg-accent/90"
                        onClick={() => handlePostResponse(review.id)}
                        disabled={!draftTexts[review.id]}
                      >
                        <Send className="h-4 w-4" />
                        Post Response
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDraftingId(null)
                          setDraftTexts((prev) => {
                            const next = { ...prev }
                            delete next[review.id]
                            return next
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {!review.responded && draftingId !== review.id && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleAIDraft(review.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      AI Draft Response
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Review Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Review Funnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {funnelData.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-semibold text-navy">
                  {item.value}
                  {item.percent && (
                    <span className="text-gray-400 font-normal ml-1">({item.percent})</span>
                  )}
                </span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={cn('h-full rounded-lg flex items-center px-3 transition-all', item.color)}
                  style={{ width: item.width }}
                >
                  <span className="text-white text-xs font-medium">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
