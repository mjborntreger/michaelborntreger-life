'use client'

import { useState } from 'react'

import Section from '../ui/Section'
import { Input } from '@/components/components/ui/input'
import { Button } from '@/components/components/ui/button'
import { Card } from '@/components/components/ui/card'
import { Label } from '@/components/components/ui/label'
import {
  TypographyH1,
  TypographyH2,
  TypographyLead,
  TypographyMuted,
} from '@/components/components/ui/typography'

const formulaSteps = [
  'x = your current score',
  'y = the score below yours',
  '2y + 1 - x = wager',
]

export default function Page() {
  const [currentScore, setCurrentScore] = useState('')
  const [scoreBelowYours, setScoreBelowYours] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const idealWager = (values: { currentScore: number; scoreBelowYours: number }) =>
    values.scoreBelowYours * 2 + 1 - values.currentScore

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const wager = idealWager({
      currentScore: Number(currentScore),
      scoreBelowYours: Number(scoreBelowYours),
    })
    setResult(Number.isFinite(wager) ? wager : null)
  }

  return (
    <Section className="space-y-10">
      <div className="space-y-4">
        <TypographyH1>
          The Jodi Quotient
          <sup className="ml-1 text-base align-super">TM</sup>
        </TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">
          Quickly calculate the ideal Trivia wager. Thanks, Jodi.
        </TypographyLead>
        <Card className="w-full max-w-md p-5">
          <TypographyH2 className="text-lg">Formula</TypographyH2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {formulaSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="grid max-w-md gap-6">
        <div className="grid gap-2">
          <Label htmlFor="currentScore">Enter your current score</Label>
          <Input
            id="currentScore"
            type="number"
            value={currentScore}
            onChange={(event) => setCurrentScore(event.target.value)}
            className="max-w-[160px]"
            inputMode="numeric"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="scoreBelow">Enter the score just below yours</Label>
          <Input
            id="scoreBelow"
            type="number"
            value={scoreBelowYours}
            onChange={(event) => setScoreBelowYours(event.target.value)}
            className="max-w-[160px]"
            inputMode="numeric"
          />
        </div>

        <div>
          <Button type="submit" size="sm">
            Calculate Ideal Wager
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <TypographyH2 className="text-2xl">The Ideal Wager</TypographyH2>
        {result !== null ? (
          <TypographyLead className="text-3xl font-semibold text-foreground">
            {result}
          </TypographyLead>
        ) : (
          <TypographyMuted>Fill in both scores to see the recommended wager.</TypographyMuted>
        )}
      </div>
    </Section>
  )
}
