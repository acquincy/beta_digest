export interface ImageMeta {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
  credit: {
    photographer: string;
    unsplashId: string;
  };
}

export const CITY_HERO_IMAGES: Record<string, ImageMeta> = {
  Seattle: {
    src: "/images/city-seattle.jpg",
    width: 640,
    height: 480,
    alt: "Morning Seattle cityscape with Puget Sound and mist over mountain horizon",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjNTQ2NTc0Ii8+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjQiIHk9IjgiIGZpbGw9IiMzMDNiNDQiLz48L3N2Zz4=",
    credit: {
      photographer: "Thom Milkovic",
      unsplashId: "photo-1502175353174-a7a70e73b362",
    },
  },
  London: {
    src: "/images/city-london.jpg",
    width: 640,
    height: 480,
    alt: "London city skyline along the River Thames at morning twilight",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjNzU3NzcwIi8+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjUiIHk9IjciIGZpbGw9IiM0MjQ1NDEiLz48L3N2Zz4=",
    credit: {
      photographer: "Luca Micheli",
      unsplashId: "photo-1513635269975-59663e0ac1ad",
    },
  },
  Lagos: {
    src: "/images/city-lagos.jpg",
    width: 640,
    height: 480,
    alt: "Morning light over the Lekki-Ikoyi cable bridge and cityscape in Lagos",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjYzQ5MDYwIi8+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjYiIHk9IjYiIGZpbGw9IiMzZTJkMjgiLz48L3N2Zz4=",
    credit: {
      photographer: "Muhammadtaha Ibrahim",
      unsplashId: "photo-1618828665011-0abd973f7bb8",
    },
  },
  Tokyo: {
    src: "/images/city-tokyo.jpg",
    width: 640,
    height: 480,
    alt: "Tokyo skyline featuring Tokyo Tower under clear morning skies",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjNGIzZTU1Ii8+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjUiIHk9IjciIGZpbGw9IiMyNTFmMmIiLz48L3N2Zz4=",
    credit: {
      photographer: "Jezael Melgoza",
      unsplashId: "photo-1503899036084-c55cdd92da26",
    },
  },
  NewYork: {
    src: "/images/city-newyork.jpg",
    width: 640,
    height: 480,
    alt: "New York Manhattan skyline at dawn viewed across the East River",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjNjk3YThlIi8+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjUiIHk9IjciIGZpbGw9IiMyZDM1NDAiLz48L3N2Zz4=",
    credit: {
      photographer: "Florian Wehde",
      unsplashId: "photo-1496442226666-8d4d0e62e6e9",
    },
  },
};

export const EMAIL_HEADER_IMAGE: ImageMeta = {
  src: "/images/email-header.jpg",
  width: 720,
  height: 320,
  alt: "Early morning calm cityscape horizon under soft sunrise light",
  blurDataURL:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAxMCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjEwIiBmaWxsPSIjNmE3Nzg1Ii8+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjQiIHk9IjYiIGZpbGw9IiMzNTNlNDgiLz48L3N2Zz4=",
  credit: {
    photographer: "Sandro Katalina",
    unsplashId: "photo-1480714378408-67cf0d13bc1b",
  },
};

export const STORY_THUMBNAILS: Record<string, ImageMeta> = {
  "story-1": {
    src: "/images/story-markets.jpg",
    width: 160,
    height: 160,
    alt: "Financial market data and liquid trading terminals",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMyYzNhNDQiLz48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB5PSI1IiBmaWxsPSIjNDQ2MDcyIi8+PC9zdmc+",
    credit: {
      photographer: "Maxim Hopman",
      unsplashId: "photo-1611974789855-9c2a0a7236a3",
    },
  },
  "story-2": {
    src: "/images/story-transit.jpg",
    width: 160,
    height: 160,
    alt: "Automated regional commuter passenger rail on tracks",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM0YTUwNTIiLz48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB5PSI1IiBmaWxsPSIjMjgyZDMwIi8+PC9zdmc+",
    credit: {
      photographer: "Ewan Robertson",
      unsplashId: "photo-1474487548417-781cb71495f3",
    },
  },
  "story-3": {
    src: "/images/story-wind.jpg",
    width: 160,
    height: 160,
    alt: "Offshore wind turbines operating in coastal waters",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM0YTZkODIiLz48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB5PSI0IiBmaWxsPSIjMzA0ZjY0Ii8+PC9zdmc+",
    credit: {
      photographer: "American Public Power Association",
      unsplashId: "photo-1466611653911-95081537e5b7",
    },
  },
  "story-4": {
    src: "/images/story-reservoir.jpg",
    width: 160,
    height: 160,
    alt: "Clean municipal water reservoir surrounded by alpine hills",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMzZDVhNGEiLz48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB5PSI0IiBmaWxsPSIjMjQzYzMwIi8+PC9zdmc+",
    credit: {
      photographer: "Luca Bravo",
      unsplashId: "photo-1509316975850-ff9c5deb0cd9",
    },
  },
  "story-5": {
    src: "/images/story-freight.jpg",
    width: 160,
    height: 160,
    alt: "Intermodal freight rail containers at logistics junction",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM1ODQ4NDAiLz48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB5PSI0IiBmaWxsPSIjMzYyYTI0Ii8+PC9zdmc+",
    credit: {
      photographer: "CHUTTERSNAP",
      unsplashId: "photo-1586528116311-ad8dd3c8310d",
    },
  },
};

export const ALL_IMAGE_CREDITS = [
  ...Object.values(CITY_HERO_IMAGES).map((c) => ({
    role: `Hero city backdrop (${c.alt.split(" ")[0]}...)`,
    ...c.credit,
  })),
  {
    role: "Sample digest email header",
    ...EMAIL_HEADER_IMAGE.credit,
  },
  ...Object.values(STORY_THUMBNAILS).map((s) => ({
    role: `Editorial story thumbnail (${s.alt})`,
    ...s.credit,
  })),
];
