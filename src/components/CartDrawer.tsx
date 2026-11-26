import { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2, Check, ExternalLink, Copy } from "lucide-react";
import { copyText, dmUrl, rp, type CartMap, type Product } from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface CartDrawerProps {
  open: boolean;
  cart: CartMap;
  items: Product[];
  dm: string;
  onClose: () => void;
  onUpdateQty: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  open,
  cart,
  items,
  dm,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const rows = Object.keys(cart)
    .map((id) => ({
      product: items.find((x) => x.id === Number(id)),
      qty: cart[Number(id)],
    }))
    .filter((r): r is { product: Product; qty: number } => Boolean(r.product && r.qty > 0));

  const total = rows.reduce((sum, r) => sum + r.product.price * r.qty, 0);
  const totalItems = rows.reduce((sum, r) => sum + r.qty, 0);

  const msg =
    "Halo admin, saya mau pesan:\n" +
    rows
      .map((r) => `- ${r.product.name} x${r.qty} (${rp(r.product.price * r.qty)})`)
      .join("\n") +
    `\nTotal: ${rp(total)}`;

  const url = dmUrl(dm);
  const isWa = /wa\.me/i.test(url);
  const isIg = /instagram|ig\.me/i.test(url);
  const targetUrl = isWa
    ? `${url}${url.includes("?") ? "&" : "?"}text=${encodeURIComponent(msg)}`
    : url;

  const checkoutLabel = isWa
    ? "Kirim pesanan lewat WhatsApp"
    : isIg
      ? "Salin pesanan & buka Instagram"
      : "Salin pesanan & buka chat admin";

  const handleCopyOnly = async () => {
    await copyText(msg);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  const handleCheckoutLinkClick = async () => {
    if (!isWa) {
      await copyText(msg);
      setCopied(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang Belanja"
        className="flex h-full w-full max-w-[430px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Keranjang
            </h2>
            <span className="text-xs text-neutral-500 tabular-nums">
              {totalItems} item
            </span>
          </div>
          <div className="flex items-center gap-2">
            {rows.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="px-2 py-1 text-xs font-medium text-neutral-500 transition-colors hover:text-[#c82323]"
              >
                Kosongkan
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup keranjang"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {rows.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-neutral-900">
                Keranjang masih kosong.
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Pilih produk dari katalog terlebih dahulu.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-[10px] border border-neutral-900 px-5 py-2 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {rows.map(({ product, qty }) => {
                const atMax =
                  product.stock !== null &&
                  product.stock !== undefined &&
                  qty >= product.stock;

                return (
                  <li key={product.id} className="flex gap-4 py-4">
                    <div className="h-18 w-18 shrink-0 overflow-hidden rounded-[6px] bg-[#f8f8f7]">
                      <ProductVisual product={product} />
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-neutral-900">
                            {product.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-neutral-500 tabular-nums">
                            {rp(product.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Hapus ${product.name}`}
                          className="p-1 text-neutral-400 transition-colors hover:text-[#c82323]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-neutral-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, -1)}
                            aria-label="Kurangi"
                            className="inline-flex h-8 w-8 items-center justify-center text-neutral-700 hover:bg-neutral-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            disabled={atMax}
                            onClick={() => onUpdateQty(product.id, 1)}
                            aria-label="Tambah"
                            className={`inline-flex h-8 w-8 items-center justify-center ${
                              atMax
                                ? "cursor-not-allowed text-neutral-300"
                                : "text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                          {rp(product.price * qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer / Checkout */}
        {rows.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50/70 px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-neutral-600">Total</span>
              <span className="text-xl font-bold text-neutral-950 tabular-nums">
                {rp(total)}
              </span>
            </div>

            <p
              className={`mt-2.5 text-xs leading-relaxed ${
                copied ? "font-medium text-emerald-700" : "text-neutral-500"
              }`}
            >
              {copied
                ? "Pesanan tersalin. Di chat, tahan kolom pesan lalu pilih Tempel, kemudian kirim."
                : "Silakan DM admin untuk membeli. Pesanan disalin otomatis, tinggal tempel di chat lalu kirim."}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {url ? (
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCheckoutLinkClick}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0a0a0a] px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  <span>{checkoutLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <p className="text-xs text-neutral-500">Kontak admin belum diisi.</p>
              )}

              <button
                type="button"
                onClick={handleCopyOnly}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-neutral-300 bg-white px-4 text-xs font-medium text-neutral-800 transition-colors hover:border-neutral-900"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Tersalin ke Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Format Pesanan Saja</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
