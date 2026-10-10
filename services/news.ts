import Parser from "rss-parser";
import { EditorialStory, NewsTopicId, NEWS_TOPIC_LABELS, NEWS_TOPIC_ORDER } from "@/lib/types";

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": "BetaDigest/1.0 (News Digest Service)",
    Accept: "application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8",
  },
});

const TOPIC_FEED_URLS: Record<NewsTopicId, string[]> = {
  politics: [
    "https://feeds.bbci.co.uk/news/politics/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
  ],
  economy: [
    "https://feeds.bbci.co.uk/news/business/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml",
  ],
  health: [
    "https://feeds.bbci.co.uk/news/health/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
  ],
  environment: [
    "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml",
  ],
  crime: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
  ],
  international: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  ],
  education: [
    "https://feeds.bbci.co.uk/news/education/rss.xml",
  ],
  science: [
    "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
  ],
  society: [
    "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Culture.xml",
  ],
  disasters: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
  ],
  technology: [
    "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
  ],
  sports: [
    "https://feeds.bbci.co.uk/sport/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
  ],
};

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function cleanHtml(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

interface CacheEntry {
  stories: EditorialStory[];
  fetchedAt: number;
}

const cache = new Map<NewsTopicId, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchStoriesForTopic(topic: NewsTopicId): Promise<EditorialStory[]> {
  const cached = cache.get(topic);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.stories;
  }

  const urls = TOPIC_FEED_URLS[topic] || TOPIC_FEED_URLS.international;
  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      if (feed && feed.items && feed.items.length > 0) {
        const sourceName = feed.title?.includes("BBC")
          ? "BBC News"
          : feed.title?.includes("Times")
          ? "The New York Times"
          : feed.title || "Global Wire";

        const parsed: EditorialStory[] = feed.items.slice(0, 8).map((item, index) => {
          const headline = cleanHtml(item.title) || "Global Headline Update";
          const rawSummary = item.contentSnippet || item.summary || item.content || headline;
          let summary = cleanHtml(rawSummary);
          if (summary.length > 200) {
            summary = summary.slice(0, 197) + "...";
          }

          return {
            id: `${topic}-${index}-${Date.now().toString(36)}`,
            topic,
            topicLabel: NEWS_TOPIC_LABELS[topic],
            headline,
            summary: summary || headline,
            source: sourceName,
            timestamp: formatRelativeTime(item.pubDate || item.isoDate),
            url: item.link || "#",
          };
        });

        cache.set(topic, { stories: parsed, fetchedAt: Date.now() });
        return parsed;
      }
    } catch {
      // Continue to next feed fallback
    }
  }

  return cached?.stories || [];
}

/**
 * Round-robin selection of stories across selected news topics based on live RSS data.
 * Always yields exactly 5 stories (or max available) matching NEWS_TOPIC_ORDER.
 */
export async function getTop5StoriesLive(
  selectedTopics: NewsTopicId[]
): Promise<EditorialStory[]> {
  if (!selectedTopics || selectedTopics.length === 0) {
    selectedTopics = ["technology", "economy", "science", "international"];
  }

  const orderedTopics = NEWS_TOPIC_ORDER.filter((t) => selectedTopics.includes(t));
  const topicsToUse = orderedTopics.length > 0 ? orderedTopics : selectedTopics;

  const topicStoriesMap = new Map<NewsTopicId, EditorialStory[]>();
  await Promise.all(
    topicsToUse.map(async (topic) => {
      const stories = await fetchStoriesForTopic(topic);
      topicStoriesMap.set(topic, stories);
    })
  );

  const result: EditorialStory[] = [];
  const topicStoryIndex: Partial<Record<NewsTopicId, number>> = {};
  for (const t of topicsToUse) {
    topicStoryIndex[t] = 0;
  }

  let turn = 0;
  let attempts = 0;
  const maxAttempts = 30;

  while (result.length < 5 && attempts < maxAttempts) {
    const topic = topicsToUse[turn % topicsToUse.length];
    const storiesForTopic = topicStoriesMap.get(topic) || [];
    const idx = topicStoryIndex[topic] ?? 0;

    if (idx < storiesForTopic.length) {
      const story = storiesForTopic[idx];
      // Prevent duplicate URLs/headlines
      if (!result.some((r) => r.headline === story.headline)) {
        result.push(story);
      }
      topicStoryIndex[topic] = idx + 1;
    }

    turn++;
    attempts++;
  }

  return result.slice(0, 5);
}
