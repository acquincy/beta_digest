export type TopicId = "Weather" | "News" | "Sports" | "Horoscope" | "Stocks";

export interface WizardState {
  country: { name: string; code: string; flag: string; dial: string };
  firstName: string;
  email: string;
  zipCode: string;
  phone: string;
  channel: "email" | "sms";
  dispatchTime: string;
  locationType: "ZIP Code" | "City";
  locationValue: string;
  selectedTopics: TopicId[];
  weatherDetails: string[];
  newsConfig: {
    includeLinks: boolean;
    category: string;
    focusAreas: string[];
  };
  sportsConfig: {
    league: string;
    team: string;
  };
  stocksConfig: {
    tickers: string[];
  };
  horoscopeConfig: {
    sign: string;
  };
}

export const INITIAL_WIZARD_STATE: WizardState = {
  country: { name: "United States", code: "US", flag: "🇺🇸", dial: "+1" },
  firstName: "Alex",
  email: "reader@betadigest.com",
  zipCode: "98039",
  phone: "2065550192",
  channel: "email",
  dispatchTime: "7:00 AM",
  locationType: "ZIP Code",
  locationValue: "39507",
  selectedTopics: ["Weather", "News", "Sports"],
  weatherDetails: [
    "Current temperature",
    "3-hour breakdown",
    "Day's high/low temp",
    "Thunderstorm chance",
    "UV index",
    "Air quality",
  ],
  newsConfig: {
    includeLinks: true,
    category: "General News",
    focusAreas: ["Politics & Government"],
  },
  sportsConfig: {
    league: "NFL",
    team: "Dallas Cowboys",
  },
  stocksConfig: {
    tickers: ["AAPL", "GOOGL"],
  },
  horoscopeConfig: {
    sign: "Aries",
  },
};

const STORAGE_KEY = "betadigest_wizard_state";

export function loadWizardState(): WizardState {
  if (typeof window === "undefined") return INITIAL_WIZARD_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_WIZARD_STATE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_WIZARD_STATE, ...parsed };
  } catch {
    return INITIAL_WIZARD_STATE;
  }
}

export function saveWizardState(state: WizardState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
