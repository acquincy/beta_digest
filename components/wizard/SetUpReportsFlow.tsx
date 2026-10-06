"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CloudSun,
  Newspaper,
  Trophy,
  Aperture,
  CandlestickChart,
  Check,
  Pencil,
  Search,
  MessageSquare,
} from "lucide-react";
import { CanvasA } from "../CanvasA";
import { CardShell } from "../primitives/CardShell";
import { SectionCard } from "../primitives/SectionCard";
import { IconTile, GradientIcon } from "../primitives/IconTile";
import { PrimaryButton, OutlineButton, Button } from "../primitives/Button";
import { Chip } from "../primitives/Chip";
import { Stepper } from "./Stepper";
import { ProgressHeader } from "./ProgressHeader";
import {
  loadWizardState,
  saveWizardState,
  TopicId,
  WizardState,
} from "@/lib/wizard-store";
import { digestService } from "@/lib/mock-service";

const ALL_TOPICS: { id: TopicId; title: string; desc: string; icon: any }[] = [
  {
    id: "Weather",
    title: "Weather",
    desc: "Get today's weather insights at a glance.",
    icon: CloudSun,
  },
  {
    id: "News",
    title: "News",
    desc: "Pick your favorite topics and get the top 3 news stories.",
    icon: Newspaper,
  },
  {
    id: "Sports",
    title: "Sports",
    desc: "Select your sport and team for daily highlights and scores.",
    icon: Trophy,
  },
  {
    id: "Horoscope",
    title: "Horoscope",
    desc: "Choose your zodiac sign for personalized daily horoscope insights.",
    icon: Aperture,
  },
  {
    id: "Stocks",
    title: "Stocks",
    desc: "Track up to 3 stocks with brief, daily updates on their performance.",
    icon: CandlestickChart,
  },
];

const WEATHER_METRICS = [
  "Current temperature",
  "3-hour breakdown",
  "3-day forecast",
  "Day's high/low temp",
  "Cloudiness",
  "Rain chance",
  "Thunderstorm chance",
  "UV index",
  "Air quality",
  "Wind",
  "Humidity",
  "Pressure",
  "Dew point",
  "Visibility",
  "Sunrise time",
  "Sunset time",
  "Moon phase",
];

const FOCUS_AREAS = [
  "Politics & Government",
  "Economy & Business",
  "Health & Medicine",
  "Environment & Climate",
  "Crime & Justice",
  "International Relations",
  "Education & Academia",
  "Science & Innovation",
  "Society & Culture",
  "Disasters & Emergencies",
];

const NFL_TEAMS = [
  "Dallas Cowboys",
  "Kansas City Chiefs",
  "San Francisco 49ers",
  "Philadelphia Eagles",
  "Buffalo Bills",
  "Green Bay Packers",
  "Seattle Seahawks",
  "Miami Dolphins",
  "Detroit Lions",
  "Baltimore Ravens",
];

const POPULAR_TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META"];

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const SetUpReportsFlow: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard persistent state
  const [state, setState] = useState<WizardState>(loadWizardState());

  // Selected topics list
  const selectedTopics = state.selectedTopics;
  // total = 2 + selectedTopics + 1
  const totalSteps = 2 + selectedTopics.length + 1;

  // URL step param
  const urlStepParam = searchParams?.get("step");
  const isReviewParam = urlStepParam === "review";
  const parsedStep = parseInt(urlStepParam || "1", 10);
  const currentStep = isReviewParam
    ? totalSteps
    : isNaN(parsedStep)
    ? 1
    : parsedStep;
  const isReviewStep = currentStep === totalSteps || isReviewParam;


  // Calculate current topic for steps 3 to 2 + selectedTopics.length
  const topicIndex = currentStep - 3;
  const currentTopicId =
    topicIndex >= 0 && topicIndex < selectedTopics.length
      ? selectedTopics[topicIndex]
      : null;

  // Search filter states
  const [sportsSearch, setSportsSearch] = useState("");
  const [tickerSearch, setTickerSearch] = useState("");

  // Sync state changes to storage
  useEffect(() => {
    saveWizardState(state);
  }, [state]);

  const updateUrlStep = (nextStep: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", nextStep.toString());
    window.history.pushState({}, "", url.toString());
  };

  const goToNextStep = () => {
    const next = currentStep + 1;
    if (next <= totalSteps) {
      updateUrlStep(next);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      updateUrlStep(currentStep - 1);
    } else {
      router.push("/basic-info");
    }
  };

  // Toggle topics in step 2
  const toggleTopic = (id: TopicId) => {
    const exists = selectedTopics.includes(id);
    let updated: TopicId[];
    if (exists) {
      // Keep at least 1 topic selected if possible
      if (selectedTopics.length > 1) {
        updated = selectedTopics.filter((t) => t !== id);
      } else {
        updated = selectedTopics;
      }
    } else {
      updated = [...selectedTopics, id];
    }
    setState((prev) => ({ ...prev, selectedTopics: updated }));
  };

  // Weather chip toggle
  const toggleWeatherDetail = (metric: string) => {
    const exists = state.weatherDetails.includes(metric);
    const updated = exists
      ? state.weatherDetails.filter((m) => m !== metric)
      : [...state.weatherDetails, metric];
    setState((prev) => ({ ...prev, weatherDetails: updated }));
  };

  // Focus areas toggle (max 3)
  const toggleFocusArea = (area: string) => {
    const current = state.newsConfig.focusAreas;
    if (current.includes(area)) {
      setState((prev) => ({
        ...prev,
        newsConfig: {
          ...prev.newsConfig,
          focusAreas: current.filter((a) => a !== area),
        },
      }));
    } else if (current.length < 3) {
      setState((prev) => ({
        ...prev,
        newsConfig: {
          ...prev.newsConfig,
          focusAreas: [...current, area],
        },
      }));
    }
  };

  // Stock ticker toggle (max 3)
  const toggleTicker = (ticker: string) => {
    const current = state.stocksConfig.tickers;
    if (current.includes(ticker)) {
      setState((prev) => ({
        ...prev,
        stocksConfig: {
          ...prev.stocksConfig,
          tickers: current.filter((t) => t !== ticker),
        },
      }));
    } else if (current.length < 3) {
      setState((prev) => ({
        ...prev,
        stocksConfig: {
          ...prev.stocksConfig,
          tickers: [...current, ticker],
        },
      }));
    }
  };

  const handleFinish = async () => {
    try {
      await digestService.savePreferences({
        city: state.locationValue || "Seattle",
        timezone: "America/Los_Angeles",
        channel: state.channel,
        email: state.email,
        phone: state.phone,
        dispatchTime: "07:00",
        editions: { morning: true, midday: false, evening: false },
        activeMetrics: ["high_low", "uv_index", "air_quality"],
        isPaused: false,
      });
    } catch {
      // continue
    }
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-8 md:py-12 overflow-x-hidden">
      <CanvasA />

      {/* S4 / Step 1: Delivery time & Location */}
      {currentStep === 1 && !isReviewStep && (
        <CardShell
          footer={
            <div className="w-full flex justify-end">
              <PrimaryButton onClick={goToNextStep}>Continue</PrimaryButton>
            </div>
          }
        >
          {/* Stepper (dot 1 active, 2, 3, 4 upcoming) */}
          <Stepper currentStep={1} />

          {/* H1 "When do you want your digest?" 32px */}
          <h1 className="font-display font-[600] text-[26px] md:text-[32px] leading-[37px] text-black">
            When do you want your digest?
          </h1>

          {/* Subtitle */}
          <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1">
            Choose the time and location for your daily digest.
          </p>

          {/* 40px gap before sections */}
          <div className="h-10" />

          {/* SectionCard "Delivery time" */}
          <SectionCard>
            <h2 className="font-sans font-[600] text-[18px] leading-[24px] text-black">
              Delivery time
            </h2>
            <p className="font-sans font-[400] text-[14px] leading-[20px] text-[var(--text-muted-sm)] mt-1">
              What time would you like to receive your daily digest?
            </p>
            <div className="mt-4 flex items-center gap-2 font-sans text-[16px] text-black">
              <span>Receive digests at</span>
              <select
                value={state.dispatchTime}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, dispatchTime: e.target.value }))
                }
                className="bg-transparent border-0 border-b border-black font-semibold text-black p-0 pr-4 pb-0.5 outline-none focus:outline-none focus:border-b-2 cursor-pointer tabular-nums"
              >
                <option value="6:00 AM">6:00 AM</option>
                <option value="6:30 AM">6:30 AM</option>
                <option value="7:00 AM">7:00 AM</option>
                <option value="7:30 AM">7:30 AM</option>
                <option value="8:00 AM">8:00 AM</option>
                <option value="8:30 AM">8:30 AM</option>
                <option value="9:00 AM">9:00 AM</option>
              </select>
            </div>
          </SectionCard>

          {/* 16px gap */}
          <div className="h-4" />

          {/* SectionCard "Your location" */}
          <SectionCard>
            <h2 className="font-sans font-[600] text-[18px] leading-[24px] text-black">
              Your location
            </h2>
            <p className="font-sans font-[400] text-[14px] leading-[20px] text-[var(--text-muted-sm)] mt-1">
              We use your location for weather and local information.
            </p>

            {/* Row: UnderlineInput (155px wide) with Pencil icon, then chips "ZIP Code" and "City" */}
            <div className="mt-8 flex items-center gap-6 flex-wrap">
              <div className="relative w-[155px]">
                <input
                  type="text"
                  value={state.locationValue}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      locationValue: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent border-0 border-b border-black font-sans font-[400] text-[18px] text-black p-0 pr-6 outline-none focus:outline-none focus:border-b-2 tabular-nums"
                />
                <Pencil
                  className="w-4 h-4 text-black absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              <div className="flex items-center gap-2">
                <Chip
                  active={state.locationType === "ZIP Code"}
                  onToggle={() =>
                    setState((prev) => ({ ...prev, locationType: "ZIP Code" }))
                  }
                >
                  ZIP Code
                </Chip>
                <Chip
                  active={state.locationType === "City"}
                  onToggle={() =>
                    setState((prev) => ({ ...prev, locationType: "City" }))
                  }
                >
                  City
                </Chip>
              </div>
            </div>
          </SectionCard>
        </CardShell>
      )}

      {/* S5 / Step 2: Topics */}
      {currentStep === 2 && (
        <CardShell
          footer={
            <div className="w-full flex items-center justify-between">
              <OutlineButton onClick={goToPrevStep}>Back</OutlineButton>
              <PrimaryButton
                onClick={goToNextStep}
                disabled={selectedTopics.length === 0}
              >
                Continue
              </PrimaryButton>
            </div>
          }
        >
          {/* Stepper shows dot 1 completed, dot 2 active */}
          <Stepper currentStep={2} />

          <h1 className="font-display font-[600] text-[26px] md:text-[32px] leading-[37px] text-black">
            What do you want in your digest?
          </h1>

          <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1">
            Tap to select the topics you care about. You can always change these
            later.
          </p>

          {/* List of 5 TopicCards */}
          <div className="mt-8 flex flex-col gap-3">
            {ALL_TOPICS.map((topic) => {
              const isSelected = selectedTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleTopic(topic.id)}
                  className={`w-full max-w-[672px] mx-auto min-h-[100px] rounded-[24px] p-6 flex items-center justify-between text-left transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[var(--lime-tint)] border-[2px] border-[var(--lime)]"
                      : "bg-white border-[var(--line)] hover:border-[#8F8F8F] focus-visible:border-[#8F8F8F]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <IconTile
                      icon={topic.icon}
                      size={48}
                      radius={14}
                      iconSize={26}
                    />
                    <div>
                      <div className="font-sans font-[600] text-[18px] leading-[24px] text-black">
                        {topic.title}
                      </div>
                      <div className="font-sans font-[400] text-[14px] leading-[20px] text-[var(--text-muted-sm)] mt-0.5">
                        {topic.desc}
                      </div>
                    </div>
                  </div>

                  {/* Radio circle 24px: 2px #8E9096 border. Selected: lime filled circle with black Check */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${
                      isSelected
                        ? "bg-[var(--lime)] border-0"
                        : "border-[2px] border-[#8E9096] bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-black stroke-[3]" aria-hidden="true" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardShell>
      )}

      {/* Steps 3 to 2 + selectedTopics.length: Topic Customizers */}
      {!isReviewStep && currentStep >= 3 && currentTopicId && (
        <CardShell
          footer={
            <div className="w-full flex items-center justify-between">
              <OutlineButton onClick={goToPrevStep}>Back</OutlineButton>
              <PrimaryButton onClick={goToNextStep}>Continue</PrimaryButton>
            </div>
          }
        >
          {/* ProgressHeader */}
          <ProgressHeader
            currentStep={currentStep}
            totalSteps={totalSteps}
            topicName={currentTopicId}
          />

          {/* Page header: IconTile 56px + H1 inline, 16px gap, subtitle */}
          <div className="flex items-center gap-4 mb-2">
            <IconTile
              icon={
                currentTopicId === "Weather"
                  ? CloudSun
                  : currentTopicId === "News"
                  ? Newspaper
                  : currentTopicId === "Sports"
                  ? Trophy
                  : currentTopicId === "Horoscope"
                  ? Aperture
                  : CandlestickChart
              }
              size={56}
              radius={16}
              iconSize={30}
            />
            <h1 className="font-display font-[600] text-[26px] md:text-[32px] leading-[37px] text-black">
              Customize your {currentTopicId} report
            </h1>
          </div>

          {/* Customizer content by topic */}
          {currentTopicId === "Weather" && (
            <div>
              <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1 mb-8">
                Pick the weather details you want to see each morning.
              </p>

              <SectionCard>
                <div className="border-t border-[rgba(0,0,0,0.06)] pt-4">
                  <h2 className="font-sans font-[600] text-[18px] text-black mb-4">
                    Choose your details
                  </h2>
                  <div
                    role="group"
                    aria-label="Weather indicators"
                    className="flex flex-wrap gap-x-2 gap-y-2.5"
                  >
                    {WEATHER_METRICS.map((metric) => (
                      <Chip
                        key={metric}
                        size="onboarding"
                        active={state.weatherDetails.includes(metric)}
                        onToggle={() => toggleWeatherDetail(metric)}
                      >
                        {metric}
                      </Chip>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {currentTopicId === "News" && (
            <div>
              <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1 mb-8">
                Choose your preferred news category and focus areas.
              </p>

              <SectionCard className="divide-y divide-[rgba(0,0,0,0.08)]">
                {/* 1. Include links? */}
                <div className="pb-6">
                  <h2 className="font-sans font-[600] text-[18px] text-black">
                    Include links?
                  </h2>
                  <p className="font-sans font-[400] text-[13px] leading-[18px] text-[var(--text-muted-sm)] mt-1">
                    Add source links to each news story so you can read the full
                    article.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Chip
                      active={state.newsConfig.includeLinks}
                      onToggle={() =>
                        setState((prev) => ({
                          ...prev,
                          newsConfig: {
                            ...prev.newsConfig,
                            includeLinks: true,
                          },
                        }))
                      }
                    >
                      Yes
                    </Chip>
                    <Chip
                      active={!state.newsConfig.includeLinks}
                      onToggle={() =>
                        setState((prev) => ({
                          ...prev,
                          newsConfig: {
                            ...prev.newsConfig,
                            includeLinks: false,
                          },
                        }))
                      }
                    >
                      No
                    </Chip>
                  </div>
                </div>

                {/* 2. Choose your preferred topic */}
                <div className="py-6">
                  <h2 className="font-sans font-[600] text-[18px] text-black">
                    Choose your preferred topic
                  </h2>
                  <div className="flex items-center gap-2 mt-3">
                    {["General News", "Technology", "Sports"].map((cat) => (
                      <Chip
                        key={cat}
                        active={state.newsConfig.category === cat}
                        onToggle={() =>
                          setState((prev) => ({
                            ...prev,
                            newsConfig: {
                              ...prev.newsConfig,
                              category: cat,
                            },
                          }))
                        }
                      >
                        {cat}
                      </Chip>
                    ))}
                  </div>
                  <p className="font-sans text-[15px] text-[var(--text-muted-sm)] mt-2">
                    Delivering top stories from {state.newsConfig.category.toLowerCase()}.
                  </p>
                </div>

                {/* 3. Nested block: Choose your focus areas */}
                <div className="pt-6">
                  <div className="p-2 -m-2 rounded-[16px] bg-[#FAFAFA]">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-sans font-[600] text-[18px] text-black">
                        Choose your focus areas
                      </h2>
                      <span className="font-sans text-[14px] text-[var(--text-muted)] tabular-nums">
                        ({state.newsConfig.focusAreas.length}/3)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-2 gap-y-2.5">
                      {FOCUS_AREAS.map((area) => {
                        const isSelected =
                          state.newsConfig.focusAreas.includes(area);
                        const isMax =
                          state.newsConfig.focusAreas.length >= 3 && !isSelected;

                        return (
                          <Chip
                            key={area}
                            active={isSelected}
                            disabled={isMax}
                            onToggle={() => toggleFocusArea(area)}
                          >
                            {area}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {currentTopicId === "Sports" && (
            <div>
              <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1 mb-8">
                Select your sport and team to follow.
              </p>

              <SectionCard className="flex flex-col gap-6">
                {/* 1. Pick your league */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-sans font-[700] text-[13px]">
                      1
                    </div>
                    <h2 className="font-sans font-[600] text-[18px] text-black">
                      Pick your league
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["NFL", "NBA", "MLB", "NHL", "Premier League"].map((lg) => (
                      <Chip
                        key={lg}
                        active={state.sportsConfig.league === lg}
                        onToggle={() =>
                          setState((prev) => ({
                            ...prev,
                            sportsConfig: {
                              ...prev.sportsConfig,
                              league: lg,
                            },
                          }))
                        }
                      >
                        {lg}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* 2. Pick your team */}
                <div className="border-t border-[rgba(0,0,0,0.08)] pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-sans font-[700] text-[13px]">
                      2
                    </div>
                    <h2 className="font-sans font-[600] text-[18px] text-black">
                      Pick your team
                    </h2>
                  </div>
                  <p className="font-sans font-[400] text-[13px] text-[var(--text-muted-sm)]">
                    Choose one {state.sportsConfig.league} team to follow.
                  </p>
                  <p className="font-sans font-[700] text-[13px] text-black mt-1 mb-3">
                    Currently: {state.sportsConfig.team}
                  </p>

                  {/* Search input: height 40px, border 1px --line, radius 16px */}
                  <div className="relative w-full max-w-[340px] mb-3">
                    <Search
                      className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      placeholder={`Search ${state.sportsConfig.league} teams...`}
                      value={sportsSearch}
                      onChange={(e) => setSportsSearch(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 rounded-[16px] border border-[var(--line)] bg-transparent font-sans text-[14px] text-black outline-none focus:border-black"
                    />
                  </div>

                  {/* Scrollable list max-height 220px, rows 46px */}
                  <div className="max-h-[220px] overflow-y-auto thin-scrollbar rounded-[12px] border border-[var(--line)] divide-y divide-[var(--line)]">
                    {NFL_TEAMS.filter((t) =>
                      t.toLowerCase().includes(sportsSearch.toLowerCase())
                    ).map((team) => {
                      const isSelected = state.sportsConfig.team === team;
                      return (
                        <button
                          key={team}
                          type="button"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              sportsConfig: {
                                ...prev.sportsConfig,
                                team,
                              },
                            }))
                          }
                          className={`w-full h-[46px] px-4 flex items-center justify-between text-left font-sans text-[15px] cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-[var(--lime-tint)] font-semibold text-black"
                              : "hover:bg-[#F7F7F7] text-black"
                          }`}
                        >
                          <span>{team}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-black stroke-[3]" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {currentTopicId === "Stocks" && (
            <div>
              <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1 mb-8">
                Choose stocks to track with daily market updates.
              </p>

              <SectionCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sans font-[600] text-[18px] text-black">
                    Pick up to 3 stocks
                  </h2>
                  <span className="font-sans text-[14px] text-[var(--text-muted)] tabular-nums">
                    ({state.stocksConfig.tickers.length}/3)
                  </span>
                </div>

                {/* Search input */}
                <div className="relative w-full max-w-[340px] mb-4">
                  <Search
                    className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Search stock ticker (e.g. NVDA)..."
                    value={tickerSearch}
                    onChange={(e) => setTickerSearch(e.target.value.toUpperCase())}
                    className="w-full h-10 pl-9 pr-4 rounded-[16px] border border-[var(--line)] bg-transparent font-sans text-[14px] text-black outline-none focus:border-black uppercase"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {POPULAR_TICKERS.filter((t) =>
                    t.includes(tickerSearch.trim())
                  ).map((ticker) => {
                    const isSelected = state.stocksConfig.tickers.includes(ticker);
                    const isMax =
                      state.stocksConfig.tickers.length >= 3 && !isSelected;

                    return (
                      <Chip
                        key={ticker}
                        active={isSelected}
                        disabled={isMax}
                        onToggle={() => toggleTicker(ticker)}
                      >
                        {ticker}
                      </Chip>
                    );
                  })}
                </div>
              </SectionCard>
            </div>
          )}

          {currentTopicId === "Horoscope" && (
            <div>
              <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1 mb-8">
                Choose your zodiac sign for personalized daily horoscope insights.
              </p>

              <SectionCard>
                <h2 className="font-sans font-[600] text-[18px] text-black mb-4">
                  Select your sign
                </h2>
                <div className="flex flex-wrap gap-2">
                  {ZODIAC_SIGNS.map((sign) => (
                    <Chip
                      key={sign}
                      active={state.horoscopeConfig.sign === sign}
                      onToggle={() =>
                        setState((prev) => ({
                          ...prev,
                          horoscopeConfig: { sign },
                        }))
                      }
                    >
                      {sign}
                    </Chip>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}
        </CardShell>
      )}

      {/* Review Step: width 1024px */}
      {isReviewStep && (
        <CardShell
          width="review"
          footer={
            <div className="w-full flex items-center justify-between">
              <OutlineButton onClick={goToPrevStep}>Back</OutlineButton>
              <PrimaryButton onClick={handleFinish} className="w-[187px]">
                Save &amp; finish →
              </PrimaryButton>
            </div>
          }
        >
          {/* ProgressHeader at 100% */}
          <ProgressHeader
            currentStep={totalSteps}
            totalSteps={totalSteps}
            topicName="Review"
          />

          {/* Row below it: "Save & finish →" lime PrimaryButton right-aligned */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display font-[600] text-[28px] md:text-[32px] leading-[37px] text-black">
                Review your digest
              </h1>
              <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1">
                Here&apos;s a preview of what your daily digest will look like.
              </p>
            </div>
            <div className="hidden sm:block">
              <PrimaryButton onClick={handleFinish} className="w-[187px]">
                Save &amp; finish →
              </PrimaryButton>
            </div>
          </div>

          {/* Two columns, gap 24px */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            {/* Left 362px SectionCard summary (5 cols on lg) */}
            <div className="lg:col-span-5">
              <SectionCard className="divide-y divide-[rgba(0,0,0,0.08)]">
                {/* Delivery time row */}
                <div className="py-4 first:pt-0 flex items-center justify-between">
                  <span className="font-sans font-[600] text-[14px] text-black">
                    Delivery time
                  </span>
                  <span className="font-sans font-[400] text-[14px] text-black tabular-nums">
                    {state.dispatchTime}
                  </span>
                </div>

                {/* Location row */}
                <div className="py-4">
                  <div className="font-sans font-[600] text-[14px] text-black">
                    Location
                  </div>
                  <div className="font-sans font-[400] text-[14px] text-[var(--text-muted-sm)] mt-0.5">
                    {state.locationType}: {state.locationValue} ({state.country.name})
                  </div>
                </div>

                {/* Included topics */}
                <div className="py-4 last:pb-0">
                  <div className="font-sans font-[600] text-[14px] text-black mb-3">
                    Included topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map((topId) => {
                      const topicObj = ALL_TOPICS.find((t) => t.id === topId);
                      const Icon = topicObj?.icon || CloudSun;
                      return (
                        <div
                          key={topId}
                          className="h-[30px] px-3 rounded-full flex items-center gap-1.5 border border-[var(--lime)] select-none"
                          style={{ backgroundColor: "var(--lime-tint)" }}
                        >
                          <GradientIcon icon={Icon} size={16} />
                          <span className="font-sans text-[13px] text-black font-medium">
                            {topId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Right 542px column: Message Preview (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col">
              <h2 className="font-display font-[700] text-[20px] text-black mb-4">
                Message preview
              </h2>

              {/* Preview panel bg #F2F2F2, radius 16px, padding 32px, max-height 450px, overflow auto */}
              <div className="bg-[#F2F2F2] rounded-[16px] p-8 max-h-[450px] overflow-y-auto thin-scrollbar text-black select-none">
                {/* Header row with 22px sms-green rounded-square icon */}
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center shrink-0"
                      style={{ background: "var(--sms-green)" }}
                    >
                      <MessageSquare className="w-3 h-3 text-white fill-white" aria-hidden="true" />
                    </div>
                    <span className="font-sans font-[600] text-[16px] text-black">
                      BetaDigest
                    </span>
                  </div>
                  <span className="font-sans text-[14px] text-[#7A7A7A] tabular-nums">
                    {state.dispatchTime}
                  </span>
                </div>

                <hr className="border-t border-[#D9D9D9] my-3" />

                {/* Greeting */}
                <div className="font-sans font-[500] text-[18px] text-black mb-4">
                  Good morning, {state.firstName || "Alex"}
                </div>

                {/* Per-topic blocks */}
                <div className="space-y-4">
                  {selectedTopics.includes("Weather") && (
                    <div>
                      <h3 className="font-sans font-[700] text-[16px] text-black mb-1">
                        Weather in {state.locationValue || "Seattle"}
                      </h3>
                      <p className="font-sans font-[400] text-[14px] leading-[20px] text-black">
                        Current temperature is 52°F, partly cloudy. Today&apos;s
                        high 58°F / low 45°F. Rain chance: 30% this afternoon. UV
                        Index: 3 (Moderate). Air Quality: 28 (Good).
                      </p>
                    </div>
                  )}

                  {selectedTopics.includes("News") && (
                    <div>
                      <h3 className="font-sans font-[700] text-[16px] text-black mb-1">
                        Top {state.newsConfig.category}
                      </h3>
                      <ul className="list-disc pl-5 font-sans font-[400] text-[14px] leading-[20px] text-black space-y-1">
                        <li>
                          Federal clean energy corridor funding finalized{" "}
                          {state.newsConfig.includeLinks && (
                            <span className="text-[#2563EB] underline">
                              (betadigest.com/story-1)
                            </span>
                          )}
                        </li>
                        <li>
                          Municipal rail expansion ahead of schedule{" "}
                          {state.newsConfig.includeLinks && (
                            <span className="text-[#2563EB] underline">
                              (betadigest.com/story-2)
                            </span>
                          )}
                        </li>
                      </ul>
                    </div>
                  )}

                  {selectedTopics.includes("Sports") && (
                    <div>
                      <h3 className="font-sans font-[700] text-[16px] text-black mb-1">
                        {state.sportsConfig.league}: {state.sportsConfig.team}
                      </h3>
                      <p className="font-sans font-[400] text-[14px] leading-[20px] text-black">
                        {state.sportsConfig.team} secure home victory 27-24. Next
                        matchup scheduled Sunday at 1:00 PM.
                      </p>
                    </div>
                  )}

                  {selectedTopics.includes("Stocks") && (
                    <div>
                      <h3 className="font-sans font-[700] text-[16px] text-black mb-1">
                        Stock Watch ({state.stocksConfig.tickers.join(", ")})
                      </h3>
                      <p className="font-sans font-[400] text-[14px] leading-[20px] text-black tabular-nums">
                        {state.stocksConfig.tickers.map((t) => `${t} +1.4%`).join(" · ")} · Futures indicate steady opening.
                      </p>
                    </div>
                  )}

                  {selectedTopics.includes("Horoscope") && (
                    <div>
                      <h3 className="font-sans font-[700] text-[16px] text-black mb-1">
                        {state.horoscopeConfig.sign} Daily Outlook
                      </h3>
                      <p className="font-sans font-[400] text-[14px] leading-[20px] text-black">
                        Clear communication helps resolve a complex question early. Trust your instinct on collaborative tasks.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardShell>
      )}
    </div>
  );
};
