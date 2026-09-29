import Parser from "rss-parser";
import { DigestNewsItem, TopicCategory } from "@/lib/types";

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": "BetaDigest/1.0 (+https://betadigest.app)",
  },
});

const TOPIC_FEEDS: Record<TopicCategory, { name: string; url: string }[]> = {
  tech: [
    { name: "Hacker News", url: "https://news.ycombinator.com/rss" },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  ],
  ai: [
    { name: "MIT Tech Review AI", url: "https://www.technologyreview.com/feed/" },
    { name: "Arxiv AI Papers", url: "https://rss.arxiv.org/rss/cs.AI" },
  ],
  startups: [
    { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  ],
  business: [
    { name: "Forbes Innovation", url: "https://www.forbes.com/innovation/feed2/" },
  ],
  science: [
    { name: "Nature News", url: "https://www.nature.com/nature.rss" },
    { name: "Phys.org", url: "https://phys.org/rss-feed/" },
  ],
  world: [
    { name: "BBC Top Stories", url: "https://feeds.bbci.co.uk/news/rss.xml" },
  ],
};

// Fallback curated mock items in case of network timeouts during dev
const MOCK_ITEMS: Record<TopicCategory, DigestNewsItem[]> = {
  ai: [
    {
      id: "ai-1",
      title: "Next-Generation Multimodal Architectures Achieve Zero-Shot Reasoning Milestones",
      summary: "Recent advancements in agentic orchestration and spatial tokenization indicate significant improvements in tool-using agents.",
      source: "AI Frontiers",
      url: "https://arxiv.org",
      category: "ai",
      publishedAt: new Date().toISOString(),
      aiTakeaway: "Agents are transitioning from single-prompt completions to asynchronous multi-step execution graphs.",
    },
    {
      id: "ai-2",
      title: "Open-Weights Models Narrow Performance Gap on Complex Coding Benchmarks",
      summary: "Open source community releases benchmark tests showing near-parity with commercial models on synthetic reasoning datasets.",
      source: "Hugging Face Daily",
      url: "https://huggingface.co",
      category: "ai",
      publishedAt: new Date().toISOString(),
      aiTakeaway: "Self-hosting capable reasoning models is becoming viable for cost-sensitive enterprise pipelines.",
    },
  ],
  tech: [
    {
      id: "tech-1",
      title: "React 19 & Next.js 15: The New Standard for Web Application Streaming",
      summary: "App Router advancements, Server Actions, and React Compiler integration are reshaping frontend performance.",
      source: "Vercel News",
      url: "https://nextjs.org",
      category: "tech",
      publishedAt: new Date().toISOString(),
      aiTakeaway: "Zero client bundle hydration overhead is now attainable with proper server component boundaries.",
    },
  ],
  startups: [
    {
      id: "startups-1",
      title: "Vertical AI Applications Lead Early-Stage Seed rounds",
      summary: "Venture activity shows steady momentum for hyper-specialized autonomous workflows replacing legacy enterprise software.",
      source: "TechCrunch",
      url: "https://techcrunch.com",
      category: "startups",
      publishedAt: new Date().toISOString(),
      aiTakeaway: "Specialized niche data moats remain the primary differentiator against generic model wrappers.",
    },
  ],
  business: [
    {
      id: "biz-1",
      title: "Global Supply Chains Rebalance with Near-Shoring and Automation",
      summary: "Manufacturers increasingly deploy predictive logistics and robotics to insulate against geopolitical fluctuations.",
      source: "Bloomberg",
      url: "https://bloomberg.com",
      category: "business",
      publishedAt: new Date().toISOString(),
      aiTakeaway: "Capital expenditures are shifting toward localized, automated manufacturing nodes.",
    },
  ],
  science: [
    {
      id: "sci-1",
      title: "James Webb Space Telescope Identifies Atmospheric Compounds on Exoplanet Candidate",
      summary: "Spectroscopic observations reveal traces of carbon dioxide and methane in the atmosphere of a sub-Neptune world.",
      source: "NASA Science",
      url: "https://nasa.gov",
      category: "science",
      publishedAt: new Date().toISOString(),
      aiTakeaway: "Atmospheric characterization of temperate exoplanets is entering an unprecedented phase of precision.",
    },
  ],
  world: [
    {
      id: "world-1",
      title: "Renewable Energy Capacity Outpaces Fossil Generation Additions Worldwide",
      summary: "International Energy Agency reports solar and battery storage expansions led global power additions over the past quarter.",
      source: "Reuters",
      url: "https://reuters.com",
      category: "world",
      publishedAt: new Date().toISOString(),
      aiTakeaway: "Grid-scale battery costs have crossed economic tipping points in major developing economies.",
    },
  ],
};

export async function fetchNewsForTopics(
  topics: TopicCategory[]
): Promise<DigestNewsItem[]> {
  const items: DigestNewsItem[] = [];

  for (const topic of topics) {
    const feeds = TOPIC_FEEDS[topic] || [];
    let fetchedForTopic = false;

    for (const feed of feeds) {
      try {
        const feedData = await parser.parseURL(feed.url);
        if (feedData.items && feedData.items.length > 0) {
          const topItems = feedData.items.slice(0, 2);
          for (const item of topItems) {
            items.push({
              id: item.guid || item.link || `${topic}-${Math.random()}`,
              title: item.title || "Untitled Article",
              summary:
                item.contentSnippet?.slice(0, 240) ||
                item.summary?.slice(0, 240) ||
                "No description available.",
              source: feed.name,
              url: item.link || "#",
              category: topic,
              publishedAt: item.pubDate || new Date().toISOString(),
              aiTakeaway: `Key takeaway: Important ${topic} development impacting today's workflow.`,
            });
          }
          fetchedForTopic = true;
          break; // Got items from this feed, move to next topic
        }
      } catch {
        // Fall through to try next feed or mock
      }
    }

    if (!fetchedForTopic) {
      const fallback = MOCK_ITEMS[topic] || [];
      items.push(...fallback);
    }
  }

  return items;
}
