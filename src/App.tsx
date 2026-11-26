import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronRight, Search, X, ArrowUpRight, CornerRightUp } from "lucide-react";
import {
  CATS,
  dmUrl,
  getInitialCart,
  getInitialState,
  saveCartState,
  saveState,
  type CartMap,
  type Product,
  type StoreState,
} from "./data/catalog";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { ProductCard } from "./components/ProductCard";
import { QuickViewModal } from "./components/QuickViewModal";
import { CartDrawer } from "./components/CartDrawer";
import { AdminView } from "./components/AdminView";

type SortMode = "rec" | "lo" | "hi";

export default function App() {
  const [store, setStore] = useState<StoreState>(() => getInitialState());
  const [cart, setCart] = useState<CartMap>(() => getInitialCart());
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(
    () => window.location.hash === "#admin"
  );
  const [authed, setAuthed] = useState(false);

  const [category, setCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("rec");

  const [cartOpen, setCartOpen] = useState(false);
  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ text: string; isError?: boolean } | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const catalogSectionRef = useRef<HTMLElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onHash = () => {
      const admin = window.location.hash === "#admin";
      setIsAdminRoute(admin);
      if (admin) setCartOpen(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 360);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, q) => sum + q, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = store.items.filter((p) => {
      const matchCat = category === "Semua" || p.cat === category;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    if (sortMode === "lo") return [...list].sort((a, b) => a.price - b.price);
    if (sortMode === "hi") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [store.items, category, searchQuery, sortMode]);

  const triggerToast = (text: string, isError = false) => {
    setToast({ text, isError });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2600);
  };

  // Same Add-to-Cart logic as the previous web
  const handleAddToCart = (product: Product, count = 1): "added" | "max" => {
    const current = cart[product.id] || 0;
    if (
      product.stock !== null &&
      product.stock !== undefined &&
      current + count > product.stock
    ) {
      if (current >= product.stock) {
        triggerToast(`Stok ${product.name} sudah maksimal di keranjang.`, true);
        return "max";
      }
      const allowed = product.stock - current;
      const nextCart = { ...cart, [product.id]: current + allowed };
      setCart(nextCart);
      saveCartState(nextCart);
      triggerToast(`${product.name} (+${allowed}) ditambahkan ke keranjang.`);
      return "added";
    }

    const nextCart = { ...cart, [product.id]: current + count };
    setCart(nextCart);
    saveCartState(nextCart);
    triggerToast(`${product.name} ditambahkan ke keranjang.`);
    return "added";
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    const product = store.items.find((x) => x.id === productId);
    if (!product) return;
    const current = cart[productId] || 0;
    const nextQty = current + delta;

    if (nextQty <= 0) {
      const nextCart = { ...cart };
      delete nextCart[productId];
      setCart(nextCart);
      saveCartState(nextCart);
      return;
    }

    if (
      delta > 0 &&
      product.stock !== null &&
      product.stock !== undefined &&
      nextQty > product.stock
    ) {
      return;
    }

    const nextCart = { ...cart, [productId]: nextQty };
    setCart(nextCart);
    saveCartState(nextCart);
  };

  const handleRemoveCartItem = (productId: number) => {
    const nextCart = { ...cart };
    delete nextCart[productId];
    setCart(nextCart);
    saveCartState(nextCart);
  };

  const handleClearCart = () => {
    setCart({});
    saveCartState({});
  };

  const handleUpdateStore = (next: StoreState): boolean => {
    setStore(next);
    return saveState(next);
  };

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const adminDm = dmUrl(store.dm);

  if (isAdminRoute) {
    return (
      <AdminView
        store={store}
        authed={authed}
        onAuthChange={setAuthed}
        onUpdateStore={handleUpdateStore}
        onExitAdmin={() => {
          window.location.hash = "";
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col overflow-x-clip">
      <Header
        shopName={store.shop}
        tagline={store.tagline}
        logo={store.logo}
        dm={store.dm}
        cartCount={cartCount}
        searchOpen={searchOpen}
        onToggleSearch={() => setSearchOpen((prev) => !prev)}
        onOpenCart={() => setCartOpen(true)}
        onResetFilter={() => {
          setCategory("Semua");
          setSearchQuery("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Expandable Minimal Search Strip */}
      {searchOpen && (
        <div className="border-b border-neutral-200 bg-neutral-50/80">
          <div className="mx-auto flex max-w-[1360px] items-center gap-3 px-4 py-3 sm:px-8">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari parfum, tumbler, sajadah, coklat..."
              aria-label="Cari produk"
              className="w-full bg-transparent text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <HeroBanner
        shopName={store.shop}
        arabicTitle={store.arabicTitle}
        announcement={store.ann}
        announcementSub={store.annSub}
        dm={store.dm}
        items={store.items}
        onSelectCategory={(cat) => {
          setCategory(cat);
          scrollToCatalog();
        }}
        onTriggerSearch={() => {
          setSearchOpen(true);
          window.setTimeout(() => searchInputRef.current?.focus(), 60);
        }}
      />

      <main ref={catalogSectionRef} className="mx-auto w-full max-w-[1360px] flex-1 px-4 pt-12 pb-20 sm:px-8">
        {/* Centered Editorial Heading with Short Underline (matching reference image) */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-[28px]">
            {category === "Semua" ? "Katalog Pilihan" : category}
          </h2>
          <div className="mx-auto mt-3.5 h-[1.5px] w-14 bg-neutral-800" />
        </div>

        {/* Category Filter Tabs & Sort Bar */}
        <div className="mt-8 flex flex-col gap-4 border-b border-neutral-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div
            className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 md:pb-0"
            role="tablist"
            aria-label="Kategori produk"
          >
            {["Semua", ...CATS].map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(c)}
                  className={`rounded-[8px] px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-[#0a0a0a] text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 shrink-0 md:justify-end">
            <span className="text-xs text-neutral-500 tabular-nums">
              {filteredProducts.length} produk
            </span>
            <label className="flex items-center gap-2 text-xs text-neutral-600">
              <span>Urutkan</span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                aria-label="Urutkan produk"
                className="h-9 rounded-[8px] border border-neutral-300 bg-white px-2.5 text-xs font-medium text-neutral-900"
              >
                <option value="rec">Rekomendasi</option>
                <option value="lo">Harga terendah</option>
                <option value="hi">Harga tertinggi</option>
              </select>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qtyInCart={cart[product.id] || 0}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onInspect={(p) => setInspectProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm font-medium text-neutral-900">
              Produk tidak ditemukan.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Coba kata kunci lain atau lihat semua kategori.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("Semua");
                setSearchQuery("");
              }}
              className="mt-5 rounded-[8px] border border-neutral-900 px-5 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        )}

        {/* Centered Hairline-Flanked Outlined Button (matching "View all products >" in screenshot) */}
        <div className="mt-14 flex items-center gap-6">
          <div className="h-px flex-1 bg-neutral-200" />
          {category !== "Semua" || searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setCategory("Semua");
                setSearchQuery("");
                scrollToCatalog();
              }}
              className="inline-flex h-10 items-center gap-1.5 border border-neutral-900 bg-white px-6 text-xs font-medium text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white whitespace-nowrap"
            >
              <span>Lihat semua produk</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : adminDm ? (
            <a
              href={adminDm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 border border-neutral-900 bg-white px-6 text-xs font-medium text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white whitespace-nowrap"
            >
              <span>Tanya atau request via DM</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <div className="h-px flex-1 bg-neutral-200" />
        </div>
      </main>

      {/* Quiet Minimal Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50/50">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-neutral-500 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">{store.shop}</span>
            {store.footerNote && (
              <>
                <span aria-hidden="true">·</span>
                <span>{store.footerNote}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-5">
            {adminDm && (
              <a
                href={adminDm}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 transition-colors"
              >
                DM Admin
              </a>
            )}
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#admin";
                setIsAdminRoute(true);
              }}
              className="hover:text-neutral-900 transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </footer>

      {/* Subtle Back-to-Top Control (inspired by bottom-left curved arrow in reference) */}
      {showBackTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Kembali ke atas"
          className="fixed bottom-5 left-5 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-md transition-transform hover:-translate-y-0.5 hover:border-neutral-900"
        >
          <CornerRightUp className="h-4 w-4" />
        </button>
      )}

      {/* Quiet Non-Intrusive Cart Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-[10px] px-4 py-3 text-xs font-medium text-white shadow-lg ${
            toast.isError ? "bg-[#9b1c1c]" : "bg-[#0a0a0a]"
          }`}
        >
          <span>{toast.text}</span>
          {!toast.isError && (
            <button
              type="button"
              onClick={() => {
                setToast(null);
                setCartOpen(true);
              }}
              className="border-l border-white/25 pl-3 font-semibold text-[#e3c376] hover:underline whitespace-nowrap"
            >
              Lihat keranjang
            </button>
          )}
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={inspectProduct}
        qtyInCart={inspectProduct ? cart[inspectProduct.id] || 0 : 0}
        onClose={() => setInspectProduct(null)}
        onAddMultiple={(p, count) => handleAddToCart(p, count)}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        cart={cart}
        items={store.items}
        dm={store.dm}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
