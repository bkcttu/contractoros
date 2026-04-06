import React, { useState } from 'react'
import {
  QrCode,
  Download,
  Copy,
  ExternalLink,
  Calendar,
  CreditCard,
  Globe,
  Phone,
  Shield,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function QRPlaceholder({ size = 200, color = '#1B2A4A' }: { size?: number; color?: string }) {
  const gridSize = 21
  const cellSize = size / gridSize
  const cells: boolean[][] = []
  for (let r = 0; r < gridSize; r++) {
    cells[r] = []
    for (let c = 0; c < gridSize; c++) {
      const isCorner = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)
      const isCornerBorder = isCorner && (r === 0 || r === 6 || c === 0 || c === 6 ||
        (r > 13 && (r === 14 || r === 20)) || (c > 13 && (c === 14 || c === 20)))
      const isCornerInner = isCorner && r >= 2 && r <= 4 && c >= 2 && c <= 4
      const isData = !isCorner && Math.random() > 0.5
      cells[r][c] = isCornerBorder || isCornerInner || isData
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells.map((row, r) => row.map((filled, c) =>
        filled ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill={color} /> : null
      ))}
    </svg>
  )
}

const qrCards = [
  {
    icon: Calendar,
    title: 'Booking Page',
    description: 'QR to your scheduling page',
    url: 'contractoros.com/book/demo',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    qrColor: '#2563EB',
  },
  {
    icon: Globe,
    title: 'Website',
    description: 'QR to your mini-website',
    url: 'contractoros.com/site/demo',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    qrColor: '#16A34A',
  },
  {
    icon: CreditCard,
    title: 'Payment Link',
    description: 'QR to pay an invoice',
    url: 'contractoros.com/pay/inv-1042',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    qrColor: '#059669',
  },
  {
    icon: Phone,
    title: 'Phone / Click-to-Call',
    description: 'QR that dials your number',
    url: 'tel:+1-555-867-5309',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    qrColor: '#EA580C',
  },
  {
    icon: Shield,
    title: 'Warranty Lookup',
    description: 'QR to warranty verification',
    url: 'contractoros.com/warranty/demo',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    qrColor: '#9333EA',
  },
  {
    icon: FileText,
    title: 'Latest Proposal',
    description: 'QR to your most recent proposal',
    url: 'contractoros.com/p/abc123',
    color: 'text-navy',
    bgColor: 'bg-navy/5',
    qrColor: '#1B2A4A',
  },
]

const printTemplates = [
  {
    title: 'Business Card',
    description: 'Professional card with your QR code, logo, and contact info',
    preview: 'business-card',
  },
  {
    title: 'Door Hanger',
    description: 'Leave-behind door hanger with booking QR and seasonal promo',
    preview: 'door-hanger',
  },
  {
    title: 'Yard Sign',
    description: '18x24 yard sign with large QR code and your branding',
    preview: 'yard-sign',
  },
]

export function QRCodes() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (url: string, index: number) => {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-navy/10">
            <QrCode className="h-6 w-6 text-navy" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">
            QR Codes & Marketing
          </h1>
        </div>
        <p className="text-gray-500 ml-14">
          Generate QR codes for your business cards, trucks, yard signs, and more
        </p>
      </div>

      {/* QR Code Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCards.map((card, index) => (
          <Card key={card.title} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', card.bgColor)}>
                  <card.icon className={cn('h-5 w-5', card.color)} />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </div>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Code Preview */}
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <QRPlaceholder size={160} color={card.qrColor} />
              </div>

              {/* URL Preview */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <ExternalLink className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 truncate">{card.url}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleCopy(card.url, index)}
                >
                  <Copy className="h-4 w-4" />
                  {copiedIndex === index ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Print Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-navy">Print Templates</h2>
        <p className="text-gray-500">Download ready-to-print templates with your QR codes embedded</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {printTemplates.map((template) => (
            <Card key={template.title} className="card-hover overflow-hidden">
              {/* Mockup Preview */}
              <div className={cn(
                'h-48 flex items-center justify-center relative',
                template.preview === 'business-card' && 'bg-gradient-to-br from-navy to-navy/80',
                template.preview === 'door-hanger' && 'bg-gradient-to-br from-accent to-accent/80',
                template.preview === 'yard-sign' && 'bg-gradient-to-br from-emerald-600 to-emerald-500',
              )}>
                {template.preview === 'business-card' && (
                  <div className="bg-white rounded-lg shadow-lg p-4 w-56 h-32 flex items-center">
                    <div className="flex-1">
                      <p className="text-navy font-bold text-sm">Demo Contractor</p>
                      <p className="text-gray-400 text-[10px]">Licensed & Insured</p>
                      <p className="text-gray-500 text-[10px] mt-2">555-867-5309</p>
                      <p className="text-gray-500 text-[10px]">demo@email.com</p>
                    </div>
                    <div className="ml-2">
                      <QRPlaceholder size={60} color="#1B2A4A" />
                    </div>
                  </div>
                )}
                {template.preview === 'door-hanger' && (
                  <div className="bg-white rounded-lg shadow-lg w-28 h-40 flex flex-col items-center p-3">
                    <div className="w-8 h-8 rounded-full border-4 border-gray-300 mb-2" />
                    <p className="text-navy font-bold text-[8px] text-center mb-1">WE STOPPED BY!</p>
                    <p className="text-gray-400 text-[6px] text-center mb-2">Scan to book your free estimate</p>
                    <QRPlaceholder size={50} color="#1B2A4A" />
                  </div>
                )}
                {template.preview === 'yard-sign' && (
                  <div className="bg-white rounded-lg shadow-lg w-48 h-32 flex flex-col items-center justify-center p-3">
                    <p className="text-navy font-bold text-sm mb-1">DEMO CONTRACTOR</p>
                    <p className="text-accent text-[10px] font-medium mb-2">Licensed & Insured</p>
                    <div className="flex items-center gap-3">
                      <QRPlaceholder size={45} color="#1B2A4A" />
                      <div>
                        <p className="text-gray-500 text-[8px]">Scan for a</p>
                        <p className="text-navy font-bold text-[10px]">FREE ESTIMATE</p>
                        <p className="text-gray-400 text-[8px]">555-867-5309</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-heading font-bold text-navy mb-1">{template.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
