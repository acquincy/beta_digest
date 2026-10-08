// Geo data: 195 sovereign states and popular cities per country
export interface CountryOption {
  code: string;
  name: string;
}

export interface CityOption {
  name: string;
  lat: number;
  lon: number;
}

export const COUNTRIES: CountryOption[] = [
  {
    "code": "AF",
    "name": "Afghanistan"
  },
  {
    "code": "AL",
    "name": "Albania"
  },
  {
    "code": "DZ",
    "name": "Algeria"
  },
  {
    "code": "AD",
    "name": "Andorra"
  },
  {
    "code": "AO",
    "name": "Angola"
  },
  {
    "code": "AG",
    "name": "Antigua and Barbuda"
  },
  {
    "code": "AR",
    "name": "Argentina"
  },
  {
    "code": "AM",
    "name": "Armenia"
  },
  {
    "code": "AU",
    "name": "Australia"
  },
  {
    "code": "AT",
    "name": "Austria"
  },
  {
    "code": "AZ",
    "name": "Azerbaijan"
  },
  {
    "code": "BS",
    "name": "Bahamas"
  },
  {
    "code": "BH",
    "name": "Bahrain"
  },
  {
    "code": "BD",
    "name": "Bangladesh"
  },
  {
    "code": "BB",
    "name": "Barbados"
  },
  {
    "code": "BY",
    "name": "Belarus"
  },
  {
    "code": "BE",
    "name": "Belgium"
  },
  {
    "code": "BZ",
    "name": "Belize"
  },
  {
    "code": "BJ",
    "name": "Benin"
  },
  {
    "code": "BT",
    "name": "Bhutan"
  },
  {
    "code": "BO",
    "name": "Bolivia"
  },
  {
    "code": "BA",
    "name": "Bosnia and Herzegovina"
  },
  {
    "code": "BW",
    "name": "Botswana"
  },
  {
    "code": "BR",
    "name": "Brazil"
  },
  {
    "code": "BN",
    "name": "Brunei"
  },
  {
    "code": "BG",
    "name": "Bulgaria"
  },
  {
    "code": "BF",
    "name": "Burkina Faso"
  },
  {
    "code": "BI",
    "name": "Burundi"
  },
  {
    "code": "CV",
    "name": "Cabo Verde"
  },
  {
    "code": "KH",
    "name": "Cambodia"
  },
  {
    "code": "CM",
    "name": "Cameroon"
  },
  {
    "code": "CA",
    "name": "Canada"
  },
  {
    "code": "CF",
    "name": "Central African Republic"
  },
  {
    "code": "TD",
    "name": "Chad"
  },
  {
    "code": "CL",
    "name": "Chile"
  },
  {
    "code": "CN",
    "name": "China"
  },
  {
    "code": "CO",
    "name": "Colombia"
  },
  {
    "code": "KM",
    "name": "Comoros"
  },
  {
    "code": "CG",
    "name": "Congo"
  },
  {
    "code": "CR",
    "name": "Costa Rica"
  },
  {
    "code": "HR",
    "name": "Croatia"
  },
  {
    "code": "CU",
    "name": "Cuba"
  },
  {
    "code": "CY",
    "name": "Cyprus"
  },
  {
    "code": "CZ",
    "name": "Czech Republic"
  },
  {
    "code": "CD",
    "name": "Democratic Republic of the Congo"
  },
  {
    "code": "DK",
    "name": "Denmark"
  },
  {
    "code": "DJ",
    "name": "Djibouti"
  },
  {
    "code": "DM",
    "name": "Dominica"
  },
  {
    "code": "DO",
    "name": "Dominican Republic"
  },
  {
    "code": "TL",
    "name": "East Timor"
  },
  {
    "code": "EC",
    "name": "Ecuador"
  },
  {
    "code": "EG",
    "name": "Egypt"
  },
  {
    "code": "SV",
    "name": "El Salvador"
  },
  {
    "code": "GQ",
    "name": "Equatorial Guinea"
  },
  {
    "code": "ER",
    "name": "Eritrea"
  },
  {
    "code": "EE",
    "name": "Estonia"
  },
  {
    "code": "SZ",
    "name": "Eswatini"
  },
  {
    "code": "ET",
    "name": "Ethiopia"
  },
  {
    "code": "FJ",
    "name": "Fiji"
  },
  {
    "code": "FI",
    "name": "Finland"
  },
  {
    "code": "FR",
    "name": "France"
  },
  {
    "code": "GA",
    "name": "Gabon"
  },
  {
    "code": "GM",
    "name": "Gambia"
  },
  {
    "code": "GE",
    "name": "Georgia"
  },
  {
    "code": "DE",
    "name": "Germany"
  },
  {
    "code": "GH",
    "name": "Ghana"
  },
  {
    "code": "GR",
    "name": "Greece"
  },
  {
    "code": "GD",
    "name": "Grenada"
  },
  {
    "code": "GT",
    "name": "Guatemala"
  },
  {
    "code": "GN",
    "name": "Guinea"
  },
  {
    "code": "GW",
    "name": "Guinea-Bissau"
  },
  {
    "code": "GY",
    "name": "Guyana"
  },
  {
    "code": "HT",
    "name": "Haiti"
  },
  {
    "code": "VA",
    "name": "Holy See"
  },
  {
    "code": "HN",
    "name": "Honduras"
  },
  {
    "code": "HU",
    "name": "Hungary"
  },
  {
    "code": "IS",
    "name": "Iceland"
  },
  {
    "code": "IN",
    "name": "India"
  },
  {
    "code": "ID",
    "name": "Indonesia"
  },
  {
    "code": "IR",
    "name": "Iran"
  },
  {
    "code": "IQ",
    "name": "Iraq"
  },
  {
    "code": "IE",
    "name": "Ireland"
  },
  {
    "code": "IL",
    "name": "Israel"
  },
  {
    "code": "IT",
    "name": "Italy"
  },
  {
    "code": "CI",
    "name": "Ivory Coast"
  },
  {
    "code": "JM",
    "name": "Jamaica"
  },
  {
    "code": "JP",
    "name": "Japan"
  },
  {
    "code": "JO",
    "name": "Jordan"
  },
  {
    "code": "KZ",
    "name": "Kazakhstan"
  },
  {
    "code": "KE",
    "name": "Kenya"
  },
  {
    "code": "KI",
    "name": "Kiribati"
  },
  {
    "code": "KW",
    "name": "Kuwait"
  },
  {
    "code": "KG",
    "name": "Kyrgyzstan"
  },
  {
    "code": "LA",
    "name": "Laos"
  },
  {
    "code": "LV",
    "name": "Latvia"
  },
  {
    "code": "LB",
    "name": "Lebanon"
  },
  {
    "code": "LS",
    "name": "Lesotho"
  },
  {
    "code": "LR",
    "name": "Liberia"
  },
  {
    "code": "LY",
    "name": "Libya"
  },
  {
    "code": "LI",
    "name": "Liechtenstein"
  },
  {
    "code": "LT",
    "name": "Lithuania"
  },
  {
    "code": "LU",
    "name": "Luxembourg"
  },
  {
    "code": "MG",
    "name": "Madagascar"
  },
  {
    "code": "MW",
    "name": "Malawi"
  },
  {
    "code": "MY",
    "name": "Malaysia"
  },
  {
    "code": "MV",
    "name": "Maldives"
  },
  {
    "code": "ML",
    "name": "Mali"
  },
  {
    "code": "MT",
    "name": "Malta"
  },
  {
    "code": "MH",
    "name": "Marshall Islands"
  },
  {
    "code": "MR",
    "name": "Mauritania"
  },
  {
    "code": "MU",
    "name": "Mauritius"
  },
  {
    "code": "MX",
    "name": "Mexico"
  },
  {
    "code": "FM",
    "name": "Micronesia"
  },
  {
    "code": "MD",
    "name": "Moldova"
  },
  {
    "code": "MC",
    "name": "Monaco"
  },
  {
    "code": "MN",
    "name": "Mongolia"
  },
  {
    "code": "ME",
    "name": "Montenegro"
  },
  {
    "code": "MA",
    "name": "Morocco"
  },
  {
    "code": "MZ",
    "name": "Mozambique"
  },
  {
    "code": "MM",
    "name": "Myanmar"
  },
  {
    "code": "NA",
    "name": "Namibia"
  },
  {
    "code": "NR",
    "name": "Nauru"
  },
  {
    "code": "NP",
    "name": "Nepal"
  },
  {
    "code": "NL",
    "name": "Netherlands"
  },
  {
    "code": "NZ",
    "name": "New Zealand"
  },
  {
    "code": "NI",
    "name": "Nicaragua"
  },
  {
    "code": "NE",
    "name": "Niger"
  },
  {
    "code": "NG",
    "name": "Nigeria"
  },
  {
    "code": "KP",
    "name": "North Korea"
  },
  {
    "code": "MK",
    "name": "North Macedonia"
  },
  {
    "code": "NO",
    "name": "Norway"
  },
  {
    "code": "OM",
    "name": "Oman"
  },
  {
    "code": "PK",
    "name": "Pakistan"
  },
  {
    "code": "PW",
    "name": "Palau"
  },
  {
    "code": "PS",
    "name": "Palestine"
  },
  {
    "code": "PA",
    "name": "Panama"
  },
  {
    "code": "PG",
    "name": "Papua New Guinea"
  },
  {
    "code": "PY",
    "name": "Paraguay"
  },
  {
    "code": "PE",
    "name": "Peru"
  },
  {
    "code": "PH",
    "name": "Philippines"
  },
  {
    "code": "PL",
    "name": "Poland"
  },
  {
    "code": "PT",
    "name": "Portugal"
  },
  {
    "code": "QA",
    "name": "Qatar"
  },
  {
    "code": "RO",
    "name": "Romania"
  },
  {
    "code": "RU",
    "name": "Russia"
  },
  {
    "code": "RW",
    "name": "Rwanda"
  },
  {
    "code": "KN",
    "name": "Saint Kitts and Nevis"
  },
  {
    "code": "LC",
    "name": "Saint Lucia"
  },
  {
    "code": "VC",
    "name": "Saint Vincent and the Grenadines"
  },
  {
    "code": "WS",
    "name": "Samoa"
  },
  {
    "code": "SM",
    "name": "San Marino"
  },
  {
    "code": "ST",
    "name": "Sao Tome and Principe"
  },
  {
    "code": "SA",
    "name": "Saudi Arabia"
  },
  {
    "code": "SN",
    "name": "Senegal"
  },
  {
    "code": "RS",
    "name": "Serbia"
  },
  {
    "code": "SC",
    "name": "Seychelles"
  },
  {
    "code": "SL",
    "name": "Sierra Leone"
  },
  {
    "code": "SG",
    "name": "Singapore"
  },
  {
    "code": "SK",
    "name": "Slovakia"
  },
  {
    "code": "SI",
    "name": "Slovenia"
  },
  {
    "code": "SB",
    "name": "Solomon Islands"
  },
  {
    "code": "SO",
    "name": "Somalia"
  },
  {
    "code": "ZA",
    "name": "South Africa"
  },
  {
    "code": "KR",
    "name": "South Korea"
  },
  {
    "code": "SS",
    "name": "South Sudan"
  },
  {
    "code": "ES",
    "name": "Spain"
  },
  {
    "code": "LK",
    "name": "Sri Lanka"
  },
  {
    "code": "SD",
    "name": "Sudan"
  },
  {
    "code": "SR",
    "name": "Suriname"
  },
  {
    "code": "SE",
    "name": "Sweden"
  },
  {
    "code": "CH",
    "name": "Switzerland"
  },
  {
    "code": "SY",
    "name": "Syria"
  },
  {
    "code": "TJ",
    "name": "Tajikistan"
  },
  {
    "code": "TZ",
    "name": "Tanzania"
  },
  {
    "code": "TH",
    "name": "Thailand"
  },
  {
    "code": "TG",
    "name": "Togo"
  },
  {
    "code": "TO",
    "name": "Tonga"
  },
  {
    "code": "TT",
    "name": "Trinidad and Tobago"
  },
  {
    "code": "TN",
    "name": "Tunisia"
  },
  {
    "code": "TR",
    "name": "Turkey"
  },
  {
    "code": "TM",
    "name": "Turkmenistan"
  },
  {
    "code": "TV",
    "name": "Tuvalu"
  },
  {
    "code": "UG",
    "name": "Uganda"
  },
  {
    "code": "UA",
    "name": "Ukraine"
  },
  {
    "code": "AE",
    "name": "United Arab Emirates"
  },
  {
    "code": "GB",
    "name": "United Kingdom"
  },
  {
    "code": "US",
    "name": "United States"
  },
  {
    "code": "UY",
    "name": "Uruguay"
  },
  {
    "code": "UZ",
    "name": "Uzbekistan"
  },
  {
    "code": "VU",
    "name": "Vanuatu"
  },
  {
    "code": "VE",
    "name": "Venezuela"
  },
  {
    "code": "VN",
    "name": "Vietnam"
  },
  {
    "code": "YE",
    "name": "Yemen"
  },
  {
    "code": "ZM",
    "name": "Zambia"
  },
  {
    "code": "ZW",
    "name": "Zimbabwe"
  }
];

export const CITIES: Record<string, CityOption[]> = {
  "AF": [
    {
      "name": "Kabul",
      "lat": 34.5553,
      "lon": 69.2075
    },
    {
      "name": "Herat",
      "lat": 34.3529,
      "lon": 62.204
    },
    {
      "name": "Kandahar",
      "lat": 31.6289,
      "lon": 65.7372
    },
    {
      "name": "Mazar-i-Sharif",
      "lat": 36.7061,
      "lon": 67.1108
    },
    {
      "name": "Jalalabad",
      "lat": 34.4265,
      "lon": 70.4515
    },
    {
      "name": "Kunduz",
      "lat": 36.729,
      "lon": 68.857
    }
  ],
  "AL": [
    {
      "name": "Tirana",
      "lat": 41.3275,
      "lon": 19.8187
    },
    {
      "name": "Durrës",
      "lat": 41.3231,
      "lon": 19.4414
    },
    {
      "name": "Vlorë",
      "lat": 40.4661,
      "lon": 19.4914
    },
    {
      "name": "Shkodër",
      "lat": 42.0683,
      "lon": 19.5126
    },
    {
      "name": "Fier",
      "lat": 40.7239,
      "lon": 19.5561
    },
    {
      "name": "Korçë",
      "lat": 40.6186,
      "lon": 20.7808
    }
  ],
  "DZ": [
    {
      "name": "Algiers",
      "lat": 36.7538,
      "lon": 3.0588
    },
    {
      "name": "Oran",
      "lat": 35.6976,
      "lon": -0.6337
    },
    {
      "name": "Constantine",
      "lat": 36.365,
      "lon": 6.6147
    },
    {
      "name": "Annaba",
      "lat": 36.9,
      "lon": 7.7667
    },
    {
      "name": "Blida",
      "lat": 36.4701,
      "lon": 2.8288
    },
    {
      "name": "Batna",
      "lat": 35.5559,
      "lon": 6.1741
    },
    {
      "name": "Sétif",
      "lat": 36.19,
      "lon": 5.41
    }
  ],
  "AD": [
    {
      "name": "Andorra la Vella",
      "lat": 42.5063,
      "lon": 1.5218
    },
    {
      "name": "Escaldes-Engordany",
      "lat": 42.5088,
      "lon": 1.5388
    },
    {
      "name": "Encamp",
      "lat": 42.5359,
      "lon": 1.5801
    },
    {
      "name": "Sant Julià de Lòria",
      "lat": 42.4637,
      "lon": 1.4913
    },
    {
      "name": "La Massana",
      "lat": 42.5449,
      "lon": 1.5147
    },
    {
      "name": "Canillo",
      "lat": 42.5676,
      "lon": 1.5976
    }
  ],
  "AO": [
    {
      "name": "Luanda",
      "lat": -8.839,
      "lon": 13.2894
    },
    {
      "name": "Lubango",
      "lat": -14.9172,
      "lon": 13.4925
    },
    {
      "name": "Huambo",
      "lat": -12.7761,
      "lon": 15.7392
    },
    {
      "name": "Benguela",
      "lat": -12.5763,
      "lon": 13.4055
    },
    {
      "name": "Cabinda",
      "lat": -5.55,
      "lon": 12.2
    },
    {
      "name": "Malanje",
      "lat": -9.5401,
      "lon": 16.341
    }
  ],
  "AG": [
    {
      "name": "St. John's",
      "lat": 17.1175,
      "lon": -61.8456
    },
    {
      "name": "All Saints",
      "lat": 17.0674,
      "lon": -61.7925
    },
    {
      "name": "Liberta",
      "lat": 17.0414,
      "lon": -61.7903
    },
    {
      "name": "Potters Village",
      "lat": 17.1194,
      "lon": -61.8175
    },
    {
      "name": "Bolands",
      "lat": 17.0658,
      "lon": -61.8744
    },
    {
      "name": "Parham",
      "lat": 17.0967,
      "lon": -61.7706
    }
  ],
  "AR": [
    {
      "name": "Buenos Aires",
      "lat": -34.6037,
      "lon": -58.3816
    },
    {
      "name": "Córdoba",
      "lat": -31.4201,
      "lon": -64.1888
    },
    {
      "name": "Rosario",
      "lat": -32.9468,
      "lon": -60.6393
    },
    {
      "name": "Mendoza",
      "lat": -32.8895,
      "lon": -68.8458
    },
    {
      "name": "La Plata",
      "lat": -34.9215,
      "lon": -57.9545
    },
    {
      "name": "San Miguel de Tucumán",
      "lat": -26.8083,
      "lon": -65.2176
    },
    {
      "name": "Mar del Plata",
      "lat": -38.0055,
      "lon": -57.556
    }
  ],
  "AM": [
    {
      "name": "Yerevan",
      "lat": 40.1792,
      "lon": 44.4991
    },
    {
      "name": "Gyumri",
      "lat": 40.7929,
      "lon": 43.8465
    },
    {
      "name": "Vanadzor",
      "lat": 40.8074,
      "lon": 44.497
    },
    {
      "name": "Vagharshapat",
      "lat": 40.165,
      "lon": 44.298
    },
    {
      "name": "Abovyan",
      "lat": 40.2736,
      "lon": 44.6264
    },
    {
      "name": "Kapan",
      "lat": 39.2075,
      "lon": 46.4058
    }
  ],
  "AU": [
    {
      "name": "Sydney",
      "lat": -33.8688,
      "lon": 151.2093
    },
    {
      "name": "Melbourne",
      "lat": -37.8136,
      "lon": 144.9631
    },
    {
      "name": "Brisbane",
      "lat": -27.4698,
      "lon": 153.0251
    },
    {
      "name": "Perth",
      "lat": -31.9505,
      "lon": 115.8605
    },
    {
      "name": "Adelaide",
      "lat": -34.9285,
      "lon": 138.6007
    },
    {
      "name": "Canberra",
      "lat": -35.2809,
      "lon": 149.13
    },
    {
      "name": "Gold Coast",
      "lat": -28.0167,
      "lon": 153.4
    },
    {
      "name": "Hobart",
      "lat": -42.8821,
      "lon": 147.3272
    }
  ],
  "AT": [
    {
      "name": "Vienna",
      "lat": 48.2082,
      "lon": 16.3738
    },
    {
      "name": "Graz",
      "lat": 47.0707,
      "lon": 15.4395
    },
    {
      "name": "Linz",
      "lat": 48.3069,
      "lon": 14.2858
    },
    {
      "name": "Salzburg",
      "lat": 47.8095,
      "lon": 13.055
    },
    {
      "name": "Innsbruck",
      "lat": 47.2692,
      "lon": 11.4041
    },
    {
      "name": "Klagenfurt",
      "lat": 46.6247,
      "lon": 14.3053
    }
  ],
  "AZ": [
    {
      "name": "Baku",
      "lat": 40.4093,
      "lon": 49.8671
    },
    {
      "name": "Ganja",
      "lat": 40.6828,
      "lon": 46.3606
    },
    {
      "name": "Sumqayit",
      "lat": 40.5897,
      "lon": 49.6686
    },
    {
      "name": "Mingachevir",
      "lat": 40.764,
      "lon": 47.0595
    },
    {
      "name": "Shirvan",
      "lat": 39.9306,
      "lon": 48.9294
    },
    {
      "name": "Nakhchivan",
      "lat": 39.2089,
      "lon": 45.4122
    }
  ],
  "BS": [
    {
      "name": "Nassau",
      "lat": 25.048,
      "lon": -77.3554
    },
    {
      "name": "Freeport",
      "lat": 26.5333,
      "lon": -78.7
    },
    {
      "name": "West End",
      "lat": 26.6867,
      "lon": -78.9772
    },
    {
      "name": "Coopers Town",
      "lat": 26.8719,
      "lon": -77.5117
    },
    {
      "name": "Marsh Harbour",
      "lat": 26.5417,
      "lon": -77.0636
    },
    {
      "name": "George Town",
      "lat": 23.5162,
      "lon": -75.7892
    }
  ],
  "BH": [
    {
      "name": "Manama",
      "lat": 26.2285,
      "lon": 50.586
    },
    {
      "name": "Riffa",
      "lat": 26.13,
      "lon": 50.555
    },
    {
      "name": "Muharraq",
      "lat": 26.2572,
      "lon": 50.6119
    },
    {
      "name": "Hamad Town",
      "lat": 26.1153,
      "lon": 50.5069
    },
    {
      "name": "A'ali",
      "lat": 26.1553,
      "lon": 50.5269
    },
    {
      "name": "Isa Town",
      "lat": 26.1736,
      "lon": 50.5478
    }
  ],
  "BD": [
    {
      "name": "Dhaka",
      "lat": 23.8103,
      "lon": 90.4125
    },
    {
      "name": "Chittagong",
      "lat": 22.3569,
      "lon": 91.7832
    },
    {
      "name": "Khulna",
      "lat": 22.8456,
      "lon": 89.5403
    },
    {
      "name": "Rajshahi",
      "lat": 24.3745,
      "lon": 88.6042
    },
    {
      "name": "Sylhet",
      "lat": 24.8949,
      "lon": 91.8687
    },
    {
      "name": "Barisal",
      "lat": 22.701,
      "lon": 90.3535
    },
    {
      "name": "Comilla",
      "lat": 23.4682,
      "lon": 91.1788
    }
  ],
  "BB": [
    {
      "name": "Bridgetown",
      "lat": 13.106,
      "lon": -59.6132
    },
    {
      "name": "Speightstown",
      "lat": 13.2503,
      "lon": -59.6433
    },
    {
      "name": "Oistins",
      "lat": 13.0706,
      "lon": -59.5442
    },
    {
      "name": "Bathsheba",
      "lat": 13.2114,
      "lon": -59.5247
    },
    {
      "name": "Holetown",
      "lat": 13.1867,
      "lon": -59.6381
    },
    {
      "name": "Crane",
      "lat": 13.1039,
      "lon": -59.4447
    }
  ],
  "BY": [
    {
      "name": "Minsk",
      "lat": 53.9006,
      "lon": 27.559
    },
    {
      "name": "Gomel",
      "lat": 52.4345,
      "lon": 30.9754
    },
    {
      "name": "Mogilev",
      "lat": 53.8981,
      "lon": 30.3325
    },
    {
      "name": "Vitebsk",
      "lat": 55.1904,
      "lon": 30.2049
    },
    {
      "name": "Grodno",
      "lat": 53.6693,
      "lon": 23.8131
    },
    {
      "name": "Brest",
      "lat": 52.0976,
      "lon": 23.7341
    }
  ],
  "BE": [
    {
      "name": "Brussels",
      "lat": 50.8503,
      "lon": 4.3517
    },
    {
      "name": "Antwerp",
      "lat": 51.2194,
      "lon": 4.4025
    },
    {
      "name": "Ghent",
      "lat": 51.0543,
      "lon": 3.7174
    },
    {
      "name": "Charleroi",
      "lat": 50.4108,
      "lon": 4.4446
    },
    {
      "name": "Liège",
      "lat": 50.6326,
      "lon": 5.5797
    },
    {
      "name": "Bruges",
      "lat": 51.2093,
      "lon": 3.2247
    },
    {
      "name": "Namur",
      "lat": 50.4674,
      "lon": 4.872
    }
  ],
  "BZ": [
    {
      "name": "Belize City",
      "lat": 17.5046,
      "lon": -88.1962
    },
    {
      "name": "San Ignacio",
      "lat": 17.1561,
      "lon": -89.0714
    },
    {
      "name": "Belmopan",
      "lat": 17.2514,
      "lon": -88.759
    },
    {
      "name": "Orange Walk Town",
      "lat": 18.0812,
      "lon": -88.5633
    },
    {
      "name": "San Pedro",
      "lat": 17.9214,
      "lon": -87.9611
    },
    {
      "name": "Corozal Town",
      "lat": 18.3938,
      "lon": -88.3886
    }
  ],
  "BJ": [
    {
      "name": "Cotonou",
      "lat": 6.3654,
      "lon": 2.4183
    },
    {
      "name": "Porto-Novo",
      "lat": 6.4969,
      "lon": 2.6289
    },
    {
      "name": "Parakou",
      "lat": 9.3372,
      "lon": 2.6303
    },
    {
      "name": "Godomey",
      "lat": 6.3883,
      "lon": 2.3364
    },
    {
      "name": "Abomey-Calavi",
      "lat": 6.4485,
      "lon": 2.3557
    },
    {
      "name": "Djougou",
      "lat": 9.7085,
      "lon": 1.666
    }
  ],
  "BT": [
    {
      "name": "Thimphu",
      "lat": 27.4728,
      "lon": 89.6393
    },
    {
      "name": "Phuntsholing",
      "lat": 26.8516,
      "lon": 89.3884
    },
    {
      "name": "Paro",
      "lat": 27.4287,
      "lon": 89.4164
    },
    {
      "name": "Gelephu",
      "lat": 26.8772,
      "lon": 90.4996
    },
    {
      "name": "Punakha",
      "lat": 27.5921,
      "lon": 89.8774
    },
    {
      "name": "Samdrup Jongkhar",
      "lat": 26.8007,
      "lon": 91.5052
    }
  ],
  "BO": [
    {
      "name": "Santa Cruz de la Sierra",
      "lat": -17.8146,
      "lon": -63.1561
    },
    {
      "name": "El Alto",
      "lat": -16.5048,
      "lon": -68.163
    },
    {
      "name": "La Paz",
      "lat": -16.4897,
      "lon": -68.1193
    },
    {
      "name": "Cochabamba",
      "lat": -17.3895,
      "lon": -66.1568
    },
    {
      "name": "Sucre",
      "lat": -19.0196,
      "lon": -65.2619
    },
    {
      "name": "Oruro",
      "lat": -17.9833,
      "lon": -67.15
    }
  ],
  "BA": [
    {
      "name": "Sarajevo",
      "lat": 43.8563,
      "lon": 18.4131
    },
    {
      "name": "Banja Luka",
      "lat": 44.7722,
      "lon": 17.191
    },
    {
      "name": "Tuzla",
      "lat": 44.5384,
      "lon": 18.6671
    },
    {
      "name": "Zenica",
      "lat": 44.2017,
      "lon": 17.904
    },
    {
      "name": "Mostar",
      "lat": 43.3438,
      "lon": 17.8078
    },
    {
      "name": "Bihać",
      "lat": 44.8169,
      "lon": 15.8708
    }
  ],
  "BW": [
    {
      "name": "Gaborone",
      "lat": -24.6282,
      "lon": 25.9231
    },
    {
      "name": "Francistown",
      "lat": -21.17,
      "lon": 27.51
    },
    {
      "name": "Molepolole",
      "lat": -24.4067,
      "lon": 25.4953
    },
    {
      "name": "Maun",
      "lat": -19.9833,
      "lon": 23.4167
    },
    {
      "name": "Serowe",
      "lat": -22.3833,
      "lon": 26.7167
    },
    {
      "name": "Kanye",
      "lat": -24.9667,
      "lon": 25.3333
    }
  ],
  "BR": [
    {
      "name": "São Paulo",
      "lat": -23.5505,
      "lon": -46.6333
    },
    {
      "name": "Rio de Janeiro",
      "lat": -22.9068,
      "lon": -43.1729
    },
    {
      "name": "Brasília",
      "lat": -15.7975,
      "lon": -47.8919
    },
    {
      "name": "Salvador",
      "lat": -12.9777,
      "lon": -38.5016
    },
    {
      "name": "Fortaleza",
      "lat": -3.7172,
      "lon": -38.5433
    },
    {
      "name": "Belo Horizonte",
      "lat": -19.9217,
      "lon": -43.9345
    },
    {
      "name": "Manaus",
      "lat": -3.119,
      "lon": -60.0217
    },
    {
      "name": "Curitiba",
      "lat": -25.4284,
      "lon": -49.2733
    }
  ],
  "BN": [
    {
      "name": "Bandar Seri Begawan",
      "lat": 4.9031,
      "lon": 114.9398
    },
    {
      "name": "Kuala Belait",
      "lat": 4.5836,
      "lon": 114.1831
    },
    {
      "name": "Seria",
      "lat": 4.6064,
      "lon": 114.3247
    },
    {
      "name": "Tutong",
      "lat": 4.8028,
      "lon": 114.6492
    },
    {
      "name": "Bangar",
      "lat": 4.7086,
      "lon": 115.0739
    },
    {
      "name": "Jerudong",
      "lat": 4.9458,
      "lon": 114.8394
    }
  ],
  "BG": [
    {
      "name": "Sofia",
      "lat": 42.6977,
      "lon": 23.3219
    },
    {
      "name": "Plovdiv",
      "lat": 42.1354,
      "lon": 24.7453
    },
    {
      "name": "Varna",
      "lat": 43.2141,
      "lon": 27.9147
    },
    {
      "name": "Burgas",
      "lat": 42.5048,
      "lon": 27.4626
    },
    {
      "name": "Ruse",
      "lat": 43.8356,
      "lon": 25.9657
    },
    {
      "name": "Stara Zagora",
      "lat": 42.4258,
      "lon": 25.6345
    }
  ],
  "BF": [
    {
      "name": "Ouagadougou",
      "lat": 12.3714,
      "lon": -1.5197
    },
    {
      "name": "Bobo-Dioulasso",
      "lat": 11.1772,
      "lon": -4.2979
    },
    {
      "name": "Koudougou",
      "lat": 12.25,
      "lon": -2.3667
    },
    {
      "name": "Ouahigouya",
      "lat": 13.5828,
      "lon": -2.4216
    },
    {
      "name": "Banfora",
      "lat": 10.6333,
      "lon": -4.7667
    },
    {
      "name": "Dédougou",
      "lat": 12.4667,
      "lon": -3.4667
    }
  ],
  "BI": [
    {
      "name": "Bujumbura",
      "lat": -3.3822,
      "lon": 29.3644
    },
    {
      "name": "Gitega",
      "lat": -3.4272,
      "lon": 29.9247
    },
    {
      "name": "Ngozi",
      "lat": -2.9075,
      "lon": 29.8306
    },
    {
      "name": "Rumonge",
      "lat": -3.9739,
      "lon": 29.4386
    },
    {
      "name": "Kayanza",
      "lat": -2.9222,
      "lon": 29.6292
    },
    {
      "name": "Bururi",
      "lat": -3.9489,
      "lon": 29.6244
    }
  ],
  "CV": [
    {
      "name": "Praia",
      "lat": 14.9315,
      "lon": -23.5125
    },
    {
      "name": "Mindelo",
      "lat": 16.8875,
      "lon": -24.9882
    },
    {
      "name": "Espargos",
      "lat": 16.7562,
      "lon": -22.9463
    },
    {
      "name": "Assomada",
      "lat": 15.1,
      "lon": -23.6833
    },
    {
      "name": "Porto Novo",
      "lat": 17.0197,
      "lon": -25.0647
    },
    {
      "name": "São Filipe",
      "lat": 14.8961,
      "lon": -24.4956
    }
  ],
  "KH": [
    {
      "name": "Phnom Penh",
      "lat": 11.5564,
      "lon": 104.9282
    },
    {
      "name": "Siem Reap",
      "lat": 13.3671,
      "lon": 103.8448
    },
    {
      "name": "Battambang",
      "lat": 13.0957,
      "lon": 103.2022
    },
    {
      "name": "Sihanoukville",
      "lat": 10.6274,
      "lon": 103.5221
    },
    {
      "name": "Poipet",
      "lat": 13.6561,
      "lon": 102.5644
    },
    {
      "name": "Kampong Cham",
      "lat": 11.9924,
      "lon": 105.4645
    }
  ],
  "CM": [
    {
      "name": "Douala",
      "lat": 4.0511,
      "lon": 9.7679
    },
    {
      "name": "Yaoundé",
      "lat": 3.848,
      "lon": 11.5021
    },
    {
      "name": "Bamenda",
      "lat": 5.9631,
      "lon": 10.1591
    },
    {
      "name": "Bafoussam",
      "lat": 5.4778,
      "lon": 10.4176
    },
    {
      "name": "Garoua",
      "lat": 9.3011,
      "lon": 13.3977
    },
    {
      "name": "Maroua",
      "lat": 10.5956,
      "lon": 14.3159
    }
  ],
  "CA": [
    {
      "name": "Toronto",
      "lat": 43.6532,
      "lon": -79.3832
    },
    {
      "name": "Montreal",
      "lat": 45.5017,
      "lon": -73.5673
    },
    {
      "name": "Vancouver",
      "lat": 49.2827,
      "lon": -123.1207
    },
    {
      "name": "Calgary",
      "lat": 51.0447,
      "lon": -114.0719
    },
    {
      "name": "Edmonton",
      "lat": 53.5461,
      "lon": -113.4938
    },
    {
      "name": "Ottawa",
      "lat": 45.4215,
      "lon": -75.6972
    },
    {
      "name": "Winnipeg",
      "lat": 49.8951,
      "lon": -97.1384
    },
    {
      "name": "Quebec City",
      "lat": 46.8139,
      "lon": -71.208
    }
  ],
  "CF": [
    {
      "name": "Bangui",
      "lat": 4.3947,
      "lon": 18.5582
    },
    {
      "name": "Bimbo",
      "lat": 4.2567,
      "lon": 18.5258
    },
    {
      "name": "Berbérati",
      "lat": 4.2612,
      "lon": 15.7922
    },
    {
      "name": "Carnot",
      "lat": 4.9427,
      "lon": 15.8672
    },
    {
      "name": "Bambari",
      "lat": 5.768,
      "lon": 20.6757
    },
    {
      "name": "Bouar",
      "lat": 5.934,
      "lon": 15.596
    }
  ],
  "TD": [
    {
      "name": "N'Djamena",
      "lat": 12.1348,
      "lon": 15.0557
    },
    {
      "name": "Moundou",
      "lat": 8.5667,
      "lon": 16.0833
    },
    {
      "name": "Sarh",
      "lat": 9.1429,
      "lon": 18.3923
    },
    {
      "name": "Abéché",
      "lat": 13.8292,
      "lon": 20.8322
    },
    {
      "name": "Kélo",
      "lat": 9.3078,
      "lon": 15.8066
    },
    {
      "name": "Koumra",
      "lat": 8.9126,
      "lon": 17.5539
    }
  ],
  "CL": [
    {
      "name": "Santiago",
      "lat": -33.4489,
      "lon": -70.6693
    },
    {
      "name": "Valparaíso",
      "lat": -33.0472,
      "lon": -71.6127
    },
    {
      "name": "Concepción",
      "lat": -36.8201,
      "lon": -73.0444
    },
    {
      "name": "La Serena",
      "lat": -29.9027,
      "lon": -71.2519
    },
    {
      "name": "Antofagasta",
      "lat": -23.6509,
      "lon": -70.3975
    },
    {
      "name": "Temuco",
      "lat": -38.7359,
      "lon": -72.5904
    },
    {
      "name": "Viña del Mar",
      "lat": -33.0246,
      "lon": -71.5518
    }
  ],
  "CN": [
    {
      "name": "Shanghai",
      "lat": 31.2304,
      "lon": 121.4737
    },
    {
      "name": "Beijing",
      "lat": 39.9042,
      "lon": 116.4074
    },
    {
      "name": "Guangzhou",
      "lat": 23.1291,
      "lon": 113.2644
    },
    {
      "name": "Shenzhen",
      "lat": 22.5431,
      "lon": 114.0579
    },
    {
      "name": "Chengdu",
      "lat": 30.5728,
      "lon": 104.0668
    },
    {
      "name": "Hangzhou",
      "lat": 30.2741,
      "lon": 120.1551
    },
    {
      "name": "Wuhan",
      "lat": 30.5928,
      "lon": 114.3055
    },
    {
      "name": "Xi'an",
      "lat": 34.3416,
      "lon": 108.9398
    }
  ],
  "CO": [
    {
      "name": "Bogotá",
      "lat": 4.711,
      "lon": -74.0721
    },
    {
      "name": "Medellín",
      "lat": 6.2442,
      "lon": -75.5812
    },
    {
      "name": "Cali",
      "lat": 3.4516,
      "lon": -76.532
    },
    {
      "name": "Barranquilla",
      "lat": 10.9685,
      "lon": -74.7813
    },
    {
      "name": "Cartagena",
      "lat": 10.391,
      "lon": -75.4794
    },
    {
      "name": "Cúcuta",
      "lat": 7.8939,
      "lon": -72.5078
    },
    {
      "name": "Bucaramanga",
      "lat": 7.1254,
      "lon": -73.1198
    }
  ],
  "KM": [
    {
      "name": "Moroni",
      "lat": -11.7172,
      "lon": 43.2473
    },
    {
      "name": "Mutsamudu",
      "lat": -12.1678,
      "lon": 44.3986
    },
    {
      "name": "Fomboni",
      "lat": -12.2814,
      "lon": 43.7425
    },
    {
      "name": "Domoni",
      "lat": -12.2569,
      "lon": 44.5319
    },
    {
      "name": "Mirontsi",
      "lat": -12.1553,
      "lon": 44.4097
    },
    {
      "name": "Sima",
      "lat": -12.1939,
      "lon": 44.2758
    }
  ],
  "CG": [
    {
      "name": "Brazzaville",
      "lat": -4.2634,
      "lon": 15.2429
    },
    {
      "name": "Pointe-Noire",
      "lat": -4.7975,
      "lon": 11.8503
    },
    {
      "name": "Dolisie",
      "lat": -4.1989,
      "lon": 12.6719
    },
    {
      "name": "Nkayi",
      "lat": -4.1833,
      "lon": 13.2833
    },
    {
      "name": "Kindamba",
      "lat": -3.9333,
      "lon": 14.5167
    },
    {
      "name": "Ouésso",
      "lat": 1.6136,
      "lon": 16.0517
    }
  ],
  "CR": [
    {
      "name": "San José",
      "lat": 9.9281,
      "lon": -84.0907
    },
    {
      "name": "Alajuela",
      "lat": 10.0163,
      "lon": -84.2116
    },
    {
      "name": "Cartago",
      "lat": 9.8644,
      "lon": -83.9194
    },
    {
      "name": "Heredia",
      "lat": 10.0024,
      "lon": -84.1165
    },
    {
      "name": "Liberia",
      "lat": 10.635,
      "lon": -85.4377
    },
    {
      "name": "Puntarenas",
      "lat": 9.9763,
      "lon": -84.8384
    }
  ],
  "HR": [
    {
      "name": "Zagreb",
      "lat": 45.815,
      "lon": 15.9819
    },
    {
      "name": "Split",
      "lat": 43.5081,
      "lon": 16.4402
    },
    {
      "name": "Rijeka",
      "lat": 45.3271,
      "lon": 14.4422
    },
    {
      "name": "Osijek",
      "lat": 45.555,
      "lon": 18.6955
    },
    {
      "name": "Zadar",
      "lat": 44.1194,
      "lon": 15.2314
    },
    {
      "name": "Dubrovnik",
      "lat": 42.6507,
      "lon": 18.0944
    }
  ],
  "CU": [
    {
      "name": "Havana",
      "lat": 23.1136,
      "lon": -82.3666
    },
    {
      "name": "Santiago de Cuba",
      "lat": 20.0208,
      "lon": -75.8267
    },
    {
      "name": "Camagüey",
      "lat": 21.3808,
      "lon": -77.9169
    },
    {
      "name": "Holguín",
      "lat": 20.8872,
      "lon": -76.2631
    },
    {
      "name": "Guantánamo",
      "lat": 20.1444,
      "lon": -75.2092
    },
    {
      "name": "Santa Clara",
      "lat": 22.4069,
      "lon": -79.9647
    }
  ],
  "CY": [
    {
      "name": "Nicosia",
      "lat": 35.1856,
      "lon": 33.3823
    },
    {
      "name": "Limassol",
      "lat": 34.7071,
      "lon": 33.0226
    },
    {
      "name": "Larnaca",
      "lat": 34.9167,
      "lon": 33.6292
    },
    {
      "name": "Paphos",
      "lat": 34.7754,
      "lon": 32.4218
    },
    {
      "name": "Famagusta",
      "lat": 35.125,
      "lon": 33.9417
    },
    {
      "name": "Kyrenia",
      "lat": 35.3403,
      "lon": 33.3192
    }
  ],
  "CZ": [
    {
      "name": "Prague",
      "lat": 50.0755,
      "lon": 14.4378
    },
    {
      "name": "Brno",
      "lat": 49.1951,
      "lon": 16.6068
    },
    {
      "name": "Ostrava",
      "lat": 49.8209,
      "lon": 18.2625
    },
    {
      "name": "Plzeň",
      "lat": 49.7384,
      "lon": 13.3736
    },
    {
      "name": "Liberec",
      "lat": 50.7663,
      "lon": 15.0543
    },
    {
      "name": "Olomouc",
      "lat": 49.5938,
      "lon": 17.2509
    }
  ],
  "CD": [
    {
      "name": "Kinshasa",
      "lat": -4.4419,
      "lon": 15.2663
    },
    {
      "name": "Lubumbashi",
      "lat": -11.6876,
      "lon": 27.5026
    },
    {
      "name": "Mbuji-Mayi",
      "lat": -6.15,
      "lon": 23.6
    },
    {
      "name": "Kananga",
      "lat": -5.8962,
      "lon": 22.4166
    },
    {
      "name": "Kisangani",
      "lat": 0.5153,
      "lon": 25.191
    },
    {
      "name": "Goma",
      "lat": -1.6585,
      "lon": 29.2205
    }
  ],
  "DK": [
    {
      "name": "Copenhagen",
      "lat": 55.6761,
      "lon": 12.5683
    },
    {
      "name": "Aarhus",
      "lat": 56.1629,
      "lon": 10.2039
    },
    {
      "name": "Odense",
      "lat": 55.4038,
      "lon": 10.4024
    },
    {
      "name": "Aalborg",
      "lat": 57.0488,
      "lon": 9.9217
    },
    {
      "name": "Esbjerg",
      "lat": 55.4703,
      "lon": 8.4519
    },
    {
      "name": "Randers",
      "lat": 56.4607,
      "lon": 10.0364
    }
  ],
  "DJ": [
    {
      "name": "Djibouti City",
      "lat": 11.5721,
      "lon": 43.1456
    },
    {
      "name": "Ali Sabieh",
      "lat": 11.1558,
      "lon": 42.7125
    },
    {
      "name": "Dikhil",
      "lat": 11.1114,
      "lon": 42.3731
    },
    {
      "name": "Tadjoura",
      "lat": 11.7853,
      "lon": 42.8833
    },
    {
      "name": "Obock",
      "lat": 11.9625,
      "lon": 43.2906
    },
    {
      "name": "Arta",
      "lat": 11.5239,
      "lon": 42.8469
    }
  ],
  "DM": [
    {
      "name": "Roseau",
      "lat": 15.3092,
      "lon": -61.3794
    },
    {
      "name": "Portsmouth",
      "lat": 15.5742,
      "lon": -61.4628
    },
    {
      "name": "Marigot",
      "lat": 15.5392,
      "lon": -61.2981
    },
    {
      "name": "Berekua",
      "lat": 15.2344,
      "lon": -61.3175
    },
    {
      "name": "Mahaut",
      "lat": 15.3639,
      "lon": -61.3972
    },
    {
      "name": "St. Joseph",
      "lat": 15.4042,
      "lon": -61.425
    }
  ],
  "DO": [
    {
      "name": "Santo Domingo",
      "lat": 18.4861,
      "lon": -69.9312
    },
    {
      "name": "Santiago de los Caballeros",
      "lat": 19.4517,
      "lon": -70.697
    },
    {
      "name": "Santo Domingo Este",
      "lat": 18.4883,
      "lon": -69.8571
    },
    {
      "name": "Santo Domingo Norte",
      "lat": 18.5303,
      "lon": -69.9042
    },
    {
      "name": "San Pedro de Macorís",
      "lat": 18.4539,
      "lon": -69.3086
    },
    {
      "name": "La Romana",
      "lat": 18.4273,
      "lon": -68.9728
    }
  ],
  "TL": [
    {
      "name": "Dili",
      "lat": -8.5586,
      "lon": 125.5736
    },
    {
      "name": "Baucau",
      "lat": -8.4711,
      "lon": 126.4583
    },
    {
      "name": "Maliana",
      "lat": -8.9917,
      "lon": 125.2197
    },
    {
      "name": "Suai",
      "lat": -9.3139,
      "lon": 125.2556
    },
    {
      "name": "Liquiçá",
      "lat": -8.5906,
      "lon": 125.3278
    },
    {
      "name": "Lospalos",
      "lat": -8.5222,
      "lon": 127.0019
    }
  ],
  "EC": [
    {
      "name": "Guayaquil",
      "lat": -2.1894,
      "lon": -79.8891
    },
    {
      "name": "Quito",
      "lat": -0.1807,
      "lon": -78.4678
    },
    {
      "name": "Cuenca",
      "lat": -2.9001,
      "lon": -79.0059
    },
    {
      "name": "Santo Domingo",
      "lat": -0.253,
      "lon": -79.1754
    },
    {
      "name": "Machala",
      "lat": -3.2586,
      "lon": -79.9553
    },
    {
      "name": "Manta",
      "lat": -0.9677,
      "lon": -80.7089
    }
  ],
  "EG": [
    {
      "name": "Cairo",
      "lat": 30.0444,
      "lon": 31.2357
    },
    {
      "name": "Alexandria",
      "lat": 31.2001,
      "lon": 29.9187
    },
    {
      "name": "Giza",
      "lat": 30.0131,
      "lon": 31.2089
    },
    {
      "name": "Shubra El Kheima",
      "lat": 30.1286,
      "lon": 31.2422
    },
    {
      "name": "Port Said",
      "lat": 31.2653,
      "lon": 32.3019
    },
    {
      "name": "Suez",
      "lat": 29.9668,
      "lon": 32.5498
    },
    {
      "name": "Luxor",
      "lat": 25.6872,
      "lon": 32.6396
    }
  ],
  "SV": [
    {
      "name": "San Salvador",
      "lat": 13.6929,
      "lon": -89.2182
    },
    {
      "name": "Soyapango",
      "lat": 13.7102,
      "lon": -89.1399
    },
    {
      "name": "Santa Ana",
      "lat": 13.9942,
      "lon": -89.5597
    },
    {
      "name": "San Miguel",
      "lat": 13.4833,
      "lon": -88.1833
    },
    {
      "name": "Mejicanos",
      "lat": 13.7408,
      "lon": -89.2131
    },
    {
      "name": "Santa Tecla",
      "lat": 13.6769,
      "lon": -89.2797
    }
  ],
  "GQ": [
    {
      "name": "Malabo",
      "lat": 3.7558,
      "lon": 8.7817
    },
    {
      "name": "Bata",
      "lat": 1.8639,
      "lon": 9.7658
    },
    {
      "name": "Ebebiyin",
      "lat": 2.1511,
      "lon": 11.3353
    },
    {
      "name": "Aconibe",
      "lat": 1.2961,
      "lon": 10.9369
    },
    {
      "name": "Añisoc",
      "lat": 1.8656,
      "lon": 10.7708
    },
    {
      "name": "Luba",
      "lat": 3.4569,
      "lon": 8.5547
    }
  ],
  "ER": [
    {
      "name": "Asmara",
      "lat": 15.3229,
      "lon": 38.9251
    },
    {
      "name": "Keren",
      "lat": 15.7778,
      "lon": 38.4583
    },
    {
      "name": "Massawa",
      "lat": 15.6097,
      "lon": 39.45
    },
    {
      "name": "Assab",
      "lat": 13.0092,
      "lon": 42.7394
    },
    {
      "name": "Mendefera",
      "lat": 14.8878,
      "lon": 38.8153
    },
    {
      "name": "Barentu",
      "lat": 15.1147,
      "lon": 37.5928
    }
  ],
  "EE": [
    {
      "name": "Tallinn",
      "lat": 59.437,
      "lon": 24.7536
    },
    {
      "name": "Tartu",
      "lat": 58.378,
      "lon": 26.729
    },
    {
      "name": "Narva",
      "lat": 59.3797,
      "lon": 28.1791
    },
    {
      "name": "Pärnu",
      "lat": 58.3859,
      "lon": 24.4971
    },
    {
      "name": "Kohtla-Järve",
      "lat": 59.4022,
      "lon": 27.2794
    },
    {
      "name": "Viljandi",
      "lat": 58.3639,
      "lon": 25.59
    }
  ],
  "SZ": [
    {
      "name": "Manzini",
      "lat": -26.4988,
      "lon": 31.3804
    },
    {
      "name": "Mbabane",
      "lat": -26.3055,
      "lon": 31.1367
    },
    {
      "name": "Big Bend",
      "lat": -26.8167,
      "lon": 31.9333
    },
    {
      "name": "Malkerns",
      "lat": -26.5667,
      "lon": 31.1833
    },
    {
      "name": "Nhlangano",
      "lat": -27.1167,
      "lon": 31.2
    },
    {
      "name": "Siteki",
      "lat": -26.45,
      "lon": 31.95
    }
  ],
  "ET": [
    {
      "name": "Addis Ababa",
      "lat": 9.032,
      "lon": 38.7469
    },
    {
      "name": "Dire Dawa",
      "lat": 9.5931,
      "lon": 41.8661
    },
    {
      "name": "Mekelle",
      "lat": 13.4967,
      "lon": 39.4753
    },
    {
      "name": "Gondar",
      "lat": 12.6,
      "lon": 37.4667
    },
    {
      "name": "Hawassa",
      "lat": 7.05,
      "lon": 38.4667
    },
    {
      "name": "Bahir Dar",
      "lat": 11.5936,
      "lon": 37.3908
    }
  ],
  "FJ": [
    {
      "name": "Suva",
      "lat": -18.1416,
      "lon": 178.4419
    },
    {
      "name": "Lautoka",
      "lat": -17.6167,
      "lon": 177.4667
    },
    {
      "name": "Nadi",
      "lat": -17.8,
      "lon": 177.4167
    },
    {
      "name": "Labasa",
      "lat": -16.4333,
      "lon": 179.3667
    },
    {
      "name": "Ba",
      "lat": -17.5333,
      "lon": 177.6833
    },
    {
      "name": "Lami",
      "lat": -18.1167,
      "lon": 178.4167
    }
  ],
  "FI": [
    {
      "name": "Helsinki",
      "lat": 60.1699,
      "lon": 24.9384
    },
    {
      "name": "Espoo",
      "lat": 60.2055,
      "lon": 24.6559
    },
    {
      "name": "Tampere",
      "lat": 61.4978,
      "lon": 23.761
    },
    {
      "name": "Vantaa",
      "lat": 60.2934,
      "lon": 25.0378
    },
    {
      "name": "Oulu",
      "lat": 65.0121,
      "lon": 25.4651
    },
    {
      "name": "Turku",
      "lat": 60.4518,
      "lon": 22.2666
    }
  ],
  "FR": [
    {
      "name": "Paris",
      "lat": 48.8566,
      "lon": 2.3522
    },
    {
      "name": "Marseille",
      "lat": 43.2965,
      "lon": 5.3698
    },
    {
      "name": "Lyon",
      "lat": 45.764,
      "lon": 4.8357
    },
    {
      "name": "Toulouse",
      "lat": 43.6047,
      "lon": 1.4442
    },
    {
      "name": "Nice",
      "lat": 43.7102,
      "lon": 7.262
    },
    {
      "name": "Nantes",
      "lat": 47.2184,
      "lon": -1.5536
    },
    {
      "name": "Strasbourg",
      "lat": 48.5734,
      "lon": 7.7521
    },
    {
      "name": "Bordeaux",
      "lat": 44.8378,
      "lon": -0.5792
    }
  ],
  "GA": [
    {
      "name": "Libreville",
      "lat": 0.4162,
      "lon": 9.4673
    },
    {
      "name": "Port-Gentil",
      "lat": -0.7193,
      "lon": 8.7815
    },
    {
      "name": "Franceville",
      "lat": -1.6333,
      "lon": 13.5833
    },
    {
      "name": "Oyem",
      "lat": 1.5997,
      "lon": 11.5794
    },
    {
      "name": "Moanda",
      "lat": -1.5667,
      "lon": 13.2
    },
    {
      "name": "Mouila",
      "lat": -1.8683,
      "lon": 11.0558
    }
  ],
  "GM": [
    {
      "name": "Banjul",
      "lat": 13.4549,
      "lon": -16.579
    },
    {
      "name": "Serekunda",
      "lat": 13.4383,
      "lon": -16.6781
    },
    {
      "name": "Brikama",
      "lat": 13.2714,
      "lon": -16.6494
    },
    {
      "name": "Bakau",
      "lat": 13.4781,
      "lon": -16.6819
    },
    {
      "name": "Farafenni",
      "lat": 13.5667,
      "lon": -15.6
    },
    {
      "name": "Lamin",
      "lat": 13.3875,
      "lon": -16.6417
    }
  ],
  "GE": [
    {
      "name": "Tbilisi",
      "lat": 41.7151,
      "lon": 44.8271
    },
    {
      "name": "Batumi",
      "lat": 41.6416,
      "lon": 41.6359
    },
    {
      "name": "Kutaisi",
      "lat": 42.2679,
      "lon": 42.6946
    },
    {
      "name": "Rustavi",
      "lat": 41.5495,
      "lon": 44.9932
    },
    {
      "name": "Gori",
      "lat": 41.9842,
      "lon": 44.1158
    },
    {
      "name": "Zugdidi",
      "lat": 42.5088,
      "lon": 41.8709
    }
  ],
  "DE": [
    {
      "name": "Berlin",
      "lat": 52.52,
      "lon": 13.405
    },
    {
      "name": "Hamburg",
      "lat": 53.5511,
      "lon": 9.9937
    },
    {
      "name": "Munich",
      "lat": 48.1351,
      "lon": 11.582
    },
    {
      "name": "Cologne",
      "lat": 50.9375,
      "lon": 6.9603
    },
    {
      "name": "Frankfurt",
      "lat": 50.1109,
      "lon": 8.6821
    },
    {
      "name": "Stuttgart",
      "lat": 48.7758,
      "lon": 9.1829
    },
    {
      "name": "Düsseldorf",
      "lat": 51.2277,
      "lon": 6.7735
    },
    {
      "name": "Leipzig",
      "lat": 51.3397,
      "lon": 12.3731
    }
  ],
  "GH": [
    {
      "name": "Accra",
      "lat": 5.6037,
      "lon": -0.187
    },
    {
      "name": "Kumasi",
      "lat": 6.6885,
      "lon": -1.6244
    },
    {
      "name": "Tamale",
      "lat": 9.4008,
      "lon": -0.8393
    },
    {
      "name": "Sekondi-Takoradi",
      "lat": 4.934,
      "lon": -1.7706
    },
    {
      "name": "Sunyani",
      "lat": 7.3399,
      "lon": -2.3268
    },
    {
      "name": "Cape Coast",
      "lat": 5.1053,
      "lon": -1.2466
    }
  ],
  "GR": [
    {
      "name": "Athens",
      "lat": 37.9838,
      "lon": 23.7275
    },
    {
      "name": "Thessaloniki",
      "lat": 40.6401,
      "lon": 22.9444
    },
    {
      "name": "Patras",
      "lat": 38.2466,
      "lon": 21.7346
    },
    {
      "name": "Heraklion",
      "lat": 35.3387,
      "lon": 25.1442
    },
    {
      "name": "Larissa",
      "lat": 39.639,
      "lon": 22.4191
    },
    {
      "name": "Volos",
      "lat": 39.3622,
      "lon": 22.9422
    }
  ],
  "GD": [
    {
      "name": "St. George's",
      "lat": 12.0561,
      "lon": -61.7486
    },
    {
      "name": "Gouyave",
      "lat": 12.1647,
      "lon": -61.7297
    },
    {
      "name": "Grenville",
      "lat": 12.1167,
      "lon": -61.6167
    },
    {
      "name": "Victoria",
      "lat": 12.1903,
      "lon": -61.7067
    },
    {
      "name": "Sauteurs",
      "lat": 12.2197,
      "lon": -61.6392
    },
    {
      "name": "Hillsborough",
      "lat": 12.4833,
      "lon": -61.45
    }
  ],
  "GT": [
    {
      "name": "Guatemala City",
      "lat": 14.6349,
      "lon": -90.5069
    },
    {
      "name": "Mixco",
      "lat": 14.6331,
      "lon": -90.6064
    },
    {
      "name": "Villa Nueva",
      "lat": 14.5256,
      "lon": -90.5881
    },
    {
      "name": "Quetzaltenango",
      "lat": 14.8347,
      "lon": -91.5181
    },
    {
      "name": "Escuintla",
      "lat": 14.3009,
      "lon": -90.785
    },
    {
      "name": "Chinautla",
      "lat": 14.7142,
      "lon": -90.5
    }
  ],
  "GN": [
    {
      "name": "Conakry",
      "lat": 9.6412,
      "lon": -13.5784
    },
    {
      "name": "Nzérékoré",
      "lat": 7.7562,
      "lon": -8.8179
    },
    {
      "name": "Kankan",
      "lat": 10.3854,
      "lon": -9.3057
    },
    {
      "name": "Kindia",
      "lat": 10.0569,
      "lon": -12.8658
    },
    {
      "name": "Labé",
      "lat": 11.3182,
      "lon": -12.2833
    },
    {
      "name": "Mamou",
      "lat": 10.3756,
      "lon": -12.0911
    }
  ],
  "GW": [
    {
      "name": "Bissau",
      "lat": 11.8632,
      "lon": -15.5977
    },
    {
      "name": "Bafatá",
      "lat": 12.1667,
      "lon": -14.65
    },
    {
      "name": "Gabú",
      "lat": 12.2833,
      "lon": -14.2167
    },
    {
      "name": "Bissora",
      "lat": 12.2231,
      "lon": -15.4475
    },
    {
      "name": "Bolama",
      "lat": 11.5769,
      "lon": -15.4764
    },
    {
      "name": "Cacheu",
      "lat": 12.2742,
      "lon": -16.1653
    }
  ],
  "GY": [
    {
      "name": "Georgetown",
      "lat": 6.8013,
      "lon": -58.1551
    },
    {
      "name": "Linden",
      "lat": 6.0097,
      "lon": -58.3075
    },
    {
      "name": "New Amsterdam",
      "lat": 6.2486,
      "lon": -57.5186
    },
    {
      "name": "Anna Regina",
      "lat": 7.2644,
      "lon": -58.5078
    },
    {
      "name": "Bartica",
      "lat": 6.4069,
      "lon": -58.6214
    },
    {
      "name": "Skeldon",
      "lat": 5.8833,
      "lon": -57.1333
    }
  ],
  "HT": [
    {
      "name": "Port-au-Prince",
      "lat": 18.5944,
      "lon": -72.3074
    },
    {
      "name": "Carrefour",
      "lat": 18.5411,
      "lon": -72.3992
    },
    {
      "name": "Delmas",
      "lat": 18.5458,
      "lon": -72.3022
    },
    {
      "name": "Cap-Haïtien",
      "lat": 19.7578,
      "lon": -72.2042
    },
    {
      "name": "Pétion-Ville",
      "lat": 18.5125,
      "lon": -72.2853
    },
    {
      "name": "Gonaïves",
      "lat": 19.45,
      "lon": -72.6833
    }
  ],
  "VA": [
    {
      "name": "Vatican City",
      "lat": 41.9029,
      "lon": 12.4534
    }
  ],
  "HN": [
    {
      "name": "Tegucigalpa",
      "lat": 14.0723,
      "lon": -87.1921
    },
    {
      "name": "San Pedro Sula",
      "lat": 15.5042,
      "lon": -88.025
    },
    {
      "name": "Choloma",
      "lat": 15.6144,
      "lon": -87.9531
    },
    {
      "name": "La Ceiba",
      "lat": 15.7835,
      "lon": -86.7831
    },
    {
      "name": "El Progreso",
      "lat": 15.4,
      "lon": -87.8
    },
    {
      "name": "Comayagua",
      "lat": 14.45,
      "lon": -87.6333
    }
  ],
  "HU": [
    {
      "name": "Budapest",
      "lat": 47.4979,
      "lon": 19.0402
    },
    {
      "name": "Debrecen",
      "lat": 47.5316,
      "lon": 21.6273
    },
    {
      "name": "Szeged",
      "lat": 46.253,
      "lon": 20.1414
    },
    {
      "name": "Miskolc",
      "lat": 48.1035,
      "lon": 20.7784
    },
    {
      "name": "Pécs",
      "lat": 46.0727,
      "lon": 18.2323
    },
    {
      "name": "Győr",
      "lat": 47.6875,
      "lon": 17.6504
    }
  ],
  "IS": [
    {
      "name": "Reykjavik",
      "lat": 64.1466,
      "lon": -21.9426
    },
    {
      "name": "Kópavogur",
      "lat": 64.1123,
      "lon": -21.9069
    },
    {
      "name": "Hafnarfjörður",
      "lat": 64.0671,
      "lon": -21.95
    },
    {
      "name": "Akureyri",
      "lat": 65.6835,
      "lon": -18.0878
    },
    {
      "name": "Reykjanesbær",
      "lat": 64.0006,
      "lon": -22.5589
    },
    {
      "name": "Garðabær",
      "lat": 64.0883,
      "lon": -21.9283
    }
  ],
  "IN": [
    {
      "name": "Mumbai",
      "lat": 19.076,
      "lon": 72.8777
    },
    {
      "name": "Delhi",
      "lat": 28.7041,
      "lon": 77.1025
    },
    {
      "name": "Bengaluru",
      "lat": 12.9716,
      "lon": 77.5946
    },
    {
      "name": "Hyderabad",
      "lat": 17.385,
      "lon": 78.4867
    },
    {
      "name": "Ahmedabad",
      "lat": 23.0225,
      "lon": 72.5714
    },
    {
      "name": "Chennai",
      "lat": 13.0827,
      "lon": 80.2707
    },
    {
      "name": "Kolkata",
      "lat": 22.5726,
      "lon": 88.3639
    },
    {
      "name": "Pune",
      "lat": 18.5204,
      "lon": 73.8567
    }
  ],
  "ID": [
    {
      "name": "Jakarta",
      "lat": -6.2088,
      "lon": 106.8456
    },
    {
      "name": "Surabaya",
      "lat": -7.2575,
      "lon": 112.7521
    },
    {
      "name": "Bandung",
      "lat": -6.9175,
      "lon": 107.6191
    },
    {
      "name": "Medan",
      "lat": 3.5952,
      "lon": 98.6722
    },
    {
      "name": "Bekasi",
      "lat": -6.2383,
      "lon": 106.9756
    },
    {
      "name": "Semarang",
      "lat": -6.9667,
      "lon": 110.4167
    },
    {
      "name": "Makassar",
      "lat": -5.1477,
      "lon": 119.4327
    }
  ],
  "IR": [
    {
      "name": "Tehran",
      "lat": 35.6892,
      "lon": 51.389
    },
    {
      "name": "Mashhad",
      "lat": 36.2605,
      "lon": 59.6168
    },
    {
      "name": "Isfahan",
      "lat": 32.6546,
      "lon": 51.668
    },
    {
      "name": "Karaj",
      "lat": 35.84,
      "lon": 50.9391
    },
    {
      "name": "Shiraz",
      "lat": 29.5918,
      "lon": 52.5837
    },
    {
      "name": "Tabriz",
      "lat": 38.08,
      "lon": 46.2919
    }
  ],
  "IQ": [
    {
      "name": "Baghdad",
      "lat": 33.3152,
      "lon": 44.3661
    },
    {
      "name": "Basra",
      "lat": 30.5081,
      "lon": 47.7835
    },
    {
      "name": "Mosul",
      "lat": 36.34,
      "lon": 43.13
    },
    {
      "name": "Erbil",
      "lat": 36.1901,
      "lon": 43.993
    },
    {
      "name": "Kirkuk",
      "lat": 35.4681,
      "lon": 44.3922
    },
    {
      "name": "Najaf",
      "lat": 32.0,
      "lon": 44.3333
    }
  ],
  "IE": [
    {
      "name": "Dublin",
      "lat": 53.3498,
      "lon": -6.2603
    },
    {
      "name": "Cork",
      "lat": 51.8985,
      "lon": -8.4756
    },
    {
      "name": "Limerick",
      "lat": 52.6638,
      "lon": -8.6267
    },
    {
      "name": "Galway",
      "lat": 53.2707,
      "lon": -9.0568
    },
    {
      "name": "Waterford",
      "lat": 52.2593,
      "lon": -7.1101
    },
    {
      "name": "Drogheda",
      "lat": 53.7189,
      "lon": -6.3478
    }
  ],
  "IL": [
    {
      "name": "Jerusalem",
      "lat": 31.7683,
      "lon": 35.2137
    },
    {
      "name": "Tel Aviv",
      "lat": 32.0853,
      "lon": 34.7818
    },
    {
      "name": "Haifa",
      "lat": 32.794,
      "lon": 34.9896
    },
    {
      "name": "Rishon LeZion",
      "lat": 31.973,
      "lon": 34.7925
    },
    {
      "name": "Petah Tikva",
      "lat": 32.084,
      "lon": 34.8878
    },
    {
      "name": "Ashdod",
      "lat": 31.8044,
      "lon": 34.6553
    }
  ],
  "IT": [
    {
      "name": "Rome",
      "lat": 41.9028,
      "lon": 12.4964
    },
    {
      "name": "Milan",
      "lat": 45.4642,
      "lon": 9.19
    },
    {
      "name": "Naples",
      "lat": 40.8518,
      "lon": 14.2681
    },
    {
      "name": "Turin",
      "lat": 45.0703,
      "lon": 7.6869
    },
    {
      "name": "Palermo",
      "lat": 38.1157,
      "lon": 13.3615
    },
    {
      "name": "Genoa",
      "lat": 44.4056,
      "lon": 8.9463
    },
    {
      "name": "Bologna",
      "lat": 44.4949,
      "lon": 11.3426
    },
    {
      "name": "Florence",
      "lat": 43.7696,
      "lon": 11.2558
    }
  ],
  "CI": [
    {
      "name": "Abidjan",
      "lat": 5.36,
      "lon": -4.0083
    },
    {
      "name": "Bouaké",
      "lat": 7.6906,
      "lon": -5.03
    },
    {
      "name": "Daloa",
      "lat": 6.8774,
      "lon": -6.4502
    },
    {
      "name": "Yamoussoukro",
      "lat": 6.8276,
      "lon": -5.2893
    },
    {
      "name": "San-Pédro",
      "lat": 4.7485,
      "lon": -6.6363
    },
    {
      "name": "Korhogo",
      "lat": 9.458,
      "lon": -5.6296
    }
  ],
  "JM": [
    {
      "name": "Kingston",
      "lat": 17.9712,
      "lon": -76.7928
    },
    {
      "name": "Portmore",
      "lat": 17.9714,
      "lon": -76.8833
    },
    {
      "name": "Spanish Town",
      "lat": 17.9914,
      "lon": -76.9542
    },
    {
      "name": "Montego Bay",
      "lat": 18.4714,
      "lon": -77.9228
    },
    {
      "name": "May Pen",
      "lat": 17.9644,
      "lon": -77.2458
    },
    {
      "name": "Mandeville",
      "lat": 18.0419,
      "lon": -77.5072
    }
  ],
  "JP": [
    {
      "name": "Tokyo",
      "lat": 35.6762,
      "lon": 139.6503
    },
    {
      "name": "Yokohama",
      "lat": 35.4437,
      "lon": 139.638
    },
    {
      "name": "Osaka",
      "lat": 34.6937,
      "lon": 135.5023
    },
    {
      "name": "Nagoya",
      "lat": 35.1815,
      "lon": 136.9066
    },
    {
      "name": "Sapporo",
      "lat": 43.0618,
      "lon": 141.3545
    },
    {
      "name": "Fukuoka",
      "lat": 33.5904,
      "lon": 130.4017
    },
    {
      "name": "Kobe",
      "lat": 34.6901,
      "lon": 135.1955
    },
    {
      "name": "Kyoto",
      "lat": 35.0116,
      "lon": 135.7681
    }
  ],
  "JO": [
    {
      "name": "Amman",
      "lat": 31.9454,
      "lon": 35.9284
    },
    {
      "name": "Zarqa",
      "lat": 32.0728,
      "lon": 36.088
    },
    {
      "name": "Irbid",
      "lat": 32.5556,
      "lon": 35.85
    },
    {
      "name": "Russeifa",
      "lat": 32.0178,
      "lon": 36.0464
    },
    {
      "name": "Aqaba",
      "lat": 29.5267,
      "lon": 35.0078
    },
    {
      "name": "Madaba",
      "lat": 31.7167,
      "lon": 35.7936
    }
  ],
  "KZ": [
    {
      "name": "Almaty",
      "lat": 43.222,
      "lon": 76.8512
    },
    {
      "name": "Astana",
      "lat": 51.1694,
      "lon": 71.4491
    },
    {
      "name": "Shymkent",
      "lat": 42.3417,
      "lon": 69.5901
    },
    {
      "name": "Aktobe",
      "lat": 50.2839,
      "lon": 57.167
    },
    {
      "name": "Karaganda",
      "lat": 49.8019,
      "lon": 73.1021
    },
    {
      "name": "Taraz",
      "lat": 42.9,
      "lon": 71.3667
    }
  ],
  "KE": [
    {
      "name": "Nairobi",
      "lat": -1.2921,
      "lon": 36.8219
    },
    {
      "name": "Mombasa",
      "lat": -4.0435,
      "lon": 39.6682
    },
    {
      "name": "Kisumu",
      "lat": -0.0917,
      "lon": 34.768
    },
    {
      "name": "Nakuru",
      "lat": -0.3031,
      "lon": 36.08
    },
    {
      "name": "Eldoret",
      "lat": 0.5143,
      "lon": 35.2698
    },
    {
      "name": "Thika",
      "lat": -1.0333,
      "lon": 37.0694
    }
  ],
  "KI": [
    {
      "name": "South Tarawa",
      "lat": 1.33,
      "lon": 172.98
    },
    {
      "name": "Betio",
      "lat": 1.3581,
      "lon": 172.9211
    },
    {
      "name": "Bikenibeu",
      "lat": 1.3642,
      "lon": 173.1239
    },
    {
      "name": "Teaoraereke",
      "lat": 1.3325,
      "lon": 173.0119
    },
    {
      "name": "Eita",
      "lat": 1.3619,
      "lon": 173.0806
    },
    {
      "name": "Tabiang",
      "lat": -1.3333,
      "lon": 176.0167
    }
  ],
  "KW": [
    {
      "name": "Kuwait City",
      "lat": 29.3759,
      "lon": 47.9774
    },
    {
      "name": "Al Ahmadi",
      "lat": 29.0769,
      "lon": 48.0839
    },
    {
      "name": "Hawalli",
      "lat": 29.3328,
      "lon": 48.0289
    },
    {
      "name": "Salmiya",
      "lat": 29.3344,
      "lon": 48.0758
    },
    {
      "name": "Sabah Al Salem",
      "lat": 29.2536,
      "lon": 48.0578
    },
    {
      "name": "Al Farwaniyah",
      "lat": 29.2778,
      "lon": 47.9589
    }
  ],
  "KG": [
    {
      "name": "Bishkek",
      "lat": 42.8746,
      "lon": 74.5698
    },
    {
      "name": "Osh",
      "lat": 40.514,
      "lon": 72.8161
    },
    {
      "name": "Jalal-Abad",
      "lat": 40.9333,
      "lon": 72.9833
    },
    {
      "name": "Karakol",
      "lat": 42.4907,
      "lon": 78.3936
    },
    {
      "name": "Tokmok",
      "lat": 42.8419,
      "lon": 75.3015
    },
    {
      "name": "Uzgen",
      "lat": 40.7667,
      "lon": 73.3
    }
  ],
  "LA": [
    {
      "name": "Vientiane",
      "lat": 17.9757,
      "lon": 102.6331
    },
    {
      "name": "Pakse",
      "lat": 15.1202,
      "lon": 105.7989
    },
    {
      "name": "Savannakhet",
      "lat": 16.5566,
      "lon": 104.7508
    },
    {
      "name": "Luang Prabang",
      "lat": 19.8856,
      "lon": 102.1347
    },
    {
      "name": "Thakhek",
      "lat": 17.4103,
      "lon": 104.8306
    },
    {
      "name": "Xam Neua",
      "lat": 20.4167,
      "lon": 104.05
    }
  ],
  "LV": [
    {
      "name": "Riga",
      "lat": 56.9496,
      "lon": 24.1052
    },
    {
      "name": "Daugavpils",
      "lat": 55.8747,
      "lon": 26.5362
    },
    {
      "name": "Liepāja",
      "lat": 56.5047,
      "lon": 21.0108
    },
    {
      "name": "Jelgava",
      "lat": 56.65,
      "lon": 23.7167
    },
    {
      "name": "Jūrmala",
      "lat": 56.968,
      "lon": 23.7704
    },
    {
      "name": "Ventspils",
      "lat": 57.3949,
      "lon": 21.5647
    }
  ],
  "LB": [
    {
      "name": "Beirut",
      "lat": 33.8938,
      "lon": 35.5018
    },
    {
      "name": "Tripoli",
      "lat": 34.4367,
      "lon": 35.8497
    },
    {
      "name": "Sidon",
      "lat": 33.5631,
      "lon": 35.3689
    },
    {
      "name": "Tyre",
      "lat": 33.2706,
      "lon": 35.2039
    },
    {
      "name": "Nabatieh",
      "lat": 33.3789,
      "lon": 35.4839
    },
    {
      "name": "Jounieh",
      "lat": 33.9808,
      "lon": 35.6178
    }
  ],
  "LS": [
    {
      "name": "Maseru",
      "lat": -29.3151,
      "lon": 27.4869
    },
    {
      "name": "Teyateyaneng",
      "lat": -29.15,
      "lon": 27.75
    },
    {
      "name": "Mafeteng",
      "lat": -29.8167,
      "lon": 27.2333
    },
    {
      "name": "Hlotse",
      "lat": -28.8719,
      "lon": 28.045
    },
    {
      "name": "Mohale's Hoek",
      "lat": -30.15,
      "lon": 27.4667
    },
    {
      "name": "Qacha's Nek",
      "lat": -30.1154,
      "lon": 28.6894
    }
  ],
  "LR": [
    {
      "name": "Monrovia",
      "lat": 6.3005,
      "lon": -10.7969
    },
    {
      "name": "Gbarnga",
      "lat": 7.0097,
      "lon": -9.4719
    },
    {
      "name": "Buchanan",
      "lat": 5.8808,
      "lon": -10.0447
    },
    {
      "name": "Ganta",
      "lat": 7.2367,
      "lon": -8.9839
    },
    {
      "name": "Kakata",
      "lat": 6.5317,
      "lon": -10.3536
    },
    {
      "name": "Zwedru",
      "lat": 6.0717,
      "lon": -8.1281
    }
  ],
  "LY": [
    {
      "name": "Tripoli",
      "lat": 32.8872,
      "lon": 13.1913
    },
    {
      "name": "Benghazi",
      "lat": 32.1167,
      "lon": 20.0667
    },
    {
      "name": "Misrata",
      "lat": 32.3754,
      "lon": 15.0925
    },
    {
      "name": "Bayda",
      "lat": 32.7628,
      "lon": 21.755
    },
    {
      "name": "Zawiya",
      "lat": 32.7522,
      "lon": 12.7278
    },
    {
      "name": "Tobruk",
      "lat": 32.0836,
      "lon": 23.9764
    }
  ],
  "LI": [
    {
      "name": "Vaduz",
      "lat": 47.1415,
      "lon": 9.5215
    },
    {
      "name": "Schaan",
      "lat": 47.1664,
      "lon": 9.5106
    },
    {
      "name": "Balzers",
      "lat": 47.0674,
      "lon": 9.5039
    },
    {
      "name": "Triesen",
      "lat": 47.1081,
      "lon": 9.5247
    },
    {
      "name": "Eschen",
      "lat": 47.2117,
      "lon": 9.5222
    }
  ],
  "LT": [
    {
      "name": "Vilnius",
      "lat": 54.6872,
      "lon": 25.2797
    },
    {
      "name": "Kaunas",
      "lat": 54.8985,
      "lon": 23.9036
    },
    {
      "name": "Klaipėda",
      "lat": 55.7033,
      "lon": 21.1443
    },
    {
      "name": "Šiauliai",
      "lat": 55.9349,
      "lon": 23.3137
    },
    {
      "name": "Panevėžys",
      "lat": 55.7348,
      "lon": 24.3575
    },
    {
      "name": "Alytus",
      "lat": 54.3964,
      "lon": 24.0459
    }
  ],
  "LU": [
    {
      "name": "Luxembourg City",
      "lat": 49.6116,
      "lon": 6.1319
    },
    {
      "name": "Esch-sur-Alzette",
      "lat": 49.4958,
      "lon": 5.9806
    },
    {
      "name": "Differdange",
      "lat": 49.5242,
      "lon": 5.8911
    },
    {
      "name": "Dudelange",
      "lat": 49.48,
      "lon": 6.0842
    },
    {
      "name": "Ettelbruck",
      "lat": 49.8475,
      "lon": 6.1042
    },
    {
      "name": "Diekirch",
      "lat": 49.8678,
      "lon": 6.1558
    }
  ],
  "MG": [
    {
      "name": "Antananarivo",
      "lat": -18.8792,
      "lon": 47.5079
    },
    {
      "name": "Toamasina",
      "lat": -18.1492,
      "lon": 49.4023
    },
    {
      "name": "Antsirabe",
      "lat": -19.8659,
      "lon": 47.0333
    },
    {
      "name": "Mahajanga",
      "lat": -15.7167,
      "lon": 46.3167
    },
    {
      "name": "Fianarantsoa",
      "lat": -21.4536,
      "lon": 47.0858
    },
    {
      "name": "Toliara",
      "lat": -23.35,
      "lon": 43.6667
    }
  ],
  "MW": [
    {
      "name": "Lilongwe",
      "lat": -13.9626,
      "lon": 33.7741
    },
    {
      "name": "Blantyre",
      "lat": -15.7861,
      "lon": 35.0058
    },
    {
      "name": "Mzuzu",
      "lat": -11.4581,
      "lon": 34.0151
    },
    {
      "name": "Zomba",
      "lat": -15.3833,
      "lon": 35.3333
    },
    {
      "name": "Kasungu",
      "lat": -13.0333,
      "lon": 33.4833
    },
    {
      "name": "Mangochi",
      "lat": -14.4782,
      "lon": 35.2645
    }
  ],
  "MY": [
    {
      "name": "Kuala Lumpur",
      "lat": 3.139,
      "lon": 101.6869
    },
    {
      "name": "George Town",
      "lat": 5.4141,
      "lon": 100.3288
    },
    {
      "name": "Johor Bahru",
      "lat": 1.4927,
      "lon": 103.7414
    },
    {
      "name": "Ipoh",
      "lat": 4.5975,
      "lon": 101.0901
    },
    {
      "name": "Kuching",
      "lat": 1.5533,
      "lon": 110.3592
    },
    {
      "name": "Kota Kinabalu",
      "lat": 5.9804,
      "lon": 116.0735
    },
    {
      "name": "Shah Alam",
      "lat": 3.0738,
      "lon": 101.5183
    }
  ],
  "MV": [
    {
      "name": "Malé",
      "lat": 4.1755,
      "lon": 73.5093
    },
    {
      "name": "Addu City",
      "lat": -0.63,
      "lon": 73.16
    },
    {
      "name": "Fuvahmulah",
      "lat": -0.2988,
      "lon": 73.424
    },
    {
      "name": "Kulhudhuffushi",
      "lat": 6.6222,
      "lon": 73.07
    },
    {
      "name": "Thinadhoo",
      "lat": 0.5333,
      "lon": 72.9961
    },
    {
      "name": "Naifaru",
      "lat": 5.4444,
      "lon": 73.3657
    }
  ],
  "ML": [
    {
      "name": "Bamako",
      "lat": 12.6392,
      "lon": -8.0029
    },
    {
      "name": "Sikasso",
      "lat": 11.3176,
      "lon": -5.6665
    },
    {
      "name": "Mopti",
      "lat": 14.4843,
      "lon": -4.1829
    },
    {
      "name": "Koutiala",
      "lat": 12.3917,
      "lon": -5.4642
    },
    {
      "name": "Ségou",
      "lat": 13.4317,
      "lon": -6.2157
    },
    {
      "name": "Kayes",
      "lat": 14.4469,
      "lon": -11.4442
    }
  ],
  "MT": [
    {
      "name": "Valletta",
      "lat": 35.8989,
      "lon": 14.5146
    },
    {
      "name": "Birkirkara",
      "lat": 35.8972,
      "lon": 14.4611
    },
    {
      "name": "Mosta",
      "lat": 35.9094,
      "lon": 14.4256
    },
    {
      "name": "Sliema",
      "lat": 35.9122,
      "lon": 14.5042
    },
    {
      "name": "Qormi",
      "lat": 35.8767,
      "lon": 14.4719
    },
    {
      "name": "St. Paul's Bay",
      "lat": 35.9506,
      "lon": 14.4156
    }
  ],
  "MH": [
    {
      "name": "Majuro",
      "lat": 7.1164,
      "lon": 171.1858
    },
    {
      "name": "Ebeye",
      "lat": 8.7816,
      "lon": 167.7397
    },
    {
      "name": "Arno",
      "lat": 7.0667,
      "lon": 171.55
    },
    {
      "name": "Jabor",
      "lat": 5.919,
      "lon": 169.643
    },
    {
      "name": "Wotje",
      "lat": 9.4617,
      "lon": 170.2372
    },
    {
      "name": "Mili",
      "lat": 6.0833,
      "lon": 171.7333
    }
  ],
  "MR": [
    {
      "name": "Nouakchott",
      "lat": 18.0735,
      "lon": -15.9582
    },
    {
      "name": "Nouadhibou",
      "lat": 20.942,
      "lon": -17.037
    },
    {
      "name": "Kiffa",
      "lat": 16.6167,
      "lon": -11.4
    },
    {
      "name": "Kaédi",
      "lat": 16.15,
      "lon": -13.5
    },
    {
      "name": "Rosso",
      "lat": 16.5133,
      "lon": -15.805
    },
    {
      "name": "Zouérat",
      "lat": 22.7186,
      "lon": -12.4539
    }
  ],
  "MU": [
    {
      "name": "Port Louis",
      "lat": -20.1609,
      "lon": 57.5012
    },
    {
      "name": "Beau Bassin-Rose Hill",
      "lat": -20.2417,
      "lon": 57.4717
    },
    {
      "name": "Vacoas-Phoenix",
      "lat": -20.2981,
      "lon": 57.4967
    },
    {
      "name": "Curepipe",
      "lat": -20.3167,
      "lon": 57.5167
    },
    {
      "name": "Quatre Bornes",
      "lat": -20.2642,
      "lon": 57.4789
    },
    {
      "name": "Triolet",
      "lat": -20.0528,
      "lon": 57.5519
    }
  ],
  "MX": [
    {
      "name": "Mexico City",
      "lat": 19.4326,
      "lon": -99.1332
    },
    {
      "name": "Guadalajara",
      "lat": 20.6597,
      "lon": -103.3496
    },
    {
      "name": "Monterrey",
      "lat": 25.6866,
      "lon": -100.3161
    },
    {
      "name": "Puebla",
      "lat": 19.0414,
      "lon": -98.2063
    },
    {
      "name": "Tijuana",
      "lat": 32.5149,
      "lon": -117.0382
    },
    {
      "name": "León",
      "lat": 21.1221,
      "lon": -101.6826
    },
    {
      "name": "Juárez",
      "lat": 31.7394,
      "lon": -106.4869
    },
    {
      "name": "Cancún",
      "lat": 21.1619,
      "lon": -86.8515
    }
  ],
  "FM": [
    {
      "name": "Palikir",
      "lat": 6.9248,
      "lon": 158.1611
    },
    {
      "name": "Weno",
      "lat": 7.4467,
      "lon": 151.8469
    },
    {
      "name": "Kolonia",
      "lat": 6.964,
      "lon": 158.206
    },
    {
      "name": "Tofol",
      "lat": 5.3283,
      "lon": 163.0078
    },
    {
      "name": "Colonia",
      "lat": 9.5167,
      "lon": 138.1333
    },
    {
      "name": "Kitti",
      "lat": 6.8333,
      "lon": 158.1667
    }
  ],
  "MD": [
    {
      "name": "Chisinau",
      "lat": 47.0105,
      "lon": 28.8638
    },
    {
      "name": "Tiraspol",
      "lat": 46.8403,
      "lon": 29.6433
    },
    {
      "name": "Bălți",
      "lat": 47.7617,
      "lon": 27.9289
    },
    {
      "name": "Bender",
      "lat": 46.8317,
      "lon": 29.4778
    },
    {
      "name": "Rîbnița",
      "lat": 47.7667,
      "lon": 29.0
    },
    {
      "name": "Ungheni",
      "lat": 47.2056,
      "lon": 27.7978
    }
  ],
  "MC": [
    {
      "name": "Monaco",
      "lat": 43.7384,
      "lon": 7.4246
    },
    {
      "name": "Monte Carlo",
      "lat": 43.7398,
      "lon": 7.4273
    },
    {
      "name": "La Condamine",
      "lat": 43.7364,
      "lon": 7.4206
    },
    {
      "name": "Fontvieille",
      "lat": 43.7297,
      "lon": 7.4178
    }
  ],
  "MN": [
    {
      "name": "Ulaanbaatar",
      "lat": 47.8864,
      "lon": 106.9057
    },
    {
      "name": "Erdenet",
      "lat": 49.0333,
      "lon": 104.0833
    },
    {
      "name": "Darkhan",
      "lat": 49.4867,
      "lon": 105.9228
    },
    {
      "name": "Choibalsan",
      "lat": 48.0667,
      "lon": 114.5333
    },
    {
      "name": "Mörön",
      "lat": 49.6342,
      "lon": 100.1625
    },
    {
      "name": "Nalaikh",
      "lat": 47.7667,
      "lon": 107.3
    }
  ],
  "ME": [
    {
      "name": "Podgorica",
      "lat": 42.4304,
      "lon": 19.2594
    },
    {
      "name": "Nikšić",
      "lat": 42.78,
      "lon": 18.9442
    },
    {
      "name": "Herceg Novi",
      "lat": 42.4531,
      "lon": 18.5375
    },
    {
      "name": "Pljevlja",
      "lat": 43.3567,
      "lon": 19.3583
    },
    {
      "name": "Bar",
      "lat": 42.0931,
      "lon": 19.1003
    },
    {
      "name": "Budva",
      "lat": 42.2881,
      "lon": 18.8425
    }
  ],
  "MA": [
    {
      "name": "Casablanca",
      "lat": 33.5731,
      "lon": -7.5898
    },
    {
      "name": "Rabat",
      "lat": 34.0209,
      "lon": -6.8416
    },
    {
      "name": "Fez",
      "lat": 34.0181,
      "lon": -5.0078
    },
    {
      "name": "Tangier",
      "lat": 35.7595,
      "lon": -5.834
    },
    {
      "name": "Marrakech",
      "lat": 31.6295,
      "lon": -7.9811
    },
    {
      "name": "Agadir",
      "lat": 30.4278,
      "lon": -9.5981
    },
    {
      "name": "Meknes",
      "lat": 33.8935,
      "lon": -5.5473
    }
  ],
  "MZ": [
    {
      "name": "Maputo",
      "lat": -25.9692,
      "lon": 32.5732
    },
    {
      "name": "Matola",
      "lat": -25.9622,
      "lon": 32.4589
    },
    {
      "name": "Nampula",
      "lat": -15.1165,
      "lon": 39.2666
    },
    {
      "name": "Beira",
      "lat": -19.8436,
      "lon": 34.8389
    },
    {
      "name": "Chimoio",
      "lat": -19.1164,
      "lon": 33.4833
    },
    {
      "name": "Nacala",
      "lat": -14.5626,
      "lon": 40.6854
    }
  ],
  "MM": [
    {
      "name": "Yangon",
      "lat": 16.8661,
      "lon": 96.1951
    },
    {
      "name": "Mandalay",
      "lat": 21.9588,
      "lon": 96.0891
    },
    {
      "name": "Naypyidaw",
      "lat": 19.7633,
      "lon": 96.0785
    },
    {
      "name": "Taunggyi",
      "lat": 20.7833,
      "lon": 97.0333
    },
    {
      "name": "Mawlamyine",
      "lat": 16.4905,
      "lon": 97.6283
    },
    {
      "name": "Bago",
      "lat": 17.3353,
      "lon": 96.4817
    }
  ],
  "NA": [
    {
      "name": "Windhoek",
      "lat": -22.5609,
      "lon": 17.0658
    },
    {
      "name": "Rundu",
      "lat": -17.9333,
      "lon": 19.7667
    },
    {
      "name": "Walvis Bay",
      "lat": -22.9575,
      "lon": 14.5053
    },
    {
      "name": "Swakopmund",
      "lat": -22.6833,
      "lon": 14.5333
    },
    {
      "name": "Oshakati",
      "lat": -17.7833,
      "lon": 15.7
    },
    {
      "name": "Rehoboth",
      "lat": -23.3167,
      "lon": 17.0833
    }
  ],
  "NR": [
    {
      "name": "Yaren",
      "lat": -0.5477,
      "lon": 166.9209
    },
    {
      "name": "Denigomodu",
      "lat": -0.5261,
      "lon": 166.9142
    },
    {
      "name": "Meneng",
      "lat": -0.5436,
      "lon": 166.9419
    },
    {
      "name": "Aiwo",
      "lat": -0.5333,
      "lon": 166.9111
    }
  ],
  "NP": [
    {
      "name": "Kathmandu",
      "lat": 27.7172,
      "lon": 85.324
    },
    {
      "name": "Pokhara",
      "lat": 28.2096,
      "lon": 83.9856
    },
    {
      "name": "Lalitpur",
      "lat": 27.6667,
      "lon": 85.3167
    },
    {
      "name": "Bharatpur",
      "lat": 27.6833,
      "lon": 84.4333
    },
    {
      "name": "Biratnagar",
      "lat": 26.4525,
      "lon": 87.2718
    },
    {
      "name": "Birgunj",
      "lat": 27.0104,
      "lon": 84.8774
    }
  ],
  "NL": [
    {
      "name": "Amsterdam",
      "lat": 52.3676,
      "lon": 4.9041
    },
    {
      "name": "Rotterdam",
      "lat": 51.9244,
      "lon": 4.4777
    },
    {
      "name": "The Hague",
      "lat": 52.0705,
      "lon": 4.3007
    },
    {
      "name": "Utrecht",
      "lat": 52.0907,
      "lon": 5.1214
    },
    {
      "name": "Eindhoven",
      "lat": 51.4416,
      "lon": 5.4697
    },
    {
      "name": "Groningen",
      "lat": 53.2194,
      "lon": 6.5665
    },
    {
      "name": "Tilburg",
      "lat": 51.5555,
      "lon": 5.0913
    }
  ],
  "NZ": [
    {
      "name": "Auckland",
      "lat": -36.8485,
      "lon": 174.7633
    },
    {
      "name": "Wellington",
      "lat": -41.2865,
      "lon": 174.7762
    },
    {
      "name": "Christchurch",
      "lat": -43.5321,
      "lon": 172.6362
    },
    {
      "name": "Hamilton",
      "lat": -37.787,
      "lon": 175.2793
    },
    {
      "name": "Tauranga",
      "lat": -37.6878,
      "lon": 176.1651
    },
    {
      "name": "Dunedin",
      "lat": -45.8788,
      "lon": 170.5028
    }
  ],
  "NI": [
    {
      "name": "Managua",
      "lat": 12.115,
      "lon": -86.2362
    },
    {
      "name": "León",
      "lat": 12.4379,
      "lon": -86.878
    },
    {
      "name": "Masaya",
      "lat": 11.9744,
      "lon": -86.0942
    },
    {
      "name": "Matagalpa",
      "lat": 12.9256,
      "lon": -85.9178
    },
    {
      "name": "Tipitapa",
      "lat": 12.1978,
      "lon": -86.0964
    },
    {
      "name": "Chinandega",
      "lat": 12.6294,
      "lon": -87.1311
    }
  ],
  "NE": [
    {
      "name": "Niamey",
      "lat": 13.5116,
      "lon": 2.1254
    },
    {
      "name": "Maradi",
      "lat": 13.5,
      "lon": 7.1017
    },
    {
      "name": "Zinder",
      "lat": 13.8072,
      "lon": 8.9883
    },
    {
      "name": "Tahoua",
      "lat": 14.8888,
      "lon": 5.2692
    },
    {
      "name": "Agadez",
      "lat": 16.9739,
      "lon": 7.9903
    },
    {
      "name": "Arlit",
      "lat": 18.7369,
      "lon": 7.3853
    }
  ],
  "NG": [
    {
      "name": "Lagos",
      "lat": 6.5244,
      "lon": 3.3792
    },
    {
      "name": "Kano",
      "lat": 12.0022,
      "lon": 8.592
    },
    {
      "name": "Ibadan",
      "lat": 7.3775,
      "lon": 3.947
    },
    {
      "name": "Abuja",
      "lat": 9.0765,
      "lon": 7.3986
    },
    {
      "name": "Port Harcourt",
      "lat": 4.8156,
      "lon": 7.0498
    },
    {
      "name": "Benin City",
      "lat": 6.335,
      "lon": 5.6037
    },
    {
      "name": "Kaduna",
      "lat": 10.5105,
      "lon": 7.4165
    },
    {
      "name": "Enugu",
      "lat": 6.4584,
      "lon": 7.5464
    }
  ],
  "KP": [
    {
      "name": "Pyongyang",
      "lat": 39.0392,
      "lon": 125.7625
    },
    {
      "name": "Hamhung",
      "lat": 39.9181,
      "lon": 127.5364
    },
    {
      "name": "Chongjin",
      "lat": 41.7956,
      "lon": 129.7758
    },
    {
      "name": "Nampo",
      "lat": 38.7375,
      "lon": 125.4078
    },
    {
      "name": "Wonsan",
      "lat": 39.1528,
      "lon": 127.4436
    },
    {
      "name": "Sinuiju",
      "lat": 40.1006,
      "lon": 124.3981
    }
  ],
  "MK": [
    {
      "name": "Skopje",
      "lat": 41.9981,
      "lon": 21.4254
    },
    {
      "name": "Bitola",
      "lat": 41.0319,
      "lon": 21.3347
    },
    {
      "name": "Kumanovo",
      "lat": 42.1322,
      "lon": 21.7144
    },
    {
      "name": "Prilep",
      "lat": 41.3444,
      "lon": 21.5542
    },
    {
      "name": "Tetovo",
      "lat": 42.0106,
      "lon": 20.9714
    },
    {
      "name": "Ohrid",
      "lat": 41.1172,
      "lon": 20.8019
    }
  ],
  "NO": [
    {
      "name": "Oslo",
      "lat": 59.9139,
      "lon": 10.7522
    },
    {
      "name": "Bergen",
      "lat": 60.3913,
      "lon": 5.3221
    },
    {
      "name": "Trondheim",
      "lat": 63.4305,
      "lon": 10.3951
    },
    {
      "name": "Stavanger",
      "lat": 58.969,
      "lon": 5.7331
    },
    {
      "name": "Bærum",
      "lat": 59.8939,
      "lon": 10.5247
    },
    {
      "name": "Kristiansand",
      "lat": 58.1467,
      "lon": 7.9956
    }
  ],
  "OM": [
    {
      "name": "Muscat",
      "lat": 23.5859,
      "lon": 58.4059
    },
    {
      "name": "Seeb",
      "lat": 23.6703,
      "lon": 58.1891
    },
    {
      "name": "Salalah",
      "lat": 17.0151,
      "lon": 54.0924
    },
    {
      "name": "Bawshar",
      "lat": 23.55,
      "lon": 58.4
    },
    {
      "name": "Sohar",
      "lat": 24.3461,
      "lon": 56.7075
    },
    {
      "name": "Suwayq",
      "lat": 23.8494,
      "lon": 57.4386
    }
  ],
  "PK": [
    {
      "name": "Karachi",
      "lat": 24.8607,
      "lon": 67.0011
    },
    {
      "name": "Lahore",
      "lat": 31.5204,
      "lon": 74.3587
    },
    {
      "name": "Faisalabad",
      "lat": 31.4504,
      "lon": 73.135
    },
    {
      "name": "Rawalpindi",
      "lat": 33.5651,
      "lon": 73.0169
    },
    {
      "name": "Gujranwala",
      "lat": 32.1877,
      "lon": 74.1945
    },
    {
      "name": "Peshawar",
      "lat": 34.0151,
      "lon": 71.5249
    },
    {
      "name": "Islamabad",
      "lat": 33.6844,
      "lon": 73.0479
    }
  ],
  "PW": [
    {
      "name": "Koror",
      "lat": 7.3426,
      "lon": 134.4789
    },
    {
      "name": "Ngerulmud",
      "lat": 7.5006,
      "lon": 134.6242
    },
    {
      "name": "Airai",
      "lat": 7.3667,
      "lon": 134.55
    },
    {
      "name": "Kloulklubed",
      "lat": 7.0419,
      "lon": 134.2556
    },
    {
      "name": "Melekeok",
      "lat": 7.4958,
      "lon": 134.6367
    },
    {
      "name": "Ulimang",
      "lat": 7.6253,
      "lon": 134.6419
    }
  ],
  "PS": [
    {
      "name": "Gaza City",
      "lat": 31.5017,
      "lon": 34.4668
    },
    {
      "name": "Hebron",
      "lat": 31.5326,
      "lon": 35.0998
    },
    {
      "name": "Nablus",
      "lat": 32.2211,
      "lon": 35.2544
    },
    {
      "name": "Ramallah",
      "lat": 31.9038,
      "lon": 35.2034
    },
    {
      "name": "Khan Yunis",
      "lat": 31.3462,
      "lon": 34.3063
    },
    {
      "name": "Bethlehem",
      "lat": 31.7054,
      "lon": 35.2024
    }
  ],
  "PA": [
    {
      "name": "Panama City",
      "lat": 8.9824,
      "lon": -79.5199
    },
    {
      "name": "San Miguelito",
      "lat": 9.0347,
      "lon": -79.5019
    },
    {
      "name": "Tocumen",
      "lat": 9.0883,
      "lon": -79.3853
    },
    {
      "name": "David",
      "lat": 8.4274,
      "lon": -82.4309
    },
    {
      "name": "Arraiján",
      "lat": 8.95,
      "lon": -79.65
    },
    {
      "name": "Colón",
      "lat": 9.3598,
      "lon": -79.9014
    }
  ],
  "PG": [
    {
      "name": "Port Moresby",
      "lat": -9.4438,
      "lon": 147.1803
    },
    {
      "name": "Lae",
      "lat": -6.7269,
      "lon": 146.9925
    },
    {
      "name": "Arawa",
      "lat": -6.2294,
      "lon": 155.5658
    },
    {
      "name": "Mount Hagen",
      "lat": -5.8575,
      "lon": 144.2269
    },
    {
      "name": "Popondetta",
      "lat": -8.7667,
      "lon": 148.2333
    },
    {
      "name": "Madang",
      "lat": -5.2167,
      "lon": 145.8
    }
  ],
  "PY": [
    {
      "name": "Asunción",
      "lat": -25.2637,
      "lon": -57.5759
    },
    {
      "name": "Ciudad del Este",
      "lat": -25.5097,
      "lon": -54.6111
    },
    {
      "name": "San Lorenzo",
      "lat": -25.3397,
      "lon": -57.5089
    },
    {
      "name": "Luque",
      "lat": -25.2694,
      "lon": -57.4856
    },
    {
      "name": "Capiatá",
      "lat": -25.3553,
      "lon": -57.4453
    },
    {
      "name": "Lambaré",
      "lat": -25.3442,
      "lon": -57.6064
    }
  ],
  "PE": [
    {
      "name": "Lima",
      "lat": -12.0464,
      "lon": -77.0428
    },
    {
      "name": "Arequipa",
      "lat": -16.409,
      "lon": -71.5375
    },
    {
      "name": "Trujillo",
      "lat": -8.116,
      "lon": -79.03
    },
    {
      "name": "Chiclayo",
      "lat": -6.7714,
      "lon": -79.8409
    },
    {
      "name": "Piura",
      "lat": -5.1945,
      "lon": -80.6328
    },
    {
      "name": "Cusco",
      "lat": -13.5319,
      "lon": -71.9675
    },
    {
      "name": "Iquitos",
      "lat": -3.7437,
      "lon": -73.2516
    }
  ],
  "PH": [
    {
      "name": "Quezon City",
      "lat": 14.676,
      "lon": 121.0437
    },
    {
      "name": "Manila",
      "lat": 14.5995,
      "lon": 120.9842
    },
    {
      "name": "Davao City",
      "lat": 7.1907,
      "lon": 125.4578
    },
    {
      "name": "Caloocan",
      "lat": 14.65,
      "lon": 120.9667
    },
    {
      "name": "Cebu City",
      "lat": 10.3157,
      "lon": 123.8854
    },
    {
      "name": "Zamboanga City",
      "lat": 6.9214,
      "lon": 122.079
    },
    {
      "name": "Taguig",
      "lat": 14.5176,
      "lon": 121.0509
    }
  ],
  "PL": [
    {
      "name": "Warsaw",
      "lat": 52.2297,
      "lon": 21.0122
    },
    {
      "name": "Kraków",
      "lat": 50.0647,
      "lon": 19.945
    },
    {
      "name": "Łódź",
      "lat": 51.7592,
      "lon": 19.456
    },
    {
      "name": "Wrocław",
      "lat": 51.1079,
      "lon": 17.0385
    },
    {
      "name": "Poznań",
      "lat": 52.4064,
      "lon": 16.9252
    },
    {
      "name": "Gdańsk",
      "lat": 54.352,
      "lon": 18.6466
    },
    {
      "name": "Szczecin",
      "lat": 53.4285,
      "lon": 14.5528
    }
  ],
  "PT": [
    {
      "name": "Lisbon",
      "lat": 38.7223,
      "lon": -9.1393
    },
    {
      "name": "Porto",
      "lat": 41.1579,
      "lon": -8.6291
    },
    {
      "name": "Vila Nova de Gaia",
      "lat": 41.1333,
      "lon": -8.6167
    },
    {
      "name": "Amadora",
      "lat": 38.7597,
      "lon": -9.2244
    },
    {
      "name": "Braga",
      "lat": 41.5454,
      "lon": -8.4265
    },
    {
      "name": "Coimbra",
      "lat": 40.2033,
      "lon": -8.4103
    }
  ],
  "QA": [
    {
      "name": "Doha",
      "lat": 25.2854,
      "lon": 51.531
    },
    {
      "name": "Al Rayyan",
      "lat": 25.2919,
      "lon": 51.4244
    },
    {
      "name": "Al Wakrah",
      "lat": 25.1768,
      "lon": 51.6048
    },
    {
      "name": "Al Khor",
      "lat": 25.6839,
      "lon": 51.4969
    },
    {
      "name": "Umm Salal",
      "lat": 25.4189,
      "lon": 51.4089
    },
    {
      "name": "Lusail",
      "lat": 25.4214,
      "lon": 51.5075
    }
  ],
  "RO": [
    {
      "name": "Bucharest",
      "lat": 44.4268,
      "lon": 26.1025
    },
    {
      "name": "Cluj-Napoca",
      "lat": 46.7712,
      "lon": 23.6236
    },
    {
      "name": "Timișoara",
      "lat": 45.7537,
      "lon": 21.2257
    },
    {
      "name": "Iași",
      "lat": 47.1585,
      "lon": 27.6014
    },
    {
      "name": "Constanța",
      "lat": 44.1792,
      "lon": 28.6498
    },
    {
      "name": "Craiova",
      "lat": 44.3302,
      "lon": 23.7949
    },
    {
      "name": "Brașov",
      "lat": 45.658,
      "lon": 25.6012
    }
  ],
  "RU": [
    {
      "name": "Moscow",
      "lat": 55.7558,
      "lon": 37.6173
    },
    {
      "name": "Saint Petersburg",
      "lat": 59.9343,
      "lon": 30.3351
    },
    {
      "name": "Novosibirsk",
      "lat": 55.0084,
      "lon": 82.9357
    },
    {
      "name": "Yekaterinburg",
      "lat": 56.8389,
      "lon": 60.6057
    },
    {
      "name": "Kazan",
      "lat": 55.8304,
      "lon": 49.0661
    },
    {
      "name": "Nizhny Novgorod",
      "lat": 56.2965,
      "lon": 43.9361
    },
    {
      "name": "Chelyabinsk",
      "lat": 55.1644,
      "lon": 61.4368
    },
    {
      "name": "Samara",
      "lat": 53.2415,
      "lon": 50.2212
    }
  ],
  "RW": [
    {
      "name": "Kigali",
      "lat": -1.9441,
      "lon": 30.0619
    },
    {
      "name": "Butare",
      "lat": -2.5967,
      "lon": 29.7394
    },
    {
      "name": "Gisenyi",
      "lat": -1.7028,
      "lon": 29.2564
    },
    {
      "name": "Ruhengeri",
      "lat": -1.4997,
      "lon": 29.6339
    },
    {
      "name": "Gitarama",
      "lat": -2.0744,
      "lon": 29.7567
    },
    {
      "name": "Byumba",
      "lat": -1.5764,
      "lon": 30.0675
    }
  ],
  "KN": [
    {
      "name": "Basseterre",
      "lat": 17.3026,
      "lon": -62.7177
    },
    {
      "name": "Charlestown",
      "lat": 17.1333,
      "lon": -62.6167
    },
    {
      "name": "Saddlers",
      "lat": 17.3917,
      "lon": -62.7933
    },
    {
      "name": "Cayon",
      "lat": 17.35,
      "lon": -62.7333
    },
    {
      "name": "Sandy Point Town",
      "lat": 17.3592,
      "lon": -62.8486
    },
    {
      "name": "Gingerland",
      "lat": 17.1389,
      "lon": -62.5694
    }
  ],
  "LC": [
    {
      "name": "Castries",
      "lat": 14.0101,
      "lon": -60.9875
    },
    {
      "name": "Bexon",
      "lat": 13.9667,
      "lon": -60.9833
    },
    {
      "name": "Vieux Fort",
      "lat": 13.7239,
      "lon": -60.9492
    },
    {
      "name": "Micoud",
      "lat": 13.8167,
      "lon": -60.9
    },
    {
      "name": "Soufrière",
      "lat": 13.8561,
      "lon": -61.0567
    },
    {
      "name": "Gros Islet",
      "lat": 14.0706,
      "lon": -60.9536
    }
  ],
  "VC": [
    {
      "name": "Kingstown",
      "lat": 13.1587,
      "lon": -61.2248
    },
    {
      "name": "Georgetown",
      "lat": 13.2894,
      "lon": -61.1278
    },
    {
      "name": "Byera Village",
      "lat": 13.2569,
      "lon": -61.1206
    },
    {
      "name": "Barrouallie",
      "lat": 13.2367,
      "lon": -61.2708
    },
    {
      "name": "Layou",
      "lat": 13.2033,
      "lon": -61.2683
    },
    {
      "name": "Chateaubelair",
      "lat": 13.29,
      "lon": -61.24
    }
  ],
  "WS": [
    {
      "name": "Apia",
      "lat": -13.8333,
      "lon": -171.7667
    },
    {
      "name": "Asau",
      "lat": -13.5186,
      "lon": -172.6367
    },
    {
      "name": "Mulifanua",
      "lat": -13.8322,
      "lon": -172.035
    },
    {
      "name": "Faleula",
      "lat": -13.8117,
      "lon": -171.8214
    },
    {
      "name": "Siusega",
      "lat": -13.8444,
      "lon": -171.7958
    },
    {
      "name": "Leulumoega",
      "lat": -13.8208,
      "lon": -171.9214
    }
  ],
  "SM": [
    {
      "name": "San Marino",
      "lat": 43.9333,
      "lon": 12.45
    },
    {
      "name": "Serravalle",
      "lat": 43.9689,
      "lon": 12.4806
    },
    {
      "name": "Borgo Maggiore",
      "lat": 43.9417,
      "lon": 12.4467
    },
    {
      "name": "Domagnano",
      "lat": 43.9497,
      "lon": 12.4686
    }
  ],
  "ST": [
    {
      "name": "São Tomé",
      "lat": 0.3365,
      "lon": 6.7273
    },
    {
      "name": "Santo Amaro",
      "lat": 0.3667,
      "lon": 6.7
    },
    {
      "name": "Neves",
      "lat": 0.3603,
      "lon": 6.5492
    },
    {
      "name": "Santana",
      "lat": 0.25,
      "lon": 6.75
    },
    {
      "name": "Trindade",
      "lat": 0.3,
      "lon": 6.6833
    },
    {
      "name": "Guadalupe",
      "lat": 0.3833,
      "lon": 6.65
    }
  ],
  "SA": [
    {
      "name": "Riyadh",
      "lat": 24.7136,
      "lon": 46.6753
    },
    {
      "name": "Jeddah",
      "lat": 21.4858,
      "lon": 39.1925
    },
    {
      "name": "Mecca",
      "lat": 21.3891,
      "lon": 39.8579
    },
    {
      "name": "Medina",
      "lat": 24.5247,
      "lon": 39.5692
    },
    {
      "name": "Dammam",
      "lat": 26.4207,
      "lon": 50.0888
    },
    {
      "name": "Taif",
      "lat": 21.2854,
      "lon": 40.4222
    },
    {
      "name": "Tabuk",
      "lat": 28.3835,
      "lon": 36.5662
    }
  ],
  "SN": [
    {
      "name": "Dakar",
      "lat": 14.7167,
      "lon": -17.4677
    },
    {
      "name": "Touba",
      "lat": 14.8647,
      "lon": -15.8778
    },
    {
      "name": "Thiès",
      "lat": 14.791,
      "lon": -16.9359
    },
    {
      "name": "Rufisque",
      "lat": 14.7167,
      "lon": -17.2667
    },
    {
      "name": "Kaolack",
      "lat": 14.15,
      "lon": -16.0833
    },
    {
      "name": "Ziguinchor",
      "lat": 12.5833,
      "lon": -16.2719
    }
  ],
  "RS": [
    {
      "name": "Belgrade",
      "lat": 44.7866,
      "lon": 20.4489
    },
    {
      "name": "Novi Sad",
      "lat": 45.2671,
      "lon": 19.8335
    },
    {
      "name": "Niš",
      "lat": 43.3209,
      "lon": 21.8958
    },
    {
      "name": "Kragujevac",
      "lat": 44.0167,
      "lon": 20.9167
    },
    {
      "name": "Subotica",
      "lat": 46.1,
      "lon": 19.6667
    },
    {
      "name": "Zrenjanin",
      "lat": 45.3833,
      "lon": 20.3833
    }
  ],
  "SC": [
    {
      "name": "Victoria",
      "lat": -4.6191,
      "lon": 55.4513
    },
    {
      "name": "Anse Boileau",
      "lat": -4.7083,
      "lon": 55.4833
    },
    {
      "name": "Beau Vallon",
      "lat": -4.6167,
      "lon": 55.4333
    },
    {
      "name": "Anse Royale",
      "lat": -4.7417,
      "lon": 55.5167
    },
    {
      "name": "Cascade",
      "lat": -4.6667,
      "lon": 55.4833
    },
    {
      "name": "Grand Anse",
      "lat": -4.3167,
      "lon": 55.7167
    }
  ],
  "SL": [
    {
      "name": "Freetown",
      "lat": 8.484,
      "lon": -13.2299
    },
    {
      "name": "Kenema",
      "lat": 7.8767,
      "lon": -11.1875
    },
    {
      "name": "Bo",
      "lat": 7.9647,
      "lon": -11.7383
    },
    {
      "name": "Koidu",
      "lat": 8.6439,
      "lon": -10.9714
    },
    {
      "name": "Makeni",
      "lat": 8.8861,
      "lon": -12.0442
    },
    {
      "name": "Waterloo",
      "lat": 8.3389,
      "lon": -13.0708
    }
  ],
  "SG": [
    {
      "name": "Singapore",
      "lat": 1.3521,
      "lon": 103.8198
    },
    {
      "name": "Jurong West",
      "lat": 1.3404,
      "lon": 103.709
    },
    {
      "name": "Tampines",
      "lat": 1.3531,
      "lon": 103.9452
    },
    {
      "name": "Woodlands",
      "lat": 1.4382,
      "lon": 103.7891
    },
    {
      "name": "Bedok",
      "lat": 1.3236,
      "lon": 103.9273
    },
    {
      "name": "Yishun",
      "lat": 1.4304,
      "lon": 103.8354
    }
  ],
  "SK": [
    {
      "name": "Bratislava",
      "lat": 48.1486,
      "lon": 17.1077
    },
    {
      "name": "Košice",
      "lat": 48.7164,
      "lon": 21.2611
    },
    {
      "name": "Prešov",
      "lat": 48.9984,
      "lon": 21.2339
    },
    {
      "name": "Žilina",
      "lat": 49.2232,
      "lon": 18.7408
    },
    {
      "name": "Banská Bystrica",
      "lat": 48.7363,
      "lon": 19.1462
    },
    {
      "name": "Nitra",
      "lat": 48.3061,
      "lon": 18.0764
    }
  ],
  "SI": [
    {
      "name": "Ljubljana",
      "lat": 46.0569,
      "lon": 14.5058
    },
    {
      "name": "Maribor",
      "lat": 46.5547,
      "lon": 15.6459
    },
    {
      "name": "Kranj",
      "lat": 46.2389,
      "lon": 14.3556
    },
    {
      "name": "Celje",
      "lat": 46.2333,
      "lon": 15.2667
    },
    {
      "name": "Koper",
      "lat": 45.5481,
      "lon": 13.7303
    },
    {
      "name": "Novo Mesto",
      "lat": 45.8039,
      "lon": 15.1689
    }
  ],
  "SB": [
    {
      "name": "Honiara",
      "lat": -9.4456,
      "lon": 159.9729
    },
    {
      "name": "Gizo",
      "lat": -8.1031,
      "lon": 156.8419
    },
    {
      "name": "Auki",
      "lat": -8.7678,
      "lon": 160.7033
    },
    {
      "name": "Noro",
      "lat": -8.2333,
      "lon": 157.2
    },
    {
      "name": "Buala",
      "lat": -8.1444,
      "lon": 159.5925
    },
    {
      "name": "Tulagi",
      "lat": -9.1031,
      "lon": 160.1497
    }
  ],
  "SO": [
    {
      "name": "Mogadishu",
      "lat": 2.0469,
      "lon": 45.3182
    },
    {
      "name": "Hargeisa",
      "lat": 9.56,
      "lon": 44.065
    },
    {
      "name": "Bosaso",
      "lat": 11.2842,
      "lon": 49.1816
    },
    {
      "name": "Kismayo",
      "lat": -0.3582,
      "lon": 42.5454
    },
    {
      "name": "Merca",
      "lat": 1.7159,
      "lon": 44.7719
    },
    {
      "name": "Baidoa",
      "lat": 3.1139,
      "lon": 43.6497
    }
  ],
  "ZA": [
    {
      "name": "Johannesburg",
      "lat": -26.2041,
      "lon": 28.0473
    },
    {
      "name": "Cape Town",
      "lat": -33.9249,
      "lon": 18.4241
    },
    {
      "name": "Durban",
      "lat": -29.8587,
      "lon": 31.0218
    },
    {
      "name": "Pretoria",
      "lat": -25.7479,
      "lon": 28.2293
    },
    {
      "name": "Port Elizabeth",
      "lat": -33.9608,
      "lon": 25.6022
    },
    {
      "name": "Bloemfontein",
      "lat": -29.1167,
      "lon": 26.2167
    },
    {
      "name": "East London",
      "lat": -33.0153,
      "lon": 27.9116
    }
  ],
  "KR": [
    {
      "name": "Seoul",
      "lat": 37.5665,
      "lon": 126.978
    },
    {
      "name": "Busan",
      "lat": 35.1796,
      "lon": 129.0756
    },
    {
      "name": "Incheon",
      "lat": 37.4563,
      "lon": 126.7052
    },
    {
      "name": "Daegu",
      "lat": 35.8714,
      "lon": 128.6014
    },
    {
      "name": "Daejeon",
      "lat": 36.3504,
      "lon": 127.3845
    },
    {
      "name": "Gwangju",
      "lat": 35.1595,
      "lon": 126.8526
    },
    {
      "name": "Suwon",
      "lat": 37.2636,
      "lon": 127.0286
    }
  ],
  "SS": [
    {
      "name": "Juba",
      "lat": 4.8594,
      "lon": 31.5713
    },
    {
      "name": "Wau",
      "lat": 7.7028,
      "lon": 27.9953
    },
    {
      "name": "Malakal",
      "lat": 9.5334,
      "lon": 31.6605
    },
    {
      "name": "Yei",
      "lat": 4.095,
      "lon": 30.6778
    },
    {
      "name": "Aweil",
      "lat": 8.7667,
      "lon": 27.4
    },
    {
      "name": "Yambio",
      "lat": 4.5714,
      "lon": 28.3972
    }
  ],
  "ES": [
    {
      "name": "Madrid",
      "lat": 40.4168,
      "lon": -3.7038
    },
    {
      "name": "Barcelona",
      "lat": 41.3879,
      "lon": 2.1699
    },
    {
      "name": "Valencia",
      "lat": 39.4699,
      "lon": -0.3763
    },
    {
      "name": "Seville",
      "lat": 37.3891,
      "lon": -5.9845
    },
    {
      "name": "Zaragoza",
      "lat": 41.6488,
      "lon": -0.8891
    },
    {
      "name": "Málaga",
      "lat": 36.7213,
      "lon": -4.4214
    },
    {
      "name": "Murcia",
      "lat": 37.9922,
      "lon": -1.1307
    },
    {
      "name": "Palma de Mallorca",
      "lat": 39.5696,
      "lon": 2.6502
    }
  ],
  "LK": [
    {
      "name": "Colombo",
      "lat": 6.9271,
      "lon": 79.8612
    },
    {
      "name": "Dehiwala-Mount Lavinia",
      "lat": 6.8406,
      "lon": 79.8711
    },
    {
      "name": "Moratuwa",
      "lat": 6.773,
      "lon": 79.8816
    },
    {
      "name": "Kandy",
      "lat": 7.2906,
      "lon": 80.6337
    },
    {
      "name": "Negombo",
      "lat": 7.2083,
      "lon": 79.8358
    },
    {
      "name": "Galle",
      "lat": 6.0535,
      "lon": 80.221
    }
  ],
  "SD": [
    {
      "name": "Khartoum",
      "lat": 15.5007,
      "lon": 32.5599
    },
    {
      "name": "Omdurman",
      "lat": 15.65,
      "lon": 32.4833
    },
    {
      "name": "Khartoum North",
      "lat": 15.65,
      "lon": 32.5333
    },
    {
      "name": "Nyala",
      "lat": 12.05,
      "lon": 24.8833
    },
    {
      "name": "Port Sudan",
      "lat": 19.6175,
      "lon": 37.2164
    },
    {
      "name": "Kassala",
      "lat": 15.45,
      "lon": 36.4
    }
  ],
  "SR": [
    {
      "name": "Paramaribo",
      "lat": 5.852,
      "lon": -55.2038
    },
    {
      "name": "Lelydorp",
      "lat": 5.7,
      "lon": -55.2333
    },
    {
      "name": "Nieuw Nickerie",
      "lat": 5.9442,
      "lon": -56.9931
    },
    {
      "name": "Moengo",
      "lat": 5.6167,
      "lon": -54.4
    },
    {
      "name": "Nieuw Amsterdam",
      "lat": 5.8833,
      "lon": -55.0833
    },
    {
      "name": "Mariënburg",
      "lat": 5.8778,
      "lon": -55.0444
    }
  ],
  "SE": [
    {
      "name": "Stockholm",
      "lat": 59.3293,
      "lon": 18.0686
    },
    {
      "name": "Gothenburg",
      "lat": 57.7089,
      "lon": 11.9746
    },
    {
      "name": "Malmö",
      "lat": 55.605,
      "lon": 13.0038
    },
    {
      "name": "Uppsala",
      "lat": 59.8586,
      "lon": 17.6389
    },
    {
      "name": "Västerås",
      "lat": 59.6162,
      "lon": 16.5528
    },
    {
      "name": "Örebro",
      "lat": 59.2741,
      "lon": 15.2066
    }
  ],
  "CH": [
    {
      "name": "Zurich",
      "lat": 47.3769,
      "lon": 8.5417
    },
    {
      "name": "Geneva",
      "lat": 46.2044,
      "lon": 6.1432
    },
    {
      "name": "Basel",
      "lat": 47.5596,
      "lon": 7.5886
    },
    {
      "name": "Lausanne",
      "lat": 46.5197,
      "lon": 6.6323
    },
    {
      "name": "Bern",
      "lat": 46.948,
      "lon": 7.4474
    },
    {
      "name": "Winterthur",
      "lat": 47.5056,
      "lon": 8.7241
    },
    {
      "name": "Lucerne",
      "lat": 47.0502,
      "lon": 8.3093
    }
  ],
  "SY": [
    {
      "name": "Damascus",
      "lat": 33.5138,
      "lon": 36.2765
    },
    {
      "name": "Aleppo",
      "lat": 36.2021,
      "lon": 37.1343
    },
    {
      "name": "Homs",
      "lat": 34.7325,
      "lon": 36.7136
    },
    {
      "name": "Latakia",
      "lat": 35.5317,
      "lon": 35.7901
    },
    {
      "name": "Hama",
      "lat": 35.1318,
      "lon": 36.7578
    },
    {
      "name": "Raqqa",
      "lat": 35.95,
      "lon": 39.0167
    }
  ],
  "TJ": [
    {
      "name": "Dushanbe",
      "lat": 38.5598,
      "lon": 68.787
    },
    {
      "name": "Khujand",
      "lat": 40.2826,
      "lon": 69.6222
    },
    {
      "name": "Bokhtar",
      "lat": 37.8364,
      "lon": 68.7803
    },
    {
      "name": "Kulob",
      "lat": 37.9094,
      "lon": 69.7825
    },
    {
      "name": "Istaravshan",
      "lat": 39.9142,
      "lon": 69.0033
    },
    {
      "name": "Panjakent",
      "lat": 39.4953,
      "lon": 67.6094
    }
  ],
  "TZ": [
    {
      "name": "Dar es Salaam",
      "lat": -6.7924,
      "lon": 39.2083
    },
    {
      "name": "Mwanza",
      "lat": -2.5167,
      "lon": 32.9
    },
    {
      "name": "Arusha",
      "lat": -3.3667,
      "lon": 36.6833
    },
    {
      "name": "Dodoma",
      "lat": -6.163,
      "lon": 35.7516
    },
    {
      "name": "Mbeya",
      "lat": -8.9,
      "lon": 33.45
    },
    {
      "name": "Morogoro",
      "lat": -6.8211,
      "lon": 37.6611
    }
  ],
  "TH": [
    {
      "name": "Bangkok",
      "lat": 13.7563,
      "lon": 100.5018
    },
    {
      "name": "Nonthaburi",
      "lat": 13.8591,
      "lon": 100.5217
    },
    {
      "name": "Nakhon Ratchasima",
      "lat": 14.9799,
      "lon": 102.0978
    },
    {
      "name": "Chiang Mai",
      "lat": 18.7883,
      "lon": 98.9853
    },
    {
      "name": "Hat Yai",
      "lat": 7.0084,
      "lon": 100.4767
    },
    {
      "name": "Udon Thani",
      "lat": 17.4138,
      "lon": 102.7872
    },
    {
      "name": "Pattaya",
      "lat": 12.9276,
      "lon": 100.8771
    }
  ],
  "TG": [
    {
      "name": "Lomé",
      "lat": 6.1375,
      "lon": 1.2125
    },
    {
      "name": "Sokodé",
      "lat": 8.9833,
      "lon": 1.1333
    },
    {
      "name": "Kara",
      "lat": 9.5511,
      "lon": 1.1861
    },
    {
      "name": "Kpalimé",
      "lat": 6.9,
      "lon": 0.6333
    },
    {
      "name": "Atakpamé",
      "lat": 7.5333,
      "lon": 1.1333
    },
    {
      "name": "Dapaong",
      "lat": 10.8667,
      "lon": 0.2
    }
  ],
  "TO": [
    {
      "name": "Nuku'alofa",
      "lat": -21.1394,
      "lon": -175.2018
    },
    {
      "name": "Neiafu",
      "lat": -18.65,
      "lon": -173.9833
    },
    {
      "name": "Haveluloto",
      "lat": -21.15,
      "lon": -175.2167
    },
    {
      "name": "Vaini",
      "lat": -21.1925,
      "lon": -175.1794
    },
    {
      "name": "Pangai",
      "lat": -19.8167,
      "lon": -174.35
    },
    {
      "name": "Ohonua",
      "lat": -21.3333,
      "lon": -174.95
    }
  ],
  "TT": [
    {
      "name": "Chaguanas",
      "lat": 10.5167,
      "lon": -61.4167
    },
    {
      "name": "San Fernando",
      "lat": 10.2833,
      "lon": -61.4667
    },
    {
      "name": "Port of Spain",
      "lat": 10.6549,
      "lon": -61.5019
    },
    {
      "name": "Arima",
      "lat": 10.6333,
      "lon": -61.2833
    },
    {
      "name": "Point Fortin",
      "lat": 10.1833,
      "lon": -61.6667
    },
    {
      "name": "Scarborough",
      "lat": 11.1833,
      "lon": -60.7333
    }
  ],
  "TN": [
    {
      "name": "Tunis",
      "lat": 36.8065,
      "lon": 10.1815
    },
    {
      "name": "Sfax",
      "lat": 34.7406,
      "lon": 10.7603
    },
    {
      "name": "Sousse",
      "lat": 35.8256,
      "lon": 10.63699
    },
    {
      "name": "Kairouan",
      "lat": 35.6781,
      "lon": 10.0963
    },
    {
      "name": "Bizerte",
      "lat": 37.2744,
      "lon": 9.8739
    },
    {
      "name": "Gabès",
      "lat": 33.8815,
      "lon": 10.0982
    }
  ],
  "TR": [
    {
      "name": "Istanbul",
      "lat": 41.0082,
      "lon": 28.9784
    },
    {
      "name": "Ankara",
      "lat": 39.9334,
      "lon": 32.8597
    },
    {
      "name": "Izmir",
      "lat": 38.4237,
      "lon": 27.1428
    },
    {
      "name": "Bursa",
      "lat": 40.1885,
      "lon": 29.061
    },
    {
      "name": "Antalya",
      "lat": 36.8969,
      "lon": 30.7133
    },
    {
      "name": "Adana",
      "lat": 37.0,
      "lon": 35.3213
    },
    {
      "name": "Konya",
      "lat": 37.8746,
      "lon": 32.4932
    },
    {
      "name": "Gaziantep",
      "lat": 37.0662,
      "lon": 37.3833
    }
  ],
  "TM": [
    {
      "name": "Ashgabat",
      "lat": 37.9601,
      "lon": 58.3261
    },
    {
      "name": "Türkmenabat",
      "lat": 39.0733,
      "lon": 63.5786
    },
    {
      "name": "Daşoguz",
      "lat": 41.8363,
      "lon": 59.9666
    },
    {
      "name": "Mary",
      "lat": 37.5997,
      "lon": 61.8317
    },
    {
      "name": "Balkanabat",
      "lat": 39.5108,
      "lon": 54.3672
    },
    {
      "name": "Bayramaly",
      "lat": 37.6186,
      "lon": 62.1678
    }
  ],
  "TV": [
    {
      "name": "Funafuti",
      "lat": -8.5211,
      "lon": 179.1962
    },
    {
      "name": "Vaiaku",
      "lat": -8.525,
      "lon": 179.198
    }
  ],
  "UG": [
    {
      "name": "Kampala",
      "lat": 0.3476,
      "lon": 32.5825
    },
    {
      "name": "Nansana",
      "lat": 0.3667,
      "lon": 32.5333
    },
    {
      "name": "Kira",
      "lat": 0.3986,
      "lon": 32.6469
    },
    {
      "name": "Mbarara",
      "lat": -0.6072,
      "lon": 30.6545
    },
    {
      "name": "Mukono",
      "lat": 0.3533,
      "lon": 32.7553
    },
    {
      "name": "Gulu",
      "lat": 2.7747,
      "lon": 32.299
    }
  ],
  "UA": [
    {
      "name": "Kyiv",
      "lat": 50.4501,
      "lon": 30.5234
    },
    {
      "name": "Kharkiv",
      "lat": 49.9935,
      "lon": 36.2304
    },
    {
      "name": "Odesa",
      "lat": 46.4825,
      "lon": 30.7233
    },
    {
      "name": "Dnipro",
      "lat": 48.4647,
      "lon": 35.0462
    },
    {
      "name": "Donetsk",
      "lat": 48.0159,
      "lon": 37.8029
    },
    {
      "name": "Zaporizhzhia",
      "lat": 47.8388,
      "lon": 35.1396
    },
    {
      "name": "Lviv",
      "lat": 49.8397,
      "lon": 24.0297
    }
  ],
  "AE": [
    {
      "name": "Dubai",
      "lat": 25.2048,
      "lon": 55.2708
    },
    {
      "name": "Abu Dhabi",
      "lat": 24.4539,
      "lon": 54.3773
    },
    {
      "name": "Sharjah",
      "lat": 25.3463,
      "lon": 55.4209
    },
    {
      "name": "Al Ain",
      "lat": 24.2075,
      "lon": 55.7447
    },
    {
      "name": "Ajman",
      "lat": 25.4052,
      "lon": 55.5136
    },
    {
      "name": "Ras Al Khaimah",
      "lat": 25.7895,
      "lon": 55.9432
    }
  ],
  "GB": [
    {
      "name": "London",
      "lat": 51.5074,
      "lon": -0.1278
    },
    {
      "name": "Birmingham",
      "lat": 52.4862,
      "lon": -1.8904
    },
    {
      "name": "Manchester",
      "lat": 53.4808,
      "lon": -2.2426
    },
    {
      "name": "Glasgow",
      "lat": 55.8642,
      "lon": -4.2518
    },
    {
      "name": "Liverpool",
      "lat": 53.4084,
      "lon": -2.9916
    },
    {
      "name": "Edinburgh",
      "lat": 55.9533,
      "lon": -3.1883
    },
    {
      "name": "Bristol",
      "lat": 51.4545,
      "lon": -2.5879
    },
    {
      "name": "Leeds",
      "lat": 53.8008,
      "lon": -1.5491
    }
  ],
  "US": [
    {
      "name": "New York",
      "lat": 40.7128,
      "lon": -74.006
    },
    {
      "name": "Los Angeles",
      "lat": 34.0522,
      "lon": -118.2437
    },
    {
      "name": "Chicago",
      "lat": 41.8781,
      "lon": -87.6298
    },
    {
      "name": "Houston",
      "lat": 29.7604,
      "lon": -95.3698
    },
    {
      "name": "Phoenix",
      "lat": 33.4484,
      "lon": -112.074
    },
    {
      "name": "Philadelphia",
      "lat": 39.9526,
      "lon": -75.1652
    },
    {
      "name": "San Antonio",
      "lat": 29.4241,
      "lon": -98.4936
    },
    {
      "name": "San Diego",
      "lat": 32.7157,
      "lon": -117.1611
    },
    {
      "name": "Dallas",
      "lat": 32.7767,
      "lon": -96.797
    },
    {
      "name": "Seattle",
      "lat": 47.6062,
      "lon": -122.3321
    }
  ],
  "UY": [
    {
      "name": "Montevideo",
      "lat": -34.9011,
      "lon": -56.1645
    },
    {
      "name": "Salto",
      "lat": -31.3833,
      "lon": -57.9667
    },
    {
      "name": "Ciudad de la Costa",
      "lat": -34.8214,
      "lon": -55.9533
    },
    {
      "name": "Paysandú",
      "lat": -32.3214,
      "lon": -58.0756
    },
    {
      "name": "Las Piedras",
      "lat": -34.7214,
      "lon": -56.2167
    },
    {
      "name": "Maldonado",
      "lat": -34.9,
      "lon": -54.95
    }
  ],
  "UZ": [
    {
      "name": "Tashkent",
      "lat": 41.2995,
      "lon": 69.2401
    },
    {
      "name": "Samarkand",
      "lat": 39.6542,
      "lon": 66.9597
    },
    {
      "name": "Namangan",
      "lat": 40.9983,
      "lon": 71.6726
    },
    {
      "name": "Andijan",
      "lat": 40.7821,
      "lon": 72.3442
    },
    {
      "name": "Bukhara",
      "lat": 39.7747,
      "lon": 64.4286
    },
    {
      "name": "Nukus",
      "lat": 42.4602,
      "lon": 59.6166
    }
  ],
  "VU": [
    {
      "name": "Port Vila",
      "lat": -17.7333,
      "lon": 168.3222
    },
    {
      "name": "Luganville",
      "lat": -15.5333,
      "lon": 167.1667
    },
    {
      "name": "Norsup",
      "lat": -16.0667,
      "lon": 167.3833
    },
    {
      "name": "Isangel",
      "lat": -19.55,
      "lon": 169.2833
    },
    {
      "name": "Sola",
      "lat": -13.8833,
      "lon": 167.55
    },
    {
      "name": "Lakatoro",
      "lat": -16.1,
      "lon": 167.4167
    }
  ],
  "VE": [
    {
      "name": "Caracas",
      "lat": 10.4806,
      "lon": -66.9036
    },
    {
      "name": "Maracaibo",
      "lat": 10.6545,
      "lon": -71.6425
    },
    {
      "name": "Valencia",
      "lat": 10.162,
      "lon": -68.0077
    },
    {
      "name": "Barquisimeto",
      "lat": 10.0678,
      "lon": -69.3474
    },
    {
      "name": "Maracay",
      "lat": 10.2353,
      "lon": -67.5911
    },
    {
      "name": "Ciudad Guayana",
      "lat": 8.3533,
      "lon": -62.6517
    }
  ],
  "VN": [
    {
      "name": "Ho Chi Minh City",
      "lat": 10.8231,
      "lon": 106.6297
    },
    {
      "name": "Hanoi",
      "lat": 21.0285,
      "lon": 105.8542
    },
    {
      "name": "Da Nang",
      "lat": 16.0544,
      "lon": 108.2022
    },
    {
      "name": "Haiphong",
      "lat": 20.8449,
      "lon": 106.6881
    },
    {
      "name": "Can Tho",
      "lat": 10.0452,
      "lon": 105.7469
    },
    {
      "name": "Bien Hoa",
      "lat": 10.9575,
      "lon": 106.8427
    },
    {
      "name": "Nha Trang",
      "lat": 12.2388,
      "lon": 109.1967
    }
  ],
  "YE": [
    {
      "name": "Sanaa",
      "lat": 15.3694,
      "lon": 44.191
    },
    {
      "name": "Taiz",
      "lat": 13.5795,
      "lon": 44.0209
    },
    {
      "name": "Al Hudaydah",
      "lat": 14.7978,
      "lon": 42.9545
    },
    {
      "name": "Aden",
      "lat": 12.7855,
      "lon": 45.0187
    },
    {
      "name": "Ibb",
      "lat": 13.9667,
      "lon": 44.1833
    },
    {
      "name": "Dhamar",
      "lat": 14.5428,
      "lon": 44.4051
    }
  ],
  "ZM": [
    {
      "name": "Lusaka",
      "lat": -15.3875,
      "lon": 28.3228
    },
    {
      "name": "Kitwe",
      "lat": -12.8024,
      "lon": 28.2132
    },
    {
      "name": "Ndola",
      "lat": -12.9587,
      "lon": 28.6366
    },
    {
      "name": "Kabwe",
      "lat": -14.4469,
      "lon": 28.4464
    },
    {
      "name": "Chingola",
      "lat": -12.5333,
      "lon": 27.85
    },
    {
      "name": "Mufulira",
      "lat": -12.5498,
      "lon": 28.2407
    }
  ],
  "ZW": [
    {
      "name": "Harare",
      "lat": -17.8216,
      "lon": 31.0492
    },
    {
      "name": "Bulawayo",
      "lat": -20.15,
      "lon": 28.5833
    },
    {
      "name": "Chitungwiza",
      "lat": -18.0128,
      "lon": 31.0756
    },
    {
      "name": "Mutare",
      "lat": -18.9728,
      "lon": 32.6694
    },
    {
      "name": "Epworth",
      "lat": -17.89,
      "lon": 31.1475
    },
    {
      "name": "Gweru",
      "lat": -19.45,
      "lon": 29.8167
    }
  ]
};
