"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          InvestPro
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition font-medium">
            Home
          </Link>
          <Link href="/auth/login" className="text-sm text-foreground/70 hover:text-foreground transition font-medium">
            Investor Login
          </Link>
          <Link
            href="/auth/admin-login"
            className="text-sm text-foreground/70 hover:text-foreground transition font-medium"
          >
            Admin
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-border md:hidden shadow-lg">
            <div className="flex flex-col gap-3 p-4">
              <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition font-medium">
                Home
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-foreground/70 hover:text-foreground transition font-medium"
              >
                Investor Login
              </Link>
              <Link
                href="/auth/admin-login"
                className="text-sm text-foreground/70 hover:text-foreground transition font-medium"
              >
                Admin
              </Link>
              <Link href="/auth/signup">
                <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
