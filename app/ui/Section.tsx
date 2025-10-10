import * as React from "react"

import { cn } from "@/components/lib/utils"

type SectionProps = React.HTMLAttributes<HTMLElement>

export default function Section({ className, ...props }: SectionProps) {
  return (
    <section className={cn("space-y-6", className)} {...props} />
  )
}
