import { slugToTitle } from "./format";

export function buildCategories(products) {
  const map = new Map();
  products.forEach((p) => {
    const entry = map.get(p.category) || {
      slug: p.category,
      name: slugToTitle(p.category),
      count: 0,
      cover: p,
    };
    entry.count += 1;
    if (p.rating > entry.cover.rating) entry.cover = p;
    map.set(p.category, entry);
  });
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const haystack = (p) =>
  `${p.title} ${p.brand || ""} ${p.category} ${(p.tags || []).join(" ")}`.toLowerCase();

export function searchProducts(products, q) {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return products;
  return products
    .filter((p) => {
      const text = haystack(p);
      return tokens.every((t) => text.includes(t));
    })
    .sort(
      (a, b) =>
        Number(b.title.toLowerCase().startsWith(tokens[0])) -
        Number(a.title.toLowerCase().startsWith(tokens[0])),
    );
}

const SORTERS = {
  "price-asc": (a, b) => a.finalPrice - b.finalPrice,
  "price-desc": (a, b) => b.finalPrice - a.finalPrice,
  "rating-desc": (a, b) => b.rating - a.rating,
  "discount-desc": (a, b) => b.discountPercentage - a.discountPercentage,
  "name-asc": (a, b) => a.title.localeCompare(b.title),
};

export function queryProducts(products, filters, sort = "featured") {
  const {
    q = "",
    category = "",
    min = "",
    max = "",
    rating = "",
    stock = "",
  } = filters;
  let result = searchProducts(products, q);
  if (category) result = result.filter((p) => p.category === category);
  if (min !== "") result = result.filter((p) => p.finalPrice >= Number(min));
  if (max !== "") result = result.filter((p) => p.finalPrice <= Number(max));
  if (rating) result = result.filter((p) => p.rating >= Number(rating));
  if (stock) result = result.filter((p) => p.stock > 0);
  const sorter = SORTERS[sort];
  return sorter ? [...result].sort(sorter) : result;
}
