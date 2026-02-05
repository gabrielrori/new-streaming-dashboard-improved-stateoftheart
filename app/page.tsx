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
    <div className="space-y-12">
      {/* Quick Navigation Pills */}
      <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:scale-105"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="space-y-20">
        {sections.map((section, index) => {
          const Component = section.component;
          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32"
            >
              {index > 0 && (
                <div className="mb-12">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-border/50"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-6 py-2 text-sm font-medium text-muted-foreground rounded-full border-2 border-border/50 shadow-sm">
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

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-110 flex items-center justify-center group z-50"
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
    </div>
  );
}
