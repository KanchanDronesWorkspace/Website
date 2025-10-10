"use client"

import type React from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    projectDetails: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const loadingToastId = toast.loading("Sending your message...", {
      description: "Please wait while we process your request.",
    })

    try {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.projectDetails.trim()) {
        throw new Error("Please fill in all required fields")
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      await axios.post(process.env.NEXT_PUBLIC_FORMSPREE_URL!, {
        name: formData.fullName,
        email: formData.email,
        company: formData.company,
        message: formData.projectDetails,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })

      toast.dismiss(loadingToastId)
      toast.success("Message sent successfully!", {
        description: "Thank you for contacting us. We'll get back to you soon.",
        duration: 5000,
      })

      setFormData({
        fullName: "",
        email: "",
        company: "",
        projectDetails: "",
      })

    } catch (error) {
      toast.dismiss(loadingToastId)

      if (axios.isAxiosError(error)) {
        let errorMessage = "Failed to send message"

        if (error.response) {
          const status = error.response.status
          const data = error.response.data

          switch (status) {
            case 400:
              errorMessage = "Invalid form data. Please check your inputs."
              break
            case 429:
              errorMessage = "Too many requests. Please try again later."
              break
            case 500:
              errorMessage = "Server error. Please try again later."
              break
            default:
              errorMessage = `Error ${status}: ${data?.message || data?.error || "Unknown server error"}`
          }
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection and try again."
        } else {
          errorMessage = error.message || "An unexpected error occurred"
        }

        toast.error("Failed to send message", {
          description: errorMessage,
          duration: 6000,
        })
      } else if (error instanceof Error) {
        toast.error("Failed to send message", {
          description: error.message,
          duration: 6000,
        })
      } else {
        toast.error("An unexpected error occurred", {
          description: "Please try again or contact us directly if the problem persists.",
          duration: 6000,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  )
}
