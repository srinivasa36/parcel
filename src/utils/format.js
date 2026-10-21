import { CURRENCY, LOCALE } from "../config/site";

const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});
const date = new Intl.DateTimeFormat(undefined, { dateStyle: "long" });

export const formatCurrency = (value) => currency.format(value ?? 0);
export const formatDate = (value) => date.format(new Date(value));
export const slugToTitle = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
export const shortOrderId = (id = "") => id.slice(0, 8).toUpperCase();
