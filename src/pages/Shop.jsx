import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Drawer from "../components/ui/Drawer";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import Pagination from "../components/ui/Pagination";
import Select from "../components/ui/Select";
import ActiveFilters from "../components/product/ActiveFilters";
import FilterPanel from "../components/product/FilterPanel";
import ProductGrid from "../components/product/ProductGrid";
import { PAGE_SIZE, SORT_OPTIONS } from "../config/site";
import { useCatalog } from "../context/CatalogContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { queryProducts } from "../utils/catalog";
import { formatCurrency, slugToTitle } from "../utils/format";

const FILTER_KEYS = ["q", "category", "min", "max", "rating", "stock"];

export default function Shop() {
  const { products, categories, loading, error, reload } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = Object.fromEntries(
    FILTER_KEYS.map((key) => [key, params.get(key) || ""]),
  );
  const sort = params.get("sort") || "featured";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const results = useMemo(
    () => queryProducts(products, filters, sort),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      products,
      filters.q,
      filters.category,
      filters.min,
      filters.max,
      filters.rating,
      filters.stock,
      sort,
    ],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const updateParams = useCallback(
    (changes) => {
      const next = new URLSearchParams(params);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === "" || value == null || value === "featured")
          next.delete(key);
        else next.set(key, String(value));
      });
      if (!("page" in changes)) next.delete("page");
      setParams(next);
    },
    [params, setParams],
  );

  const clearAll = () =>
    updateParams(Object.fromEntries(FILTER_KEYS.map((k) => [k, ""])));

  const categoryName =
    categories.find((c) => c.slug === filters.category)?.name ||
    slugToTitle(filters.category);
  const chips = [];
  if (filters.q)
    chips.push({ key: "q", label: `Search: “${filters.q}”`, clear: { q: "" } });
  if (filters.category)
    chips.push({
      key: "category",
      label: categoryName,
      clear: { category: "" },
    });
  if (filters.min !== "" || filters.max !== "") {
    const label =
      filters.min !== "" && filters.max !== ""
        ? `${formatCurrency(filters.min)} – ${formatCurrency(filters.max)}`
        : filters.max !== ""
          ? `Under ${formatCurrency(filters.max)}`
          : `${formatCurrency(filters.min)} and up`;
    chips.push({ key: "price", label, clear: { min: "", max: "" } });
  }
  if (filters.rating)
    chips.push({
      key: "rating",
      label: `${filters.rating}★ & up`,
      clear: { rating: "" },
    });
  if (filters.stock)
    chips.push({ key: "stock", label: "In stock", clear: { stock: "" } });

  const heading = filters.q
    ? `Results for “${filters.q}”`
    : filters.category
      ? categoryName
      : "All products";
  useDocumentTitle(heading);

  const panel = (showTitle) => (
    <FilterPanel
      categories={categories}
      filters={filters}
      onChange={updateParams}
      onClear={clearAll}
      hasFilters={chips.length > 0}
      showTitle={showTitle}
    />
  );

  if (error) {
    return (
      <Container className="py-20">
        <ErrorState
          title="We couldn’t load the products"
          message={error}
          onRetry={reload}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-10">
      <div className="grid gap-10 lg:grid-cols-[17rem_1fr] xl:gap-14">
        <aside className="hidden lg:block">
          <div className="no-scrollbar sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto pr-1">
            {panel(true)}
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div>
              <h1 className="title">{heading}</h1>
              <p className="caption mt-1.5" aria-live="polite">
                {loading
                  ? "Loading…"
                  : `${results.length} ${results.length === 1 ? "product" : "products"}`}
              </p>
            </div>
            <div className="flex items-end gap-3">
              <Button
                variant="secondary"
                className="lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <Icon name="filter" className="h-4.5 w-4.5" /> Filters
                {chips.length > 0 && ` (${chips.length})`}
              </Button>
              <Select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                selectClassName="h-11 rounded-full pl-5 text-sm font-medium"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <ActiveFilters chips={chips} onRemove={updateParams} />

          {!loading && results.length === 0 ? (
            <EmptyState
              icon="search"
              title="No products found"
              message="Try removing a filter or searching for something broader."
              action={<Button onClick={clearAll}>Clear all filters</Button>}
            />
          ) : (
            <>
              <ProductGrid
                products={pageItems}
                loading={loading}
                skeletonCount={PAGE_SIZE}
                className="md:grid-cols-3"
              />
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={(p) => {
                  updateParams({ page: p > 1 ? p : "" });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          )}
        </section>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="left"
        title="Filters"
        footer={
          <Button fullWidth size="lg" onClick={() => setFiltersOpen(false)}>
            Show {results.length} results
          </Button>
        }
      >
        <div className="p-5">{panel(false)}</div>
      </Drawer>
    </Container>
  );
}
