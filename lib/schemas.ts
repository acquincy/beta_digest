import { z } from "zod";
import { WEATHER_TOPIC_ORDER, NEWS_TOPIC_ORDER, WeatherTopicId, NewsTopicId } from "./types";

export const weatherTopicIdSchema = z.enum(
  WEATHER_TOPIC_ORDER as [WeatherTopicId, ...WeatherTopicId[]]
);

export const newsTopicIdSchema = z.enum(
  NEWS_TOPIC_ORDER as [NewsTopicId, ...NewsTopicId[]]
);

export const cityRegex = /^[\p{L}\s\-'.]{2,60}$/u;

export const preferencesSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    email: z.string().trim().email("Please provide a valid email address."),
    countryCode: z.string().trim().min(2, "Please select a valid country."),
    city: z
      .string()
      .trim()
      .min(2, "City name must be at least 2 characters.")
      .max(60, "City name must be at most 60 characters.")
      .regex(cityRegex, "City contains invalid characters."),
    cityIsCustom: z.boolean().default(false),
    deliveryHour: z
      .number()
      .int()
      .min(0, "Hour must be between 0 and 23.")
      .max(23, "Hour must be between 0 and 23.")
      .default(7),
    weatherTopics: z
      .array(weatherTopicIdSchema)
      .max(3, "Select up to 3 weather details."),
    newsTopics: z
      .array(newsTopicIdSchema)
      .max(5, "Select up to 5 news topics."),
  })
  .refine(
    (data) => data.weatherTopics.length + data.newsTopics.length >= 1,
    {
      message: "Please select at least 1 topic in total.",
      path: ["weatherTopics"],
    }
  );

export type PreferencesFormData = z.infer<typeof preferencesSchema>;
