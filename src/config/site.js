export const SITE_NAME = "Parcel";
export const CURRENCY = "INR";
export const LOCALE = "en-IN";

export const USD_TO_INR = 96;
export const TAX_RATE = 0.18; // GST
export const FREE_SHIPPING_THRESHOLD = 999;
export const MAX_QTY = 10;
export const PAGE_SIZE = 12;

export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard delivery",
    eta: "3–5 business days",
    price: 99,
    freeOver: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: "express",
    label: "Express delivery",
    eta: "1–2 business days",
    price: 199,
  },
];

export const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "United Arab Emirates",
];

export const FEATURED_CATEGORIES = [
  "smartphones",
  "laptops",
  "fragrances",
  "furniture",
  "womens-bags",
  "sunglasses",
  "mens-watches",
  "groceries",
];
export const HERO_CATEGORIES = ["smartphones", "fragrances", "furniture"];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Top rated" },
  { value: "discount-desc", label: "Biggest discount" },
  { value: "name-asc", label: "Name: A to Z" },
];

export const PRICE_PRESETS = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 – ₹20,000", min: 5000, max: 20000 },
  { label: "₹20,000 and up", min: 20000, max: "" },
];
