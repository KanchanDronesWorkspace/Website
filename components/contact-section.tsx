"use client";

import type React from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    projectDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hovering, setHovering] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

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
        },
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative">
      <div className="container max-w-4xl relative z-10" ref={sectionRef}>
        <div className="mb-12 md:mb-16">
          <span
            className="editorial-number block mb-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            05 — CONTACT
          </span>
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial uppercase tracking-tight leading-[0.9] mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            GET IN
            <br />
            <em className="italic text-primary">TOUCH</em>
          </h2>
          <p
            className="font-mono text-xs sm:text-sm text-white/40 max-w-md uppercase tracking-widest leading-relaxed"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            Ready to transform your project with professional aerial mapping?
          </p>
        </div>

        <div
          className="h-px bg-white/10 mb-12"
          style={{
            transform: isVisible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        />

        <div
          className="mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-3">
            Direct Email
          </span>
          <a
            href="mailto:info@kanchandrones.com"
            className="group inline-flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 border border-white/10 hover:border-primary/40 bg-black transition-all duration-300"
          >
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="font-mono text-xs sm:text-sm text-primary group-hover:text-primary/80 transition-colors break-all sm:break-normal">
              info@kanchandrones.com
            </span>
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}
        >
          <div>
            <label
              htmlFor="fullName"
              className="block font-mono text-[10px] mb-3 text-white/30 uppercase tracking-widest"
            >
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="bg-black border-white/10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary h-14 font-mono text-sm text-white placeholder:text-white/20 placeholder:font-mono placeholder:text-sm rounded-none transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[10px] mb-3 text-white/30 uppercase tracking-widest"
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
              className="bg-black border-white/10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary h-14 font-mono text-sm text-white placeholder:text-white/20 placeholder:font-mono placeholder:text-sm rounded-none transition-all duration-300"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block font-mono text-[10px] mb-3 text-white/30 uppercase tracking-widest"
            >
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="bg-black border-white/10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary h-14 font-mono text-sm text-white placeholder:text-white/20 placeholder:font-mono placeholder:text-sm rounded-none transition-all duration-300"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label
              htmlFor="projectDetails"
              className="block font-mono text-[10px] mb-3 text-white/30 uppercase tracking-widest"
            >
              Project Requirements
            </label>
            <Textarea
              id="projectDetails"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
              placeholder="Tell us about your project requirements..."
              rows={10}
              required
              className="bg-black border-white/10 resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono text-sm text-white placeholder:text-white/20 placeholder:font-mono placeholder:text-sm rounded-none transition-all duration-300"
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
