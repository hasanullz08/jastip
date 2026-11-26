import { useState, useRef, useEffect } from "react";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";
import { isGone, rp, type Product } from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface ProductCardProps {
  product: Product;
  qtyInCart: number;
  onAddToCart: (product: Product) => "added" | "max";
  onInspect: (product: Product) => void;
}

export function ProductCard({
  product,
  qtyInCart,
  onAddToCart,
  onInspect,
}: ProductCardProps) {
  const [btnState, setBtnState] = useState<"idle" | "added" | "max">("idle");
  const timerRef = useRef<number | null>(null);
  const gone = isGone(product);
  const lowStock = product.stock !== null && product.stock > 0 && product.stock <= 2;

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = () => {
    if (gone) return;
    const result = onAddToCart(product);
    setBtnState(result);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setBtnState("idle"), 900);
  };

  return (
    <article className="group flex flex-col">
      {/* Studio Image Frame */}
      <button
        type="button"
        onClick={() => onInspect(product)}
        aria-label={`Lihat detail ${product.name}`}
        className={`relative aspect-square w-full overflow-hidden rounded-[6px] bg-[#f8f8f7] text-left transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
          gone ? "opacity-55" : ""
        }`}
      >
        <ProductVisual product={product} />

        {/* Quiet un-spammy single status label */}
        {gone ? (
          <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-neutral-700 uppercase">
            Habis
          </span>
        ) : product.isNew ? (
          <span className="absolute top-3 left-3 bg-neutral-950 px-2.5 py-1 text-[11px] font-medium tracking-wider text-white uppercase">
            Baru
          </span>
        ) : null}

        {qtyInCart > 0 && !gone && (
          <span className="absolute top-3 right-3 bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-neutral-900 tabular-nums shadow-xs">
            {qtyInCart} di keranjang
          </span>
        )}
      </button>

      {/* Centered Product Metadata & Price (Reference Aesthetic) */}
      <div className="mt-4 flex flex-1 flex-col items-center text-center">
        <button
          type="button"
          onClick={() => onInspect(product)}
          className="line-clamp-2 min-h-[2.4rem] text-[13px] font-semibold tracking-[0.04em] text-neutral-900 uppercase transition-colors hover:text-neutral-600"
        >
          {product.name}
        </button>

        <div className="mt-1 min-h-[1.1rem] text-[12px] text-neutral-500">
          {product.tag ? (
            <span>{product.tag}</span>
          ) : lowStock ? (
            <span className="font-medium text-[#c82323]">Sisa {product.stock}</span>
          ) : (
            <span className="text-neutral-400">{product.cat}</span>
          )}
          {product.tag && lowStock && (
            <span className="font-medium text-[#c82323]"> · Sisa {product.stock}</span>
          )}
        </div>

        {/* Price Row */}
        <div className="mt-1.5 flex items-baseline justify-center gap-2.5 tabular-nums">
          <span className="text-[15px] font-bold text-[#c82323]">{rp(product.price)}</span>
          {product.old ? (
            <s className="text-[13px] font-normal text-neutral-400">{rp(product.old)}</s>
          ) : null}
        </div>
      </div>

      {/* Full-Width Black Add-to-Cart Button */}
      <button
        type="button"
        disabled={gone}
        onClick={handleAdd}
        className={`mt-3.5 inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[10px] px-4 text-[13px] font-medium tracking-wide transition-all duration-150 ${
          gone
            ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
            : btnState === "added"
              ? "bg-emerald-900 text-white"
              : btnState === "max"
                ? "bg-[#9b1c1c] text-white"
                : "bg-[#0a0a0a] text-white hover:bg-neutral-800 active:scale-[0.985]"
        }`}
      >
        {gone ? (
          <span>Stok Habis</span>
        ) : btnState === "added" ? (
          <>
            <Check className="h-4 w-4 shrink-0" />
            <span>Ditambahkan</span>
          </>
        ) : btnState === "max" ? (
          <>
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Stok maksimal</span>
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span>Tambah ke keranjang</span>
          </>
        )}
      </button>
    </article>
  );
}
