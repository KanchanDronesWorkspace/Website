"use client"

import type React from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    projectDetails: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-20 md:py-32 relative bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">Get Started Today</h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance">
            Ready to transform your project with professional aerial mapping?
            <br />
            Contact us for a consultation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block font-mono text-sm mb-2 text-foreground/80">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="bg-background/50 border-border"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-mono text-sm mb-2 text-foreground/80">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-background/50 border-border"
            />
          </div>

          <div>
            <label htmlFor="company" className="block font-mono text-sm mb-2 text-foreground/80">
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="bg-background/50 border-border"
            />
          </div>

          <div>
            <label htmlFor="projectDetails" className="block font-mono text-sm mb-2 text-foreground/80">
              Project Details
            </label>
            <Textarea
              id="projectDetails"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
              placeholder="Tell us about your project requirements..."
              rows={6}
              required
              className="bg-background/50 border-border resize-none"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  )
}
