import { BriefingStory, MorningBriefing, TopicCategory, WeatherData } from "@/lib/types";

export const EDITORIAL_STORIES: BriefingStory[] = [
  {
    id: "story-01",
    number: "01",
    category: "tech",
    categoryLabel: "TECHNOLOGY",
    categoryIcon: "🧠",
    title: "OpenAI announces new developer tools & agentic workflow SDK",
    summary:
      "OpenAI unveiled a specialized task-orchestration SDK enabling developers to chain autonomous model calls, execute sandboxed bash sessions, and persist multi-agent conversational state with built-in retry guarantees.",
    whyItMatters:
      "This shifts software development from manual glue-code writing to coordinating agent swarms, drastically reducing operational overhead for engineering teams building automated pipelines.",
    source: "TechCrunch",
    publishedAt: "2h ago",
    readingTime: "3 min read",
    url: "https://techcrunch.com",
    isBookmarked: false,
  },
  {
    id: "story-02",
    number: "02",
    category: "business",
    categoryLabel: "BUSINESS",
    categoryIcon: "💼",
    title: "Nigerian markets react as Central Bank stabilizes liquidity and FX corridors",
    summary:
      "The Central Bank of Nigeria reported a notable uptick in autonomous foreign exchange turnover, with high-yield Treasury auctions oversubscribed following targeted fiscal adjustments and improved diaspora remittances.",
    whyItMatters:
      "Commercial import expenses and cloud infrastructure costs tied to foreign exchange in Lagos and Port Harcourt gain stability, easing margin pressures on local technology and manufacturing enterprises.",
    source: "BusinessDay",
    publishedAt: "3h ago",
    readingTime: "4 min read",
    url: "https://businessday.ng",
    isBookmarked: false,
  },
  {
    id: "story-03",
    number: "03",
    category: "world",
    categoryLabel: "WORLD",
    categoryIcon: "🌍",
    title: "Global clean energy deployment reaches new quarterly record led by grid storage",
    summary:
      "The International Energy Agency reports clean power additions surged 28% year-over-year, propelled by utility-scale battery deployments crossing key cost thresholds across both emerging and developed economies.",
    whyItMatters:
      "Grid-scale storage parity makes decentralized solar microgrids commercially self-sustaining across emerging markets, accelerating industrial transition away from expensive diesel generators.",
    source: "Reuters",
    publishedAt: "4h ago",
    readingTime: "3 min read",
    url: "https://reuters.com",
    isBookmarked: false,
  },
  {
    id: "story-04",
    number: "04",
    category: "startups",
    categoryLabel: "STARTUPS",
    categoryIcon: "🚀",
    title: "African fintech platforms expand cross-border stablecoin settlement rails",
    summary:
      "Leading payment operators across West and East Africa processed over $1.4B in compliant settlement transactions this quarter, bypassing multi-day correspondent banking delays and high wire fees.",
    whyItMatters:
      "Intra-continental trade transaction fees drop from an average of 7.2% to under 0.8%, unlocking working capital velocity for regional import-export merchants.",
    source: "TechCabal",
    publishedAt: "5h ago",
    readingTime: "3 min read",
    url: "https://techcabal.com",
    isBookmarked: false,
  },
  {
    id: "story-05",
    number: "05",
    category: "science",
    categoryLabel: "SCIENCE",
    categoryIcon: "🔬",
    title: "Webb Telescope captures earliest known galactic carbon markers",
    summary:
      "New spectroscopic telemetry reveals rapid heavy element synthesis occurring inside galaxies formed merely 350 million years after the Big Bang, challenging previously held stellar lifecycle timelines.",
    whyItMatters:
      "Rewrites fundamental models regarding how quickly primordial gas enriched star systems, with implications for when planets could first harbor organic chemistry.",
    source: "Nature Astronomy",
    publishedAt: "6h ago",
    readingTime: "4 min read",
    url: "https://nature.com",
    isBookmarked: false,
  },
];

export function getFilteredBriefingStories(
  activeTopics: TopicCategory[]
): BriefingStory[] {
  if (!activeTopics || activeTopics.length === 0) {
    return EDITORIAL_STORIES;
  }
  const filtered = EDITORIAL_STORIES.filter((story) =>
    activeTopics.includes(story.category)
  );
  return filtered.length > 0 ? filtered : EDITORIAL_STORIES;
}

export function generateMorningBriefing(
  recipientName: string = "Emeka",
  weather: WeatherData,
  activeTopics: TopicCategory[] = ["tech", "ai", "business", "startups"]
): MorningBriefing {
  const stories = getFilteredBriefingStories(activeTopics);
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const dateFormatted = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  }).toUpperCase();

  return {
    id: `briefing-${now.toISOString().split("T")[0]}`,
    date: now.toISOString().split("T")[0],
    dateFormatted: `${dayOfWeek} · ${dateFormatted}`,
    dayOfWeek,
    recipientName,
    storiesCount: stories.length,
    estimatedReadTime: `${Math.max(2, Math.round(stories.length * 0.9))} min read`,
    weather,
    stories,
    generatedAt: now.toISOString(),
  };
}
