import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, Check, AlertCircle } from "lucide-react";
import { isGone, rp, type Product } from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface QuickViewModalProps {
  product: Product | null;
  qtyInCart: number;
  onClose: () => void;
  onAddMultiple: (product: Product, count: number) => "added" | "max";
}

export function QuickViewModal({
  product,
  qtyInCart,
  onClose,
  onAddMultiple,
}: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState<"idle" | "added" | "max">("idle");

  useEffect(() => {
    setQty(1);
    setFeedback("idle");
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const gone = isGone(product);
  const remaining =
    product.stock !== null && product.stock !== undefined
      ? Math.max(0, product.stock - qtyInCart)
      : null;

  const handleConfirm = () => {
    if (gone) return;
    const res = onAddMultiple(product, qty);
    setFeedback(res);
    window.setTimeout(() => setFeedback("idle"), 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="relative grid w-full max-w-2xl overflow-hidden rounded-[14px] bg-white shadow-2xl sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute top-3.5 right-3.5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100 hover:text-neutral-950"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Left Image */}
        <div className="aspect-square w-full bg-[#f8f8f7]">
          <ProductVisual product={product} />
        </div>

        {/* Right Details */}
        <div className="flex flex-col justify-between p-6 sm:p-7">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
              {product.cat}
            </p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-950">
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-3 tabular-nums">
              <span className="text-xl font-bold text-[#c82323]">{rp(product.price)}</span>
              {product.old ? (
                <s className="text-sm text-neutral-400">{rp(product.old)}</s>
              ) : null}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
              {product.tag && <p>{product.tag}</p>}
              <p>
                Ketersediaan:{" "}
                {gone ? (
                  <span className="font-semibold text-[#c82323]">Stok habis</span>
                ) : product.stock !== null ? (
                  <span className="font-medium text-neutral-900">
                    Tersedia {product.stock} pcs
                    {qtyInCart > 0 ? ` (${qtyInCart} sudah di keranjang)` : ""}
                  </span>
                ) : (
                  <span className="font-medium text-neutral-900">Tersedia</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {!gone && (
              <div className="flex items-center justify-between border border-neutral-200 rounded-[10px] px-3 py-2">
                <span className="text-xs font-medium text-neutral-600">Jumlah</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() =>
                      setQty((q) =>
                        remaining !== null ? Math.min(Math.max(1, remaining), q + 1) : q + 1
                      )
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={gone || remaining === 0}
              onClick={handleConfirm}
              className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-medium transition-colors ${
                gone || remaining === 0
                  ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                  : feedback === "added"
                    ? "bg-emerald-900 text-white"
                    : feedback === "max"
                      ? "bg-[#9b1c1c] text-white"
                      : "bg-[#0a0a0a] text-white hover:bg-neutral-800"
              }`}
            >
              {gone ? (
                <span>Stok Habis</span>
              ) : remaining === 0 ? (
                <span>Stok di keranjang sudah maksimal</span>
              ) : feedback === "added" ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Ditambahkan ke keranjang</span>
                </>
              ) : feedback === "max" ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span>Stok maksimal tercapai</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Tambah ke keranjang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
