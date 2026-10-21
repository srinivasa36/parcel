import { USD_TO_INR } from "../config/site";

const BASE = "https://dummyjson.com";
const LIST_FIELDS =
  "title,category,price,discountPercentage,rating,stock,tags,brand,thumbnail";

const withFinalPrice = (p) => {
  const price = Math.round(p.price * USD_TO_INR);
  return {
    ...p,
    price,
    finalPrice: Math.round(price * (1 - (p.discountPercentage || 0) / 100)),
  };
};

let catalogPromise;

export function fetchCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(`${BASE}/products?limit=0&select=${LIST_FIELDS}`)
      .then((res) => {
        if (!res.ok)
          throw new Error(
            "We couldn’t load the products. Check your connection and try again.",
          );
        return res.json();
      })
      .then((data) => data.products.map(withFinalPrice))
      .catch((err) => {
        catalogPromise = undefined;
        throw err;
      });
  }
  return catalogPromise;
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`);
  if (res.status === 404) throw new Error("We couldn’t find that product.");
  if (!res.ok)
    throw new Error("We couldn’t load this product. Please try again.");
  return withFinalPrice(await res.json());
}
