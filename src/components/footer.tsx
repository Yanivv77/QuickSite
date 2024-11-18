import React from 'react'
import { Separator } from "@/components/ui/separator"
import { Link } from './ui/link'

const footerLinks = [
  { href: '/', label: 'דף הבית' },
  { href: '/location', label: 'מיקום' },
  { href: '/returns', label: 'החזרות' },
  { href: '/app', label: 'אפליקציה' },
  { href: '/help', label: 'עזרה' },
  { href: '/settings', label: 'הגדרות' },
]

export function Footer() {
  return (
    <footer className="border-t border-border" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              {index > 0 && (
                <Separator className="h-4 w-px bg-border" orientation="vertical" />
              )}
              <Link
                href={link.href}
                className="transition-colors hover:text-foreground focus-visible:text-foreground"
              >
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </footer>
  )
}