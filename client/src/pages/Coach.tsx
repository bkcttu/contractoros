import React, { useState, useEffect, useRef } from 'react'
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Lightbulb,
  BarChart3,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ---------------------------------------------------------------------------
// Suggested prompts
// ---------------------------------------------------------------------------
const suggestedPrompts = [
  {
    text: 'How was my business last month?',
    icon: TrendingUp,
    gradient: 'from-emerald-50 to-teal-50',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    text: 'What should I focus on this quarter?',
    icon: Target,
    gradient: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    text: 'Am I pricing my jobs right?',
    icon: DollarSign,
    gradient: 'from-amber-50 to-yellow-50',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    text: 'Draft a spring campaign for past clients',
    icon: Calendar,
    gradient: 'from-rose-50 to-pink-50',
    iconBg: 'bg-rose-100 text-rose-600',
  },
  {
    text: 'How can I get more 5-star reviews?',
    icon: Sparkles,
    gradient: 'from-purple-50 to-violet-50',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    text: 'What\'s my most profitable job type?',
    icon: BarChart3,
    gradient: 'from-cyan-50 to-sky-50',
    iconBg: 'bg-cyan-100 text-cyan-600',
  },
]

// ---------------------------------------------------------------------------
// Demo AI responses
// ---------------------------------------------------------------------------
const demoResponses: Record<string, string> = {
  'How was my business last month?': `Here's your **March 2026 Business Summary**:

**Revenue:** $47,850 — up 12% from February and 23% from March last year.

**Proposals:**
- 14 proposals sent (avg. value $4,120)
- 9 accepted — **64% win rate** (above your 6-month avg. of 58%)
- 2 still pending response

**Top Clients:**
1. Riverside HOA — $12,400 (repipe of 3 units)
2. Martinez Residence — $8,200 (whole-house repipe)
3. Oakwood Commercial — $6,750 (water heater + line replacement)

**Key Insights:**
- Your average job size increased 18% vs. last year — your upselling on water filtration add-ons is paying off
- Response time averaged 2.1 hours — faster than the industry benchmark of 4 hours
- You had 3 repeat customers, generating 28% of total revenue

**Action Items:**
- Follow up on the 2 pending proposals — both are over 5 days old
- March was your strongest month in 6 months — consider what drove the uptick so you can replicate it in April`,

  'What should I focus on this quarter?': `Based on your data, here are your **top 3 priorities for Q2 2026**:

**1. Increase Average Job Value to $5,000+**
Your current average is $4,120. You're leaving money on the table by not consistently offering add-ons. Jobs where you included water filtration or fixture upgrades averaged **$5,800** — 41% higher.
- *Action:* Add a "recommended upgrades" section to every proposal.

**2. Re-engage Past Clients (Target: 8 repeat jobs)**
You have 142 past clients who haven't booked in 12+ months. Last quarter, repeat clients had a **78% close rate** vs. 52% for new leads.
- *Action:* Launch a spring maintenance campaign to your dormant client list. Even converting 6% would mean 8 additional jobs.

**3. Tighten Proposal Follow-Up (Target: < 3 day avg. response)**
17% of your lost proposals had zero follow-up. Of proposals where you followed up within 48 hours, your win rate jumped to **71%**.
- *Action:* Set up automated follow-up reminders at 2, 5, and 10 days after sending.

Hitting all three could add an estimated **$18,000–$24,000** in additional revenue this quarter.`,

  'Am I pricing my jobs right?': `Let's look at your **pricing analysis**:

**Your Win Rate by Price Tier:**
- Under $3,000: 74% win rate (but lower margin — avg. 32%)
- $3,000–$6,000: 61% win rate (healthy margin — avg. 45%)
- $6,000–$10,000: 48% win rate (strong margin — avg. 51%)
- Over $10,000: 33% win rate (highest margin — avg. 54%)

**Compared to Market:**
- Your average repipe price ($4,120) is about **8% below** the local market average of $4,480
- Your water heater installs ($2,850) are **right at market rate**
- Your emergency/repair rates ($185/hr) are **12% above average** — and still closing well

**Key Findings:**
- You're likely **underpricing repipes by $300–$500** per job. A modest increase would have minimal impact on win rate but could add $3,000–$4,500/month in profit
- Your sweet spot is the $3K–$6K range — best balance of volume and margin
- Jobs over $10K have a low close rate. Consider breaking large projects into phases to improve conversion

**Recommendation:**
Raise your base repipe pricing by 7–10% on your next 10 proposals as a test. Track the win rate — if it stays above 55%, make it permanent. That alone could mean an extra **$15,000+ annually**.`,

  'Draft a spring campaign for past clients': `Here's a ready-to-send **spring campaign** for your past clients:

---

**Subject Line:** "Spring Pipe Check — Free for Our Past Clients"

**Body:**

Hi [First Name],

Spring is here, and it's the perfect time to make sure your plumbing is in top shape before summer hits.

As a valued past client of KC Pipe, we'd like to offer you a **complimentary spring plumbing inspection** — no strings attached.

**What we'll check:**
- Water pressure and flow rates
- Signs of corrosion or pipe wear
- Water heater performance
- Any potential leak risks

**Why now?** Small issues caught early can save thousands in emergency repairs later. Plus, if you need any work done, past clients get **10% off** all services through May 31.

**Book your free inspection:** [Reply to this email or call (555) 123-4567]

Thanks for trusting us with your home,
[Your Name]
KC Pipe

---

**Campaign Notes:**
- Send to your 142 dormant clients (no activity in 12+ months)
- Best send time: Tuesday or Wednesday at 9:30 AM
- Expected response rate: 5–8% (7–11 bookings)
- Follow up with a second email 7 days later to non-openers
- Estimated revenue from campaign: **$8,000–$15,000**`,

  'How can I get more 5-star reviews?': `Here's your **review strategy breakdown**:

**Current Stats:**
- 47 total Google reviews, 4.6 average rating
- Last review was 3 weeks ago — you need more recent activity
- Only 22% of completed jobs result in a review

**Why It Matters:**
Contractors with 50+ reviews and 4.7+ rating get **3x more clicks** on Google Maps. You're close — just need a system.

**5-Step Review Engine:**

1. **Ask at the "wow" moment** — Right when the customer sees the finished work and is happy, that's when you ask. Not a day later. Not a week later. Right then.

2. **Make it effortless** — Send a direct Google review link via text within 1 hour of job completion. One tap, they're writing.

3. **Use the magic phrase:** *"Would you mind sharing your experience? It really helps small businesses like ours."* — This outperforms "leave us a review" by 3x.

4. **Follow up once** — If no review in 3 days, send one friendly text: *"Hi [Name], hope you're enjoying the new [work done]! If you have 30 seconds, a quick Google review would mean the world to us: [link]"*

5. **Respond to every review** — Thank 5-star reviewers by name and mention the specific work. This signals to Google that you're active and engaged.

**Goal:** Get to **60 reviews with a 4.7+ rating** by end of Q2. At your current job volume, that means converting ~40% of jobs to reviews — very doable with this system.`,

  "What's my most profitable job type?": `Here's your **profitability breakdown by job type** (last 6 months):

**Ranked by Profit Margin:**

| Job Type | Avg. Revenue | Avg. Profit | Margin | Volume |
|---|---|---|---|---|
| Whole-house repipe | $7,200 | $3,740 | 52% | 12 jobs |
| Water heater install | $2,850 | $1,370 | 48% | 18 jobs |
| Water filtration | $1,800 | $830 | 46% | 8 jobs |
| Partial repipe | $3,600 | $1,510 | 42% | 15 jobs |
| Emergency repair | $650 | $260 | 40% | 24 jobs |
| Fixture replacement | $480 | $145 | 30% | 10 jobs |

**Key Takeaways:**

- **Whole-house repipes** are your most profitable job by far — both in margin (52%) and total profit per job ($3,740). You should be actively marketing these.
- **Water heater installs** are your volume winner — high margin AND high volume. This is your bread and butter.
- **Emergency repairs** have decent volume but the lowest total profit per job. They're good for customer acquisition but shouldn't be your focus.
- **Fixture replacements** are your least profitable — consider raising prices or bundling them with other services.

**Recommendation:**
Double down on repipes and water heater installs. If you shifted just 4 emergency-only customers into a repipe or water heater upsell per month, that's an extra **$6,000–$10,000/month** in profit.`,
}

const genericResponse = `That's a great question! Based on what I can see in your business data, here are a few thoughts:

**Quick Analysis:**
- Your business has been trending positively over the last quarter
- There are a few areas where small changes could make a meaningful difference
- I'd recommend looking at this from both a revenue and efficiency perspective

**What I'd Suggest:**
1. Review your current metrics in the Dashboard to see where you stand
2. Compare your performance month-over-month to spot trends
3. Consider how this ties into your broader quarterly goals

Want me to dig deeper into any specific aspect of your business? I can analyze your proposals, revenue trends, client retention, pricing, or marketing — just ask!`

// ---------------------------------------------------------------------------
// Markdown renderer (basic)
// ---------------------------------------------------------------------------
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Blank line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
      i++
      continue
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-3 border-gray-200" />)
      i++
      continue
    }

    // Table detection
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1]?.includes('---')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i])
        i++
      }
      const headerCells = tableLines[0].split('|').map(c => c.trim()).filter(Boolean)
      const bodyRows = tableLines.slice(2)
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th key={ci} className="text-left py-1 px-2 border-b border-gray-200 font-semibold text-gray-700">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row.split('|').map(c => c.trim()).filter(Boolean)
                return (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-gray-50/50' : ''}>
                    {cells.map((cell, ci) => (
                      <td key={ci} className="py-1 px-2 border-b border-gray-100 text-gray-600">
                        {inlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Heading
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('\n')) {
      elements.push(
        <p key={i} className="font-semibold text-gray-900 mt-2 mb-1">
          {line.slice(2, -2)}
        </p>
      )
      i++
      continue
    }

    // Bullet list
    if (line.match(/^[-*]\s/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items.push(lines[i].replace(/^[-*]\s/, ''))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-1 text-gray-700">
          {items.map((item, idx) => (
            <li key={idx}>{inlineMarkdown(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-1 text-gray-700">
          {items.map((item, idx) => (
            <li key={idx}>{inlineMarkdown(item)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-gray-700 my-0.5">
        {inlineMarkdown(line)}
      </p>
    )
    i++
  }

  return <>{elements}</>
}

function inlineMarkdown(text: string): React.ReactNode {
  // Split on bold and italic markers
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[1]) {
      parts.push(<strong key={match.index} className="font-semibold text-gray-900">{match[1]}</strong>)
    } else if (match[2]) {
      parts.push(<em key={match.index} className="italic">{match[2]}</em>)
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length === 1 ? parts[0] : <>{parts}</>
}

// ---------------------------------------------------------------------------
// Typing indicator
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
        <Bot className="w-4 h-4 text-purple-600" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Coach page
// ---------------------------------------------------------------------------
export function Coach() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return

    const userMessage: Message = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Simulate AI response
    const delay = 1000 + Math.random() * 1000
    setTimeout(() => {
      const responseText = demoResponses[text.trim()] || genericResponse
      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 font-heading">AI Business Coach</h1>
            <p className="text-sm text-gray-500">Your personal advisor that knows your business inside and out</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {!hasMessages ? (
          /* Suggested Prompts */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 font-heading mb-2">What can I help you with?</h2>
              <p className="text-gray-500 text-sm">Ask me anything about your business, or try one of these:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt) => {
                const Icon = prompt.icon
                return (
                  <Card
                    key={prompt.text}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br',
                      prompt.gradient
                    )}
                    onClick={() => sendMessage(prompt.text)}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={cn('flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center', prompt.iconBg)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm leading-snug">{prompt.text}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3 animate-fade-in',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                    message.role === 'user'
                      ? 'bg-navy text-white'
                      : 'bg-purple-100 text-purple-600'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                    message.role === 'user'
                      ? 'bg-navy text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 rounded-tl-sm shadow-sm'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose-sm">{renderMarkdown(message.content)}</div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3 sm:px-6 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your business..."
              className="min-h-[44px] max-h-[120px] resize-none rounded-xl border-gray-200 bg-gray-50 focus:bg-white py-3 text-sm"
              rows={1}
            />
            <Button
              variant="accent"
              size="icon"
              className="flex-shrink-0 h-[44px] w-[44px] rounded-xl"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">AI Coach is powered by Claude</p>
        </div>
      </div>
    </div>
  )
}
