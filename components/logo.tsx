"use client"

import Image from "next/image"

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="Crypto Dust Cleaner Logo"
        width={size}
        height={size}
        className="drop-shadow-[0_0_10px_rgba(20,241,149,0.3)]"
      />
    </div>
  )
}
