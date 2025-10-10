// components/backgrounds/SquaresBackground.tsx
'use client'

import Squares from "../components/Squares" // adjust the import path

export default function SquaresBackground({
    className,
}: { className?: string }) {
    return (
        <div className={className}>
            <Squares
                speed={0.1}
                squareSize={120}
                direction='diagonal' // up, down, left, right, diagonal
                borderColor='#cef3ff'
                hoverFillColor='#222'
            />
        </div>
    )
}
