"use client";

import { useState, useEffect } from "react";
import RealTimeOverview from "@/components/dashboard/RealTimeOverview";
import ABRMetrics from "@/components/dashboard/ABRMetrics";
import CDNPerformance from "@/components/dashboard/CDNPerformance";
import QoEMetrics from "@/components/dashboard/QoEMetrics";
import NetworkMetrics from "@/components/dashboard/NetworkMetrics";
import { CMCDBridge } from "@/components/dashboard/CMCDBridge";
import { ViewerEngagement } from "@/components/dashboard/ViewerEngagement";
import { PlayerHealth } from "@/components/dashboard/PlayerHealth";
import { DurableObjects } from "@/components/dashboard/DurableObjects";

const sections = [
  { id: "overview", label: "Real-Time Overview", component: RealTimeOverview },
  { id: "qoe", label: "QoE Metrics", component: QoEMetrics },
  { id: "abr", label: "ABR Metrics", component: ABRMetrics },
  { id: "engagement", label: "Viewer Engagement", component: ViewerEngagement },
  { id: "player", label: "Player Health", component: PlayerHealth },
  { id: "cdn", label: "CDN Performance", component: CDNPerformance },
  { id: "network", label: "Network Metrics", component: NetworkMetrics },
  { id: "cmcd", label: "CMCD/CMSD Bridge", component: CMCDBridge },
  { id: "durable", label: "Durable Objects", component: DurableObjects },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px" 
      }
    );

    // Observe all section elements
    const sectionElements = sections.map((section) =>
      document.getElementById(section.id)
    );

    sectionElements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionElements.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) =>
        document.getElementById(section.id)
      );

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-16">
      {/* Quick Navigation Pills - Premium Styling */}
      <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-8 bg-gradient-to-b from-zinc-900/95 to-zinc-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 hover:scale-105 border border-white/10"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Sections - py-16 spacing between sections */}
      <div className="space-y-16">
        {sections.map((section, index) => {
          const Component = section.component;
          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32 fade-in py-16"
            >
              {index > 0 && (
                <div className="mb-16">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm px-6 py-2 text-sm font-medium text-zinc-400 rounded-full border-2 border-white/10 shadow-lg">
                        Section {index + 1} of {sections.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <Component />
            </section>
          );
        })}
      </div>

      {/* Scroll to Top Button - Premium Style */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-110 flex items-center justify-center group z-50"
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 group-hover:animate-bounce"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* Add CSS for fade-in animation */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
