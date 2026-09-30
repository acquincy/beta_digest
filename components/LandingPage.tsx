"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  CloudRain,
  Compass,
  Droplets,
  Moon,
  Pause,
  Play,
  RotateCw,
  Sun,
  Wind,
} from "lucide-react";
import { WeatherData } from "@/lib/types";
import { FALLBACK_WEATHER_PORT_HARCOURT } from "@/services/weather";
import { EDITORIAL_STORIES } from "@/services/briefing";

interface CityPreset {
  name: string;
  country: string;
  lat: number;
  lon: number;
  defaultTemp: number;
  condition: string;
}

const CITY_PRESETS: CityPreset[] = [
  { name: "Lagos", country: "NG", lat: 6.5244, lon: 3.3792, defaultTemp: 27, condition: "Partly cloudy" },
  { name: "Port Harcourt", country: "NG", lat: 4.8156, lon: 7.0498, defaultTemp: 28, condition: "Clear skies" },
  { name: "London", country: "UK", lat: 51.5074, lon: -0.1278, defaultTemp: 14, condition: "Light drizzle" },
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006, defaultTemp: 19, condition: "Mainly clear" },
  { name: "Nairobi", country: "KE", lat: -1.2921, lon: 36.8219, defaultTemp: 23, condition: "Scattered clouds" },
];

interface FlipCardData {
  id: string;
  edition: string;
  sendTime: string;
  title: string;
  frontSummary: string;
  readDuration: string;
  topStories: string[];
  hourlyForecast: { time: string; temp: string; rain: string }[];
  commuteAlert: string;
}

const FLIP_CARDS: FlipCardData[] = [
  {
    id: "morning",
    edition: "EDITION 01 · MORNING",
    sendTime: "06:00",
    title: "Morning Dispatch",
    frontSummary:
      "The flagship briefing waiting when your alarm sounds. Five essential global & local stories paired with your street-level morning commute window.",
    readDuration: "05 min read",
    topStories: [
      "01 · OpenAI unveils autonomous multi-agent workflow SDK",
      "02 · CBN liquidity auctions stabilize West African FX corridors",
      "03 · Grid-scale battery storage hits record quarterly deployment",
      "04 · Cross-border stablecoin rails cut merchant settlement to 0.8%",
      "05 · Webb spectroscopy detects earliest galactic carbon markers",
    ],
    hourlyForecast: [
      { time: "06:00", temp: "25°C", rain: "05%" },
      { time: "08:00", temp: "27°C", rain: "10%" },
      { time: "10:00", temp: "29°C", rain: "20%" },
    ],
    commuteAlert: "Clear dry window 06:30–09:15. Light 11 km/h coastal breeze.",
  },
  {
    id: "midday",
    edition: "EDITION 02 · MIDDAY",
    sendTime: "12:30",
    title: "Midday Pulse",
    frontSummary:
      "A crisp 90-second recalibration at noon. Shifts in afternoon precipitation, UV peak warnings, and developing market movements.",
    readDuration: "90 sec read",
    topStories: [
      "01 · European & Lagos mid-session equities hold morning gains",
      "02 · Brent crude steadies as Atlantic shipping lanes clear",
      "03 · Semiconductor foundry capacity expands for Q4 inference chips",
      "04 · Municipal transit advisory: Victoria Island & Lekki flow normal",
      "05 · Afternoon solar peak hits UV 08—shade recommended 13:00–15:00",
    ],
    hourlyForecast: [
      { time: "12:00", temp: "31°C", rain: "35%" },
      { time: "14:00", temp: "30°C", rain: "55%" },
      { time: "16:00", temp: "28°C", rain: "40%" },
    ],
    commuteAlert: "Scattered showers likely at 14:00 (55% prob). Keep an umbrella nearby.",
  },
  {
    id: "evening",
    edition: "EDITION 03 · EVENING",
    sendTime: "19:00",
    title: "Evening Ledger",
    frontSummary:
      "Close your browser tabs for good. A calm synthesis of what resolved today and your first look at tomorrow’s barometer.",
    readDuration: "03 min read",
    topStories: [
      "01 · Full synthesis: What today’s central bank policy means for Q4",
      "02 · Global markets close: Tech & clean energy lead daily volume",
      "03 · Deep read: How microgrid storage is replacing diesel backup",
      "04 · Overnight barometer: Coastal pressure steady at 1013 hPa",
      "05 · Tomorrow’s prep: Early sunrise at 06:18, dry morning commute",
    ],
    hourlyForecast: [
      { time: "19:00", temp: "26°C", rain: "15%" },
      { time: "21:00", temp: "25°C", rain: "10%" },
      { time: "23:00", temp: "24°C", rain: "05%" },
    ],
    commuteAlert: "Evening drive clear. Tomorrow 07:00 outlook: 25°C and clear skies.",
  },
];

interface ReaderQuote {
  quote: string;
  author: string;
  role: string;
  city: string;
  readTime: string;
}

const READER_QUOTES: ReaderQuote[] = [
  {
    quote:
      "I deleted three news apps and two weather widgets the week I subscribed. BetaDigest gives me the exact signal I need before my 7am standup.",
    author: "Tunde Bakare",
    role: "VP of Engineering",
    city: "Lagos",
    readTime: "06:04 AM reader",
  },
  {
    quote:
      "The ‘Why it matters’ callout under each headline reads like a briefing from a sharp chief of staff. Never breathless, never clickbait.",
    author: "Amara Nwosu",
    role: "Macro Strategy Director",
    city: "London",
    readTime: "06:15 AM reader",
  },
  {
    quote:
      "Pairing the hourly rain radar directly with the five morning stories is genius. I know how to dress and what happened overnight in four minutes flat.",
    author: "Chidi Okonkwo",
    role: "Principal Architect",
    city: "Port Harcourt",
    readTime: "05:58 AM reader",
  },
  {
    quote:
      "Most newsletters try to keep you scrolling forever. BetaDigest respects that I have a company to run and finishes cleanly at story five.",
    author: "Elena Rostova",
    role: "Founding Partner",
    city: "New York",
    readTime: "06:12 AM reader",
  },
  {
    quote:
      "Typography that feels like a classic broadsheet combined with live telemetry. It’s the calmest part of my morning routine.",
    author: "Kwame Mensah",
    role: "Product Design Lead",
    city: "Nairobi",
    readTime: "06:30 AM reader",
  },
  {
    quote:
      "The commute window advisory has saved me from three surprise downpours this month alone. Indispensable.",
    author: "Sade Adeyemi",
    role: "Energy Economist",
    city: "Lagos",
    readTime: "06:00 AM reader",
  },
];

export function LandingPage() {
  const router = useRouter();

  // Loader State (under 2.2s, skipped on repeat visits via sessionStorage)
  const [showLoader, setShowLoader] = useState(false);
  const [loaderCount, setLoaderCount] = useState(0);
  const [loaderPhase, setLoaderPhase] = useState<"counting" | "expanding" | "wiping" | "done">("counting");

  // Theme State (light paper by default per prompt, supports dark ink mode)
  const [isDark, setIsDark] = useState(false);

  // Selected City & Weather
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [weather, setWeather] = useState<WeatherData>(FALLBACK_WEATHER_PORT_HARCOURT);
  const [liveClock, setLiveClock] = useState("06:42");
  const [countdown, setCountdown] = useState("07:41:52");

  // Flip cards state for tap/keyboard accessibility
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Marquee pause control for accessibility
  const [marqueePaused, setMarqueePaused] = useState(false);

  // Final CTA email state
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaError, setCtaError] = useState("");

  // Dusk background shift before Final CTA
  const [isDuskShift, setIsDuskShift] = useState(false);

  // Refs for GSAP & ScrollTrigger
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const subtleLoginRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 1. Handle Loader (strictly < 2.2s, skipped on repeat visits or reduced motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alreadyVisited = false;
    try {
      alreadyVisited = sessionStorage.getItem("betadigest_visited") === "1";
    } catch {
      /* ignore */
    }

    if (prefersReduced || alreadyVisited) {
      setShowLoader(false);
      setLoaderPhase("done");
      return;
    }

    setShowLoader(true);
    const startTime = performance.now();
    const countDuration = 1050; // 1.05s for 0 -> 100
    const expandDuration = 380; // 0.38s for purple block scale
    const wipeDuration = 420; // 0.42s for clip-path wipe (Total = 1.85s < 2.2s)

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < countDuration) {
        const progress = Math.min(1, elapsed / countDuration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setLoaderCount(Math.round(eased * 100));
        rafId = requestAnimationFrame(tick);
      } else if (elapsed < countDuration + expandDuration) {
        setLoaderCount(100);
        setLoaderPhase("expanding");
        rafId = requestAnimationFrame(tick);
      } else if (elapsed < countDuration + expandDuration + wipeDuration) {
        setLoaderPhase("wiping");
        rafId = requestAnimationFrame(tick);
      } else {
        setLoaderPhase("done");
        setShowLoader(false);
        try {
          sessionStorage.setItem("betadigest_visited", "1");
        } catch {
          /* ignore */
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 2. Live Clock & Next 06:00 AM Dispatch Countdown (tabular-nums)
  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setLiveClock(`${hh}:${mm}`);

      // Next 06:00:00 local time
      const nextSend = new Date(now);
      nextSend.setHours(6, 0, 0, 0);
      if (now >= nextSend) {
        nextSend.setDate(nextSend.getDate() + 1);
      }
      const diffSec = Math.max(0, Math.floor((nextSend.getTime() - now.getTime()) / 1000));
      const ch = String(Math.floor(diffSec / 3600)).padStart(2, "0");
      const cm = String(Math.floor((diffSec % 3600) / 60)).padStart(2, "0");
      const cs = String(diffSec % 60).padStart(2, "0");
      setCountdown(`${ch}:${cm}:${cs}`);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Fetch Live Weather for Selected City
  useEffect(() => {
    let active = true;
    fetch(
      `/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&city=${encodeURIComponent(
        selectedCity.name
      )}`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: WeatherData) => {
        if (active && data && typeof data.temperature === "number") {
          setWeather(data);
        }
      })
      .catch(() => {
        if (active) {
          setWeather({
            ...FALLBACK_WEATHER_PORT_HARCOURT,
            city: selectedCity.name,
            temperature: selectedCity.defaultTemp,
            conditionText: selectedCity.condition,
          });
        }
      });
    return () => {
      active = false;
    };
  }, [selectedCity]);

  // 4. GSAP + ScrollTrigger + Lenis Smooth Storytelling Engine
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const lenisTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisTicker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // A. Subtle Log In top-right detail:
      // Fades out and translates up 12px after scrolling past ~80% of hero, returns only at page top
      if (subtleLoginRef.current && heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            const scrollY = window.scrollY;
            if (self.progress >= 0.8) {
              gsap.to(subtleLoginRef.current, {
                opacity: 0,
                y: -12,
                pointerEvents: "none",
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
              });
            } else if (scrollY <= 24) {
              gsap.to(subtleLoginRef.current, {
                opacity: 1,
                y: 0,
                pointerEvents: "auto",
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          },
        });
      }

      // B. Section Reveal Animations:
      // opacity 0 and translateY(24px) to rest, ease power4.out, 0.9s, staggered 0.08s
      const revealGroups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
      revealGroups.forEach((group) => {
        const items = group.querySelectorAll("[data-reveal]");
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: "power4.out",
              scrollTrigger: {
                trigger: group,
                start: "top 84%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      // C. VISUAL STORY BACKGROUND (The Persuasion Engine) — Scrubbed across scroll
      // 1. Hero 5am: horizon line and half-sun arc drawing in
      gsap.fromTo(
        ".svg-hero-draw",
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom center",
            scrub: true,
          },
        }
      );

      // 2. Chapter 1 ("You wake up to noise"): chaotic squiggles and headline fragments crowd in
      gsap.fromTo(
        ".svg-noise-path",
        { strokeDashoffset: 1000, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.34,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: "#chapter-noise",
            start: "top 80%",
            end: "center center",
            scrub: true,
          },
        }
      );

      // Dissolve noise as Chapter 2 resolves
      gsap.to(".svg-noise-group", {
        opacity: 0,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: "#chapter-clarity",
          start: "top 75%",
          end: "center center",
          scrub: true,
        },
      });

      // 3. Chapter 2 ("We cut it to five minutes"): clean isobar contour lines + full sun arc completes
      gsap.fromTo(
        ".svg-clarity-path",
        { strokeDashoffset: 1000, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.32,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: "#chapter-clarity",
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      // 4. Chapter 3 ("Weather that fits your day"): rain cloud outline draws, then dissolves into tidy hourly row
      const weatherTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#chapter-weather",
          start: "top 75%",
          end: "bottom 35%",
          scrub: true,
        },
      });

      weatherTl
        .fromTo(
          ".svg-cloud-path",
          { strokeDashoffset: 1000, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.42, duration: 0.45, ease: "none" }
        )
        .to(
          ".svg-cloud-path",
          { opacity: 0.06, duration: 0.25, ease: "none" },
          "+=0.05"
        )
        .fromTo(
          ".svg-hourly-path",
          { strokeDashoffset: 1000, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.38, duration: 0.4, stagger: 0.03, ease: "none" },
          "<"
        );

      // 5. Final, dusk: lines settle into calm horizon, background shifts from cream to cream-2 before CTA
      ScrollTrigger.create({
        trigger: "#proof",
        start: "center center",
        end: "bottom top",
        onEnter: () => setIsDuskShift(true),
        onLeaveBack: () => setIsDuskShift(false),
      });

      gsap.to(".svg-daytime-layers", {
        opacity: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: "#final-cta",
          start: "top 85%",
          end: "top 30%",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".svg-dusk-path",
        { strokeDashoffset: 1000, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: "#proof",
            start: "top 70%",
            end: "bottom 40%",
            scrub: true,
          },
        }
      );
    }, pageWrapperRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(lenisTicker);
      lenis.destroy();
    };
  }, []);

  // Theme toggle handler with transition suppression per better-ui skill
  const toggleTheme = () => {
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode("*,*::before,*::after{transition:none !important}")
    );
    document.head.appendChild(style);

    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }

    void document.body.offsetHeight;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove();
      });
    });
  };

  // Toggle Flip Card for Mobile Tap & Keyboard (Enter / Space)
  const toggleFlipCard = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFlipKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlipCard(id);
    }
  };

  // Final CTA Form Submission -> posts/navigates to /signup?email=
  const handleCtaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = ctaEmail.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setCtaError("Enter a valid email address (for example, name@domain.com).");
      const inputEl = document.getElementById("final-cta-email");
      inputEl?.focus();
      return;
    }
    setCtaError("");
    router.push(`/signup?email=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div
      ref={pageWrapperRef}
      className="relative min-h-screen transition-colors duration-700"
      style={{
        backgroundColor:
          isDuskShift && !isDark ? "var(--cream-2)" : "var(--bg-page)",
        color: "var(--text-primary)",
      }}
    >
      {/* ── Skip Link (better-accessibility) ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[#5722CB] focus:text-[#f3f2ee] focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      {/* ── LOADER (Full-screen cream, tabular 0->100, purple block center scale, clip-path wipe, <2.2s) ── */}
      {showLoader && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden pointer-events-auto"
          style={{
            backgroundColor: "var(--cream)",
            clipPath:
              loaderPhase === "wiping"
                ? "inset(0 0 100% 0)"
                : "inset(0 0 0% 0)",
            transition:
              loaderPhase === "wiping"
                ? "clip-path 0.42s cubic-bezier(0.76, 0, 0.24, 1)"
                : "none",
          }}
        >
          {/* Center Tabular Counter */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="editorial-label text-[#5d5a54] mb-3">
              BETADIGEST · MORNING PRESS
            </span>
            <div
              className="tabular-nums text-[clamp(64px,12vw,140px)] font-medium leading-none tracking-[-0.04em]"
              style={{ color: "var(--purple)" }}
            >
              {String(loaderCount).padStart(3, "0")}
            </div>
          </div>

          {/* Scaling Purple Block from Center */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{
              backgroundColor: "var(--purple)",
              transform:
                loaderPhase === "expanding" || loaderPhase === "wiping"
                  ? "scale(1)"
                  : "scale(0)",
              borderRadius:
                loaderPhase === "expanding" || loaderPhase === "wiping"
                  ? "0px"
                  : "48px",
              transition:
                "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.38s ease",
            }}
          >
            <span className="editorial-label text-[#f3f2ee] tracking-[0.14em]">
              06:00 AM DISPATCH READY
            </span>
          </div>
        </div>
      )}

      {/* ── VISUAL STORY BACKGROUND (Fixed full-viewport SVG persuasion engine) ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          fill="none"
        >
          <g className="svg-daytime-layers">
            {/* 1. HERO, 5AM: Single horizon line and half-sun arc */}
            <g id="svg-stage-1-dawn">
              <line
                x1="0"
                y1="640"
                x2="1440"
                y2="640"
                stroke="var(--purple)"
                strokeWidth="1.2"
                strokeOpacity="0.28"
              />
              <path
                className="svg-hero-draw"
                d="M 440 640 A 280 280 0 0 1 1000 640"
                stroke="var(--purple)"
                strokeWidth="1.5"
                strokeOpacity="0.45"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="0"
              />
              <path
                className="svg-hero-draw"
                d="M 520 640 A 200 200 0 0 1 920 640"
                stroke="var(--purple)"
                strokeWidth="1"
                strokeDasharray="6 8"
                strokeOpacity="0.28"
                pathLength="1000"
              />
              <line x1="240" y1="634" x2="240" y2="646" stroke="var(--purple)" strokeOpacity="0.3" />
              <line x1="720" y1="630" x2="720" y2="650" stroke="var(--purple)" strokeOpacity="0.4" />
              <line x1="1200" y1="634" x2="1200" y2="646" stroke="var(--purple)" strokeOpacity="0.3" />
            </g>

            {/* 2. CHAPTER 1 ("You wake up to noise"): Chaotic overlapping squiggles & headline fragments */}
            <g className="svg-noise-group">
              <path
                className="svg-noise-path"
                d="M 80 220 C 190 120, 240 340, 350 180 C 460 40, 520 390, 650 210 C 780 50, 860 360, 1020 190 C 1140 80, 1250 310, 1360 170"
                stroke="var(--purple)"
                strokeWidth="1.25"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <path
                className="svg-noise-path"
                d="M 140 420 Q 280 260 410 450 T 710 350 T 1010 470 T 1310 330"
                stroke="var(--purple)"
                strokeWidth="1.2"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <rect
                className="svg-noise-path"
                x="110"
                y="180"
                width="220"
                height="48"
                rx="8"
                stroke="var(--purple)"
                strokeWidth="1.1"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <rect
                className="svg-noise-path"
                x="1050"
                y="240"
                width="260"
                height="54"
                rx="8"
                stroke="var(--purple)"
                strokeWidth="1.1"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <rect
                className="svg-noise-path"
                x="480"
                y="130"
                width="190"
                height="40"
                rx="6"
                stroke="var(--purple)"
                strokeWidth="1.1"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
            </g>

            {/* 3. CHAPTER 2 ("We cut it to five minutes"): Clean isobar contour lines + full sun arc */}
            <g id="svg-stage-3-clarity">
              <path
                className="svg-clarity-path"
                d="M 0 310 C 360 250, 1080 370, 1440 310"
                stroke="var(--purple)"
                strokeWidth="1.2"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <path
                className="svg-clarity-path"
                d="M 0 390 C 360 330, 1080 450, 1440 390"
                stroke="var(--purple)"
                strokeWidth="1.2"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <path
                className="svg-clarity-path"
                d="M 0 470 C 360 410, 1080 530, 1440 470"
                stroke="var(--purple)"
                strokeWidth="1.2"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <path
                className="svg-clarity-path"
                d="M 120 640 Q 720 60 1320 640"
                stroke="var(--purple)"
                strokeWidth="1.6"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
            </g>

            {/* 4. CHAPTER 3 ("Weather that fits your day"): Rain cloud outline -> Tidy hourly row */}
            <g id="svg-stage-4-weather">
              <path
                className="svg-cloud-path"
                d="M 570 280 H 860 A 55 55 0 0 0 860 170 A 85 85 0 0 0 700 130 A 70 70 0 0 0 570 180 A 50 50 0 0 0 570 280 Z"
                stroke="var(--purple)"
                strokeWidth="1.5"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <path
                className="svg-cloud-path"
                d="M 630 300 L 610 350 M 690 300 L 670 350 M 750 300 L 730 350 M 810 300 L 790 350"
                stroke="var(--purple)"
                strokeWidth="1.3"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <path
                className="svg-hourly-path"
                d="M 180 560 L 330 545 L 480 520 L 630 495 L 780 490 L 930 510 L 1080 535 L 1230 550"
                stroke="var(--purple)"
                strokeWidth="1.5"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              <path
                className="svg-hourly-path"
                d="M 180 560 V 640 M 330 545 V 640 M 480 520 V 640 M 630 495 V 640 M 780 490 V 640 M 930 510 V 640 M 1080 535 V 640 M 1230 550 V 640"
                stroke="var(--purple)"
                strokeWidth="1"
                opacity="0"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
            </g>
          </g>

          {/* 5. FINAL, DUSK: Calm horizon lines */}
          <g id="svg-stage-5-dusk">
            <path
              className="svg-dusk-path"
              d="M 0 700 L 1440 700 M 180 718 L 1260 718 M 380 734 L 1060 734"
              stroke="var(--purple)"
              strokeWidth="1.3"
              opacity="0"
              pathLength="1000"
              strokeDasharray="1000"
              strokeDashoffset="1000"
            />
          </g>
        </svg>
      </div>

      {/* ── FLOATING GLASS PILL NAVIGATION (Centered, 16px from top) ── */}
      <header className="fixed top-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Primary"
          className="floating-glass-pill pointer-events-auto flex items-center gap-3 sm:gap-6 ps-4 pe-2 py-2"
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-medium tracking-[-0.03em] text-sm sm:text-base text-[var(--text-primary)]"
          >
            <span
              className="inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold"
              style={{ backgroundColor: "var(--purple)", color: "var(--cream)" }}
            >
              β
            </span>
            <span>BetaDigest</span>
          </Link>

          <div className="hidden sm:flex items-center gap-5 text-sm text-[var(--text-secondary)]">
            <a
              href="#how-it-works"
              className="hover:text-[var(--text-primary)] transition-colors py-1"
            >
              How it works
            </a>
            <a
              href="#sample-digest"
              className="hover:text-[var(--text-primary)] transition-colors py-1"
            >
              Sample digest
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light paper theme" : "Switch to dark ink theme"}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border-wireframe)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <Link
              href="/signup"
              className="btn-primary-purple inline-flex items-center gap-1.5 rounded-full ps-4 pe-3.5 py-2 text-xs sm:text-sm"
            >
              <span>Subscribe</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ── SUBTLE LOG IN (Top-Right Corner, outside the pill) ── */}
      <div
        ref={subtleLoginRef}
        className="fixed top-4 right-5 z-30 hidden lg:flex flex-col items-end text-right"
      >
        <Link
          href="/login"
          className="text-[12px] font-medium text-[var(--text-primary)] underline decoration-[var(--border-wireframe-hover)] underline-offset-4 hover:decoration-[#5722CB] transition-colors py-0.5"
        >
          Already reading? Log in →
        </Link>
        <p
          className="tabular-nums text-[12px] text-[var(--text-secondary)] mt-0.5"
          aria-live="off"
        >
          {selectedCity.name} · {weather.temperature}°C · {liveClock}
        </p>
      </div>

      {/* ── MAIN LANDING CONTENT ── */}
      <main id="main-content" className="relative z-10 pt-28 sm:pt-36">
        {/* =====================================================================
            SECTION 1: HERO
        ===================================================================== */}
        <section
          id="hero"
          ref={heroRef}
          data-reveal-group
          className="mx-auto max-w-[1280px] px-5 sm:px-8 pb-24 sm:pb-36"
        >
          {/* Mobile Subtle Login & Live Telemetry bar */}
          <div
            data-reveal
            className="flex lg:hidden items-center justify-between border-b border-[var(--border-wireframe)] pb-3 mb-8 text-[12px]"
          >
            <span className="tabular-nums text-[var(--text-secondary)]">
              {selectedCity.name} · {weather.temperature}°C · {liveClock}
            </span>
            <Link
              href="/login"
              className="font-medium text-[var(--text-primary)] underline underline-offset-4"
            >
              Already reading? Log in →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
            {/* Hero Left (7 cols) */}
            <div className="lg:col-span-7">
              <div data-reveal className="flex items-center gap-2.5 mb-6">
                <span className="inline-block size-2 rounded-full bg-[#5722CB]" />
                <span className="editorial-label text-[var(--text-secondary)]">
                  DAILY BRIEFING · NEWS &amp; BAROMETER · 06:00 AM
                </span>
              </div>

              <h1 data-reveal className="editorial-heading text-[var(--text-primary)]">
                The day, in five minutes.
              </h1>

              <p
                data-reveal
                className="editorial-body mt-6 sm:mt-8 max-w-[54ch]"
              >
                One calm morning edition with the five stories worth knowing,
                plain-English context on why they matter, and a hyperlocal
                weather strip built around your commute.
              </p>

              {/* Hero Actions */}
              <div
                data-reveal
                className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
              >
                <Link
                  href="/signup"
                  className="btn-primary-purple inline-flex items-center gap-2.5 rounded-full ps-7 pe-6 py-4 text-base sm:text-lg"
                >
                  <span>Subscribe — it’s free</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>

                <a
                  href="#sample-digest"
                  className="inline-flex items-center gap-1.5 py-3 px-2 text-base sm:text-lg font-medium text-[var(--text-primary)] underline decoration-[var(--border-wireframe-hover)] underline-offset-8 hover:decoration-[#5722CB] transition-colors"
                >
                  <span>See a sample</span>
                </a>
              </div>

              {/* Next Digest Send Time Live Countdown */}
              <div
                data-reveal
                className="mt-10 inline-flex flex-wrap items-center gap-3 rounded-full border border-[var(--border-wireframe)] bg-[var(--bg-panel)] px-4 py-2"
              >
                <Clock
                  className="size-3.5 shrink-0"
                  style={{ color: "var(--purple)" }}
                  aria-hidden="true"
                />
                <span className="editorial-label text-[var(--text-secondary)]">
                  NEXT EDITION DROPS IN
                </span>
                <span
                  className="tabular-nums text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: "var(--purple)",
                    backgroundColor: "var(--cream)",
                  }}
                >
                  {countdown}
                </span>
                <span className="tabular-nums text-xs text-[var(--text-secondary)]">
                  · 06:00 AM LOCAL
                </span>
              </div>
            </div>

            {/* Hero Right (5 cols): 5AM Edition Telemetry Bento Panel */}
            <div data-reveal className="lg:col-span-5">
              <div className="bento-panel p-6 sm:p-7">
                <div className="flex items-center justify-between border-b border-[var(--border-wireframe)] pb-4">
                  <div>
                    <p className="editorial-label text-[var(--text-secondary)]">
                      LIVE DISPATCH TELEMETRY
                    </p>
                    <p className="text-base font-medium mt-1">
                      Issue No. <span className="tabular-nums">1,408</span> · Morning Press
                    </p>
                  </div>
                  <span
                    className="tabular-nums text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      color: "var(--purple)",
                      backgroundColor: "var(--cream)",
                    }}
                  >
                    05:00 HORIZON
                  </span>
                </div>

                {/* City Switcher Pills */}
                <div className="mt-4">
                  <p className="editorial-label text-[var(--text-secondary)] mb-2.5">
                    SELECT EDITION CITY
                  </p>
                  <div
                    role="group"
                    aria-label="Select city for live weather preview"
                    className="flex flex-wrap gap-1.5"
                  >
                    {CITY_PRESETS.map((city) => {
                      const active = selectedCity.name === city.name;
                      return (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => setSelectedCity(city)}
                          aria-pressed={active}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? "bg-[#5722CB] text-[#f3f2ee]"
                              : "border border-[var(--border-wireframe)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {city.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Weather + Edition Snapshot */}
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--border-wireframe)] pt-5">
                  <div>
                    <span className="editorial-label text-[var(--text-secondary)] block">
                      TEMP
                    </span>
                    <span className="tabular-nums text-2xl sm:text-3xl font-medium mt-1 block">
                      {weather.temperature}°C
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {weather.conditionText}
                    </span>
                  </div>
                  <div>
                    <span className="editorial-label text-[var(--text-secondary)] block">
                      STORIES
                    </span>
                    <span className="tabular-nums text-2xl sm:text-3xl font-medium mt-1 block">
                      05
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Curated briefs
                    </span>
                  </div>
                  <div>
                    <span className="editorial-label text-[var(--text-secondary)] block">
                      READ TIME
                    </span>
                    <span
                      className="tabular-nums text-2xl sm:text-3xl font-medium mt-1 block"
                      style={{ color: isDark ? "var(--cream)" : "var(--purple)" }}
                    >
                      04:50
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Minutes total
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 2: PROBLEM / SOLUTION STORY (5fr / 7fr Asymmetric Split, Alternating)
        ===================================================================== */}
        <section
          id="how-it-works"
          className="mx-auto max-w-[1280px] px-5 sm:px-8 py-20 sm:py-28 space-y-28 sm:space-y-36 scroll-mt-24"
        >
          {/* ── CHAPTER 1: "You wake up to noise" (5fr Left / 7fr Right Bento of 3 Panels) ── */}
          <div
            id="chapter-noise"
            data-reveal-group
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left 5fr: Chapter Text */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <p
                data-reveal
                className="editorial-label text-[var(--text-secondary)] mb-4"
              >
                CHAPTER 01 · 05:45 AM · THE PROBLEM
              </p>
              <h2 data-reveal className="editorial-heading">
                You wake up to noise.
              </h2>
              <p data-reveal className="editorial-body mt-6">
                Before your feet touch the floor, forty overnight notifications,
                engagement-bait threads, and conflicting weather radars compete
                for your attention. You spend twenty minutes scrolling and still
                leave the house unsure if it will rain at noon.
              </p>
            </div>

            {/* Right 7fr: Bento of 3 Panels that animate as background resolves */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bento Panel 1 */}
              <div data-reveal className="bento-panel p-6 sm:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="editorial-label text-[var(--text-secondary)]">
                    SIGNAL DEGRADATION · UNFILTERED INBOX
                  </span>
                  <span
                    className="tabular-nums text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      color: "var(--purple)",
                      backgroundColor: "var(--cream)",
                    }}
                  >
                    148 ALERTS / HR
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-medium tracking-[-0.02em]">
                  840+ daily wires, 32 push alerts, zero synthesis.
                </p>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2">
                  Breaking banners repeat the same headline six ways without
                  ever explaining how the policy, market shift, or storm front
                  affects your Tuesday.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-wireframe)] text-xs tabular-nums">
                  <div>
                    <span className="text-[var(--text-secondary)] block">DUPLICATE WIRES</span>
                    <span className="font-semibold text-base mt-0.5 block">78%</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">CLICKBAIT RATIO</span>
                    <span className="font-semibold text-base mt-0.5 block">64%</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">TIME LOST</span>
                    <span className="font-semibold text-base mt-0.5 block">24m / day</span>
                  </div>
                </div>
              </div>

              {/* Bento Panel 2 */}
              <div data-reveal className="bento-panel p-6 flex flex-col justify-between">
                <div>
                  <span className="editorial-label text-[var(--text-secondary)]">
                    FRAGMENTED CONTEXT
                  </span>
                  <h3 className="text-xl font-medium mt-3 tracking-[-0.02em]">
                    Headlines without “Why it matters”
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                    Raw facts without industry or regional context force you to
                    piece together the implications across five browser tabs.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-wireframe)] flex items-center justify-between text-xs tabular-nums text-[var(--text-secondary)]">
                  <span>AVG TABS OPENED</span>
                  <span className="font-semibold text-[var(--text-primary)]">09 TABS</span>
                </div>
              </div>

              {/* Bento Panel 3 */}
              <div data-reveal className="bento-panel p-6 flex flex-col justify-between">
                <div>
                  <span className="editorial-label text-[var(--text-secondary)]">
                    WEATHER BLINDSPOT
                  </span>
                  <h3 className="text-xl font-medium mt-3 tracking-[-0.02em]">
                    Daily averages hide the 2pm downpour
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                    A single “28°C Partly Cloudy” icon tells you nothing about
                    whether your 08:00 commute or 14:00 client walk stays dry.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-wireframe)] flex items-center justify-between text-xs tabular-nums text-[var(--text-secondary)]">
                  <span>FORECAST GRANULARITY</span>
                  <span className="font-semibold text-[var(--text-primary)]">24H BLUR</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CHAPTER 2: "We cut it to five minutes" (Alternating 7fr Left Bento / 5fr Right Text) ── */}
          <div
            id="chapter-clarity"
            data-reveal-group
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left 7fr (order-2 on mobile, order-1 on desktop): Bento of 3 Panels */}
            <div className="lg:col-span-7 order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Panel 2A */}
              <div data-reveal className="bento-panel p-6 sm:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="editorial-label text-[var(--text-secondary)]">
                    EDITORIAL DISTILLATION PIPELINE
                  </span>
                  <span
                    className="tabular-nums text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      color: "var(--purple)",
                      backgroundColor: "var(--cream)",
                    }}
                  >
                    05:00 AM SYNTHESIS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-[12px] border border-[var(--border-wireframe)] p-4">
                    <span className="editorial-label text-[var(--text-secondary)]">
                      STEP 01 · INGEST
                    </span>
                    <p className="tabular-nums text-2xl font-medium mt-1">850+</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Global &amp; regional feeds verified overnight
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[var(--border-wireframe)] p-4">
                    <span className="editorial-label text-[var(--text-secondary)]">
                      STEP 02 · FILTER
                    </span>
                    <p className="tabular-nums text-2xl font-medium mt-1">05</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Essential stories selected for your topics
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[var(--border-wireframe)] p-4">
                    <span className="editorial-label text-[var(--text-secondary)]">
                      STEP 03 · DELIVER
                    </span>
                    <p
                      className="tabular-nums text-2xl font-medium mt-1"
                      style={{ color: isDark ? "var(--cream)" : "var(--purple)" }}
                    >
                      06:00
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Landed in your inbox before sunrise
                    </p>
                  </div>
                </div>
              </div>

              {/* Panel 2B */}
              <div data-reveal className="bento-panel p-6 flex flex-col justify-between">
                <div>
                  <span className="editorial-label text-[var(--text-secondary)]">
                    CONTEXT PROTOCOL
                  </span>
                  <h3 className="text-xl font-medium mt-3 tracking-[-0.02em]">
                    Every story includes “Why it matters”
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                    Beneath every 40-word summary sits a plain-spoken analysis
                    connecting the headline to engineering, capital, or policy.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-wireframe)] text-xs tabular-nums flex justify-between">
                  <span className="text-[var(--text-secondary)]">AVG STORY LENGTH</span>
                  <span className="font-semibold">55 SECONDS</span>
                </div>
              </div>

              {/* Panel 2C */}
              <div data-reveal className="bento-panel p-6 flex flex-col justify-between">
                <div>
                  <span className="editorial-label text-[var(--text-secondary)]">
                    FINITE BY DESIGN
                  </span>
                  <h3 className="text-xl font-medium mt-3 tracking-[-0.02em]">
                    A hard stop at story five
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                    No infinite feed, no rabbit holes, no display ads. You read,
                    you’re briefed, and you get on with your morning.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-wireframe)] text-xs tabular-nums flex justify-between">
                  <span className="text-[var(--text-secondary)]">COMPLETION RATE</span>
                  <span className="font-semibold">94.2%</span>
                </div>
              </div>
            </div>

            {/* Right 5fr (order-1 on mobile, order-2 on desktop): Chapter Text */}
            <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-28">
              <p
                data-reveal
                className="editorial-label text-[var(--text-secondary)] mb-4"
              >
                CHAPTER 02 · 06:00 AM · THE SOLUTION
              </p>
              <h2 data-reveal className="editorial-heading">
                We cut it to five minutes.
              </h2>
              <p data-reveal className="editorial-body mt-6">
                Our editors and synthesis pipeline read hundreds of primary
                sources while you sleep. At 06:00, you receive five crisp
                dispatches—stripped of filler, paired with direct context on why
                each development matters.
              </p>
            </div>
          </div>

          {/* ── CHAPTER 3: "Weather that fits your day" (5fr Left Text / 7fr Right Bento of 3 Panels) ── */}
          <div
            id="chapter-weather"
            data-reveal-group
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left 5fr: Chapter Text */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <p
                data-reveal
                className="editorial-label text-[var(--text-secondary)] mb-4"
              >
                CHAPTER 03 · 07:00 AM · THE BAROMETER
              </p>
              <h2 data-reveal className="editorial-heading">
                Weather that fits your day.
              </h2>
              <p data-reveal className="editorial-body mt-6">
                Forecasts shouldn’t require decoding satellite maps. Every
                digest opens with a street-level hourly timeline, pinpointing
                commute rain windows, UV peaks, and wind shifts for your exact
                city.
              </p>
            </div>

            {/* Right 7fr: Bento of 3 Weather Panels */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Panel 3A: Tidy Hourly Row */}
              <div data-reveal className="bento-panel p-6 sm:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="editorial-label text-[var(--text-secondary)]">
                    HOURLY COMMUTE BAROGRAPH · {selectedCity.name.toUpperCase()}
                  </span>
                  <span
                    className="tabular-nums text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      color: "var(--purple)",
                      backgroundColor: "var(--cream)",
                    }}
                  >
                    07:00 – 14:00 WINDOW
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2 text-center tabular-nums">
                  {(weather.hourlyTimeline || FALLBACK_WEATHER_PORT_HARCOURT.hourlyTimeline || [])
                    .slice(0, 8)
                    .map((pt) => (
                      <div
                        key={pt.time}
                        className="rounded-[12px] border border-[var(--border-wireframe)] py-3 px-1.5 flex flex-col items-center"
                      >
                        <span
                          className="text-[11px] font-medium"
                          style={{
                            color: pt.isCommuteWindow
                              ? isDark
                                ? "var(--cream)"
                                : "var(--purple)"
                              : "var(--text-secondary)",
                          }}
                        >
                          {pt.time}
                        </span>
                        <span className="text-base font-semibold mt-1.5">
                          {pt.temperature}°
                        </span>
                        <span className="text-[11px] text-[var(--text-secondary)] mt-1">
                          {pt.precipitationProbability}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Panel 3B */}
              <div data-reveal className="bento-panel p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="size-4 text-[var(--text-secondary)]" aria-hidden="true" />
                    <span className="editorial-label text-[var(--text-secondary)]">
                      COMMUTE ADVISORY
                    </span>
                  </div>
                  <p className="text-lg font-medium mt-3 leading-snug">
                    {weather.commuteAdvice ||
                      "Clear morning commute (07:00–09:00, 25°–28°C). Rain probability rises to 55% by 14:00."}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-wireframe)] flex justify-between text-xs tabular-nums">
                  <span className="text-[var(--text-secondary)]">PRECIP PEAK</span>
                  <span className="font-semibold">14:00 · 55%</span>
                </div>
              </div>

              {/* Panel 3C */}
              <div data-reveal className="bento-panel p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Compass className="size-4 text-[var(--text-secondary)]" aria-hidden="true" />
                    <span className="editorial-label text-[var(--text-secondary)]">
                      SOLAR &amp; ATMOSPHERIC
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 tabular-nums">
                    <div>
                      <span className="text-xs text-[var(--text-secondary)] block">SUNRISE</span>
                      <span className="text-lg font-medium">{weather.sunrise || "06:18"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-secondary)] block">SUNSET</span>
                      <span className="text-lg font-medium">{weather.sunset || "18:24"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-secondary)] block">HUMIDITY</span>
                      <span className="text-lg font-medium">{weather.humidity}%</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-secondary)] block">WIND</span>
                      <span className="text-lg font-medium">{weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-wireframe)] flex justify-between text-xs tabular-nums">
                  <span className="text-[var(--text-secondary)]">HIGH / LOW</span>
                  <span className="font-semibold">
                    H {weather.highTemp ?? 31}° · L {weather.lowTemp ?? 24}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: "YOUR DAY" FLIP CARDS (Morning, Midday, Evening — 1600px 3D)
        ===================================================================== */}
        <section
          id="your-day"
          data-reveal-group
          aria-labelledby="flip-cards-heading"
          className="mx-auto max-w-[1280px] px-5 sm:px-8 py-20 sm:py-28"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 sm:mb-16">
            <div className="lg:col-span-7">
              <p data-reveal className="editorial-label text-[var(--text-secondary)] mb-3">
                THREE DAILY RHYTHMS · INTERACTIVE SPECIMENS
              </p>
              <h2 id="flip-cards-heading" data-reveal className="editorial-heading">
                Built around your day.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p data-reveal className="editorial-body">
                Choose the flagship 06:00 morning briefing, or enable the midday
                and evening check-ins. Hover, tap, or press Enter on any edition
                card to inspect what lands inside.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {FLIP_CARDS.map((card) => {
              const isFlipped = !!flippedCards[card.id];
              return (
                <div
                  key={card.id}
                  data-reveal
                  className={`lg:col-span-4 flip-card-perspective flip-card-container h-[470px] sm:h-[450px] cursor-pointer select-none rounded-[20px] ${
                    isFlipped ? "is-flipped" : ""
                  }`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isFlipped}
                  aria-label={`${card.title} (${card.sendTime}). Activate to flip and view digest contents.`}
                  onClick={() => toggleFlipCard(card.id)}
                  onKeyDown={(e) => handleFlipKeyDown(e, card.id)}
                >
                  <div className="flip-card-inner">
                    {/* FRONT FACE */}
                    <div className="flip-card-front bento-panel p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-[var(--border-wireframe)] pb-4">
                          <span className="editorial-label text-[var(--text-secondary)]">
                            {card.edition}
                          </span>
                          <span
                            className="tabular-nums text-sm font-semibold px-3 py-1 rounded-full"
                            style={{
                              color: "var(--purple)",
                              backgroundColor: "var(--cream)",
                            }}
                          >
                            {card.sendTime}
                          </span>
                        </div>

                        <h3 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] mt-6">
                          {card.title}
                        </h3>

                        <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-4 leading-relaxed">
                          {card.frontSummary}
                        </p>
                      </div>

                      <div className="pt-5 border-t border-[var(--border-wireframe)] flex items-center justify-between">
                        <span className="tabular-nums text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                          {card.readDuration}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em]">
                          <span>Inspect inside</span>
                          <RotateCw className="size-3.5" aria-hidden="true" />
                        </span>
                      </div>
                    </div>

                    {/* BACK FACE (180° rotated) */}
                    <div className="flip-card-back bento-panel p-6 sm:p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-[var(--border-wireframe)] pb-3">
                          <span className="editorial-label text-[var(--text-secondary)]">
                            INSIDE THE {card.sendTime} EDITION
                          </span>
                          <span className="editorial-label text-[var(--text-secondary)]">
                            5 STORIES + RADAR
                          </span>
                        </div>

                        {/* Top 5 Stories */}
                        <div className="mt-3.5">
                          <p className="editorial-label text-[var(--text-secondary)] mb-2">
                            TOP 5 STORIES
                          </p>
                          <ul className="space-y-1.5 text-xs sm:text-[13px] leading-snug">
                            {card.topStories.map((story) => (
                              <li
                                key={story}
                                className="truncate text-[var(--text-primary)] font-normal"
                              >
                                {story}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Hourly Forecast Row */}
                        <div className="mt-4 pt-3 border-t border-[var(--border-wireframe)]">
                          <p className="editorial-label text-[var(--text-secondary)] mb-2">
                            HOURLY FORECAST
                          </p>
                          <div className="grid grid-cols-3 gap-2 tabular-nums text-xs">
                            {card.hourlyForecast.map((h) => (
                              <div
                                key={h.time}
                                className="rounded-[10px] border border-[var(--border-wireframe)] px-2.5 py-1.5 flex items-center justify-between"
                              >
                                <span
                                  className="font-semibold"
                                  style={{
                                    color: isDark ? "var(--cream)" : "var(--purple)",
                                  }}
                                >
                                  {h.time}
                                </span>
                                <span>{h.temp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Commute Alert Footer */}
                      <div className="pt-3 border-t border-[var(--border-wireframe)]">
                        <p className="editorial-label text-[var(--text-secondary)]">
                          COMMUTE ALERT
                        </p>
                        <p className="text-xs text-[var(--text-primary)] mt-1 leading-snug">
                          {card.commuteAlert}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            SECTION 4: SAMPLE DIGEST (Realistic Digest Mockup inside Bordered Panel)
        ===================================================================== */}
        <section
          id="sample-digest"
          data-reveal-group
          aria-labelledby="sample-digest-heading"
          className="mx-auto max-w-[1280px] px-5 sm:px-8 py-20 sm:py-28 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
            <div className="lg:col-span-5">
              <p data-reveal className="editorial-label text-[var(--text-secondary)] mb-3">
                SPECIMEN · FULL MORNING EDITION
              </p>
              <h2 id="sample-digest-heading" data-reveal className="editorial-heading">
                Read a live sample.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p data-reveal className="editorial-body">
                No paywalls or mystery formatting. Below is the exact structure
                that arrives at 06:00—complete with your local weather strip and
                five synthesized dispatches.
              </p>
            </div>
          </div>

          {/* Realistic Digest Mockup Panel */}
          <div data-reveal className="bento-panel p-6 sm:p-10 lg:p-12">
            {/* Digest Masthead */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-wireframe)] pb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--purple)",
                      color: "var(--cream)",
                    }}
                  >
                    β
                  </span>
                  <span className="editorial-label text-[var(--text-primary)]">
                    BETADIGEST MORNING EDITION · ISSUE #1,408
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5 tabular-nums">
                  Delivered at 06:00 AM · Estimated reading time: 04 min 50 sec
                </p>
              </div>

              <div className="flex items-center gap-2">
                {CITY_PRESETS.slice(0, 3).map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedCity(c)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedCity.name === c.name
                        ? "bg-[#5722CB] text-[#f3f2ee]"
                        : "border border-[var(--border-wireframe)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Strip */}
            <div className="my-6 rounded-[14px] border border-[var(--border-wireframe)] p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="tabular-nums text-3xl sm:text-4xl font-medium tracking-[-0.03em]"
                    style={{ color: isDark ? "var(--cream)" : "var(--purple)" }}
                  >
                    {weather.temperature}°C
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {selectedCity.name} · {weather.conditionText}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] tabular-nums mt-0.5">
                      High {weather.highTemp ?? 31}°C · Low {weather.lowTemp ?? 24}°C ·{" "}
                      <span className="inline-flex items-center gap-1">
                        <Droplets className="size-3 inline" aria-hidden="true" />
                        {weather.humidity}% humidity
                      </span>{" "}
                      ·{" "}
                      <span className="inline-flex items-center gap-1">
                        <Wind className="size-3 inline" aria-hidden="true" />
                        {weather.windSpeed} km/h
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-[var(--text-secondary)] lg:text-right max-w-md">
                  <span className="editorial-label text-[var(--text-primary)] block mb-0.5">
                    COMMUTE STRIP
                  </span>
                  {weather.commuteAdvice ||
                    "Clear morning commute (07:00–09:00). Carry an umbrella for 14:00 showers."}
                </div>
              </div>
            </div>

            {/* 5 Headline Rows */}
            <div className="divide-y divide-[var(--border-wireframe)]">
              {EDITORIAL_STORIES.slice(0, 5).map((story) => (
                <article
                  key={story.id}
                  className="py-6 first:pt-2 last:pb-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start"
                >
                  {/* Story Number & Category (3 cols) */}
                  <div className="lg:col-span-3 flex lg:flex-col justify-between lg:justify-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="tabular-nums text-sm font-semibold px-2.5 py-0.5 rounded-full"
                        style={{
                          color: "var(--purple)",
                          backgroundColor: "var(--cream)",
                        }}
                      >
                        {story.number}
                      </span>
                      <span className="editorial-label text-[var(--text-secondary)]">
                        {story.categoryLabel}
                      </span>
                    </div>
                    <p className="tabular-nums text-xs text-[var(--text-secondary)] lg:mt-2">
                      {story.source} · {story.readingTime}
                    </p>
                  </div>

                  {/* Story Headline & Summary (5 cols) */}
                  <div className="lg:col-span-5">
                    <h3 className="text-xl sm:text-2xl font-medium tracking-[-0.02em] leading-snug">
                      {story.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2.5 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  {/* Why It Matters Box (4 cols) */}
                  <div className="lg:col-span-4 rounded-[12px] border border-[var(--border-wireframe)] p-4">
                    <span className="editorial-label text-[var(--text-primary)] block mb-1.5">
                      WHY IT MATTERS
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {story.whyItMatters}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 5: PROOF (Infinite Marquee of Reader Quote Cards, Pauses on Hover)
        ===================================================================== */}
        <section
          id="proof"
          data-reveal-group
          aria-labelledby="proof-heading"
          className="py-20 sm:py-28 overflow-hidden"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p data-reveal className="editorial-label text-[var(--text-secondary)] mb-3">
                  READER DISPATCHES · 48,200+ SUBSCRIBERS
                </p>
                <h2 id="proof-heading" data-reveal className="editorial-heading">
                  Read before the first meeting.
                </h2>
              </div>

              {/* Accessible Pause/Play Control per better-accessibility */}
              <div data-reveal className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMarqueePaused((p) => !p)}
                  aria-label={marqueePaused ? "Resume reader quotes marquee" : "Pause reader quotes marquee"}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-wireframe)] bg-[var(--bg-panel)] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] hover:border-[var(--border-wireframe-hover)] transition-colors"
                >
                  {marqueePaused ? (
                    <>
                      <Play className="size-3.5" aria-hidden="true" />
                      <span>Resume reel</span>
                    </>
                  ) : (
                    <>
                      <Pause className="size-3.5" aria-hidden="true" />
                      <span>Pause reel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Infinite Marquee Track */}
          <div className="marquee-container relative w-full overflow-x-auto sm:overflow-hidden py-2">
            <div
              className="animate-marquee gap-5 px-5"
              style={{
                animationPlayState: marqueePaused ? "paused" : undefined,
              }}
            >
              {[...READER_QUOTES, ...READER_QUOTES].map((item, idx) => (
                <blockquote
                  key={`${item.author}-${idx}`}
                  className="bento-panel w-[320px] sm:w-[400px] shrink-0 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed">
                    “{item.quote}”
                  </p>
                  <footer className="mt-6 pt-4 border-t border-[var(--border-wireframe)] flex items-center justify-between text-xs">
                    <div>
                      <cite className="not-italic font-semibold text-[var(--text-primary)] block">
                        {item.author}
                      </cite>
                      <span className="text-[var(--text-secondary)]">
                        {item.role} · {item.city}
                      </span>
                    </div>
                    <span
                      className="tabular-nums font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        color: "var(--purple)",
                        backgroundColor: "var(--cream)",
                      }}
                    >
                      {item.readTime}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 6: FINAL CTA (Full-Width Purple Block, Cream H2, Email Capture -> /signup?email=)
        ===================================================================== */}
        <section
          id="final-cta"
          data-reveal-group
          aria-labelledby="final-cta-heading"
          className="mx-auto max-w-[1280px] px-5 sm:px-8 pb-20 sm:pb-28"
        >
          <div
            data-reveal
            className="rounded-[20px] p-8 sm:p-14 lg:p-20 border border-[var(--border-wireframe)]"
            style={{
              backgroundColor: "var(--purple)",
              color: "var(--cream)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-7">
                <span className="editorial-label text-[#e8e6e0] block mb-4">
                  FREE DAILY EDITION · UNSUBSCRIBE IN ONE CLICK
                </span>
                <h2
                  id="final-cta-heading"
                  className="editorial-heading"
                  style={{ color: "var(--cream)" }}
                >
                  Start tomorrow informed.
                </h2>
                <p className="mt-6 text-lg sm:text-xl text-[#e8e6e0] max-w-[50ch] leading-relaxed">
                  Join <span className="tabular-nums font-medium">48,200+</span>{" "}
                  readers waking up to a calmer, sharper five-minute briefing at
                  06:00 AM.
                </p>
              </div>

              <div className="lg:col-span-5">
                <form
                  action="/signup"
                  method="GET"
                  onSubmit={handleCtaSubmit}
                  noValidate
                  className="space-y-3"
                >
                  <label
                    htmlFor="final-cta-email"
                    className="editorial-label text-[#f3f2ee] block"
                  >
                    YOUR MORNING EMAIL ADDRESS
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      id="final-cta-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      required
                      placeholder="name@company.com"
                      value={ctaEmail}
                      onChange={(e) => {
                        setCtaEmail(e.target.value);
                        if (ctaError) setCtaError("");
                      }}
                      aria-invalid={ctaError ? "true" : "false"}
                      aria-describedby={ctaError ? "final-cta-error" : "final-cta-hint"}
                      className="flex-1 rounded-full px-5 py-3.5 text-base bg-[#f3f2ee] text-[#141414] placeholder:text-[#5d5a54] border border-transparent focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="btn-cream inline-flex items-center justify-center gap-2 rounded-full ps-6 pe-5 py-3.5 text-base whitespace-nowrap cursor-pointer"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  {ctaError ? (
                    <p
                      id="final-cta-error"
                      role="alert"
                      className="text-xs font-medium text-[#f3f2ee] bg-[#141414]/30 px-3.5 py-2 rounded-lg"
                    >
                      {ctaError}
                    </p>
                  ) : (
                    <p id="final-cta-hint" className="text-xs text-[#e8e6e0] tabular-nums">
                      Next edition sends at 06:00 AM · Or go directly to{" "}
                      <Link
                        href="/signup"
                        className="underline underline-offset-4 font-medium text-[#f3f2ee]"
                      >
                        full preferences setup →
                      </Link>
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── EDITORIAL FOOTER ── */}
      <footer className="relative z-10 border-t border-[var(--border-wireframe)] py-10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex size-5 items-center justify-center rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: "var(--purple)", color: "var(--cream)" }}
            >
              β
            </span>
            <span className="font-medium text-[var(--text-primary)]">BetaDigest</span>
            <span>·</span>
            <span>The day, in five minutes.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
              How it works
            </a>
            <a href="#sample-digest" className="hover:text-[var(--text-primary)] transition-colors">
              Sample digest
            </a>
            <Link href="/signup" className="hover:text-[var(--text-primary)] transition-colors">
              Subscribe
            </Link>
            <Link href="/login" className="hover:text-[var(--text-primary)] transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
