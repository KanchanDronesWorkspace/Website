"use client";

import type React from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { GL } from "@/components/gl";

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    projectDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToastId = toast.loading("Sending your message...", {
      description: "Please wait while we process your request.",
    });

    try {
      if (
        !formData.fullName.trim() ||
        !formData.email.trim() ||
        !formData.projectDetails.trim()
      ) {
        throw new Error("Please fill in all required fields");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      await axios.post(
        process.env.NEXT_PUBLIC_FORMSPREE_URL!,
        {
          name: formData.fullName,
          email: formData.email,
          company: formData.company,
          message: formData.projectDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast.dismiss(loadingToastId);
      toast.success("Message sent successfully!", {
        description: "Thank you for contacting us. We'll get back to you soon.",
        duration: 5000,
      });

      setFormData({
        fullName: "",
        email: "",
        company: "",
        projectDetails: "",
      });
    } catch (error) {
      toast.dismiss(loadingToastId);

      if (axios.isAxiosError(error)) {
        let errorMessage = "Failed to send message";

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          switch (status) {
            case 400:
              errorMessage = "Invalid form data. Please check your inputs.";
              break;
            case 429:
              errorMessage = "Too many requests. Please try again later.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = `Error ${status}: ${
                data?.message || data?.error || "Unknown server error"
              }`;
          }
        } else if (error.request) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message || "An unexpected error occurred";
        }

        toast.error("Failed to send message", {
          description: errorMessage,
          duration: 6000,
        });
      } else if (error instanceof Error) {
        toast.error("Failed to send message", {
          description: error.message,
          duration: 6000,
        });
      } else {
        toast.error("An unexpected error occurred", {
          description:
            "Please try again or contact us directly if the problem persists.",
          duration: 6000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 relative bg-gradient-to-b from-muted/20 to-background"
    >
      {/* <GL hovering={hovering} /> */}

      <div className="container max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
            Contact Us
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance">
            Ready to transform your project with professional aerial mapping?
            <br />
            Contact us for a consultation.
          </p>

          <div className="mt-8 flex flex-col items-center">
            <p className="font-mono text-xs text-foreground uppercase tracking-wider mb-3">
              Or reach us directly
            </p>
            <a
              href="mailto:info@kanchandrones.com"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/40 hover:bg-primary/15 transition-all duration-300"
            >
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="font-mono text-sm sm:text-base text-primary group-hover:text-primary/80 transition-colors">
                info@kanchandrones.com
              </span>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block font-mono text-sm mb-2 text-foreground/80"
            >
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="bg-background/50 border-border focus:outline-none focus:ring-2 focus:ring-primary h-14 font-mono text-sm placeholder:text-foreground/40 placeholder:font-mono placeholder:text-sm"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-mono text-sm mb-2 text-foreground/80"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-background/50 border-border focus:outline-none focus:ring-2 focus:ring-primary h-14 font-mono text-sm placeholder:text-foreground/40 placeholder:font-mono placeholder:text-sm"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block font-mono text-sm mb-2 text-foreground/80"
            >
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="bg-background/50 border-border focus:outline-none focus:ring-2 focus:ring-primary h-14 font-mono text-sm placeholder:text-foreground/40 placeholder:font-mono placeholder:text-sm"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label
              htmlFor="projectDetails"
              className="block font-mono text-sm mb-2 text-foreground/80"
            >
              Project Requirements
            </label>
            <Textarea
              id="projectDetails"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
              placeholder="Tell us about your project requirements..."
              rows={12}
              required
              className="bg-background/50 border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm placeholder:text-foreground/40 placeholder:font-mono placeholder:text-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
