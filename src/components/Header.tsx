import { Search, ShoppingBag } from "lucide-react";
import { dmUrl, LOGO } from "../data/catalog";

interface HeaderProps {
  shopName: string;
  tagline: string;
  logo: string;
  dm: string;
  cartCount: number;
  searchOpen: boolean;
  onToggleSearch: () => void;
  onOpenCart: () => void;
  onResetFilter: () => void;
}

export function Header({
  shopName,
  tagline,
  logo,
  dm,
  cartCount,
  searchOpen,
  onToggleSearch,
  onOpenCart,
  onResetFilter,
}: HeaderProps) {
  const adminDm = dmUrl(dm);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800/90 bg-[#050505] text-white">
      <div className="relative mx-auto grid max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:gap-4 sm:px-8 sm:py-3.5">
        {/* Left Zone: Gold Search Icon */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onToggleSearch}
            aria-expanded={searchOpen}
            aria-label="Cari produk"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#d6a736] transition-colors hover:bg-white/10 hover:text-[#ebd082] shrink-0"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Center Zone: Circular Makkah Emblem + Italic Gold Wordmark */}
        <button
          type="button"
          onClick={onResetFilter}
          className="group flex items-center gap-2.5 text-left focus-visible:outline-[#d6a736] sm:gap-3"
        >
          <span className="relative shrink-0 rounded-full p-[2px] ring-1 ring-[#d6a736]/60">
            <img
              src={logo || LOGO}
              alt={`Logo ${shopName}`}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border-[1.5px] border-[#d6a736] bg-black object-cover transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12"
            />
          </span>

          <span className="flex flex-col leading-none">
            <span
              className="text-[22px] font-extrabold italic tracking-[0.01em] text-[#d6a736] sm:text-[30px] whitespace-nowrap"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {shopName}
            </span>
            {tagline && (
              <span className="mt-0.5 text-[9px] font-medium tracking-[0.26em] text-[#c99e3a] lowercase sm:text-[10px]">
                {tagline}
              </span>
            )}
          </span>
        </button>

        {/* Right Zone: DM Admin CTA (desktop) + Cart Button */}
        <div className="flex items-center justify-end gap-2 sm:gap-3.5">
          {adminDm && (
            <a
              href={adminDm}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex h-9 items-center justify-center bg-[#d6a736] px-5 text-xs font-bold tracking-wide text-[#0a0a0a] transition-all hover:brightness-110 whitespace-nowrap shrink-0"
              style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
            >
              DM admin
            </a>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Keranjang (${cartCount} item)`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#d6a736] transition-colors hover:bg-white/10 shrink-0"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d6a736] px-1 text-[11px] font-bold text-[#0a0a0a] tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Centered Slanted Gold Accent Bar at Header Bottom Edge */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-1px] left-1/2 h-[3px] w-28 -translate-x-1/2 -skew-x-[30deg] bg-[#d6a736] sm:w-36"
        />
      </div>
    </header>
  );
}
