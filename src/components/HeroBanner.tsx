import { Search, Plus, ArrowUpRight } from "lucide-react";
import { CATS, dmUrl, type Product } from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface HeroBannerProps {
  shopName: string;
  arabicTitle: string;
  announcement: string;
  announcementSub: string;
  dm: string;
  items: Product[];
  onSelectCategory: (category: string) => void;
  onTriggerSearch: () => void;
}

const DESKTOP_SLOTS = [
  {
    cat: "Tumbler",
    positionClass: "left-[2.5%] lg:left-[4.5%] top-[34%] -rotate-[8deg] hover:-rotate-[4deg]",
  },
  {
    cat: "Sajadah",
    positionClass: "left-[16.5%] lg:left-[18.5%] -top-[5%] rotate-[9deg] hover:rotate-[5deg]",
  },
  {
    cat: "Parfum Ibraq Diamond",
    positionClass: "left-[18%] lg:left-[20.5%] top-[53%] -rotate-[6deg] hover:-rotate-[2deg]",
  },
  {
    cat: "Parfum Lainnya",
    positionClass: "right-[16.5%] lg:right-[18.5%] -top-[6%] -rotate-[8deg] hover:-rotate-[4deg]",
  },
  {
    cat: "Reef Mini",
    positionClass: "right-[18%] lg:right-[20.5%] top-[52%] rotate-[7deg] hover:rotate-[3deg]",
  },
  {
    cat: "Coklat",
    positionClass: "right-[2.5%] lg:right-[4.5%] top-[28%] rotate-[6deg] hover:rotate-[2deg]",
  },
] as const;

const MOBILE_TOP_SLOTS = [
  { cat: "Sajadah", tilt: "-rotate-[7deg] translate-y-1" },
  { cat: "Parfum Ibraq Diamond", tilt: "rotate-[2deg] -translate-y-1 z-10" },
  { cat: "Parfum Lainnya", tilt: "rotate-[7deg] translate-y-1" },
] as const;

const MOBILE_BOTTOM_SLOTS = [
  { cat: "Tumbler", tilt: "rotate-[6deg] -translate-y-1" },
  { cat: "Reef Mini", tilt: "-rotate-[2deg] translate-y-1 z-10" },
  { cat: "Coklat", tilt: "-rotate-[6deg] -translate-y-1" },
] as const;

export function HeroBanner({
  shopName,
  arabicTitle,
  announcement,
  announcementSub,
  dm,
  items,
  onSelectCategory,
  onTriggerSearch,
}: HeroBannerProps) {
  const adminDm = dmUrl(dm);

  const getPreviewProduct = (cat: string): Product | undefined => {
    const inCat = items.filter((p) => p.cat === cat);
    if (!inCat.length) return undefined;
    const withImg = inCat.find((p) => Boolean(p.img));
    if (withImg) return withImg;
    if (cat === "Parfum Ibraq Diamond") {
      return (
        inCat.find((p) => p.name.toLowerCase().includes("emerald")) || inCat[0]
      );
    }
    return inCat[0];
  };

  return (
    <section
      aria-label="Sorotan Jastip"
      className="mx-auto w-full max-w-[1360px] px-4 pt-5 sm:px-8 sm:pt-6"
    >
      {/* Showcase Window */}
      <div
        className="relative flex flex-col items-center justify-between overflow-hidden rounded-[20px] border border-neutral-200/80 py-5 md:h-[440px] md:justify-center md:py-0 lg:h-[490px]"
        style={{
          background:
            "radial-gradient(62% 72% at 50% 45%, #ffffff 0%, #f5f1e8 78%, #eee8db 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 44% at 50% 46%, rgba(212, 175, 90, 0.14), transparent 72%)",
          }}
        />

        {/* MOBILE TOP CLUSTER */}
        <div className="relative z-10 mb-3 flex w-full items-center justify-center gap-2.5 px-3 md:hidden">
          {MOBILE_TOP_SLOTS.map((slot) => {
            const preview = getPreviewProduct(slot.cat);
            if (!preview) return null;
            return (
              <button
                key={slot.cat}
                type="button"
                onClick={() => onSelectCategory(slot.cat)}
                aria-label={`Lihat kategori ${slot.cat}`}
                className={`group relative flex w-[30%] max-w-[108px] aspect-[0.82] flex-col overflow-hidden rounded-[16px] border border-black/[0.05] bg-white shadow-[0_10px_24px_rgba(15,12,8,0.1)] transition-transform duration-200 active:scale-95 ${slot.tilt}`}
              >
                <span className="w-full truncate px-1.5 pt-1.5 text-center text-[9.5px] font-medium text-neutral-500">
                  {slot.cat}
                </span>
                <div className="relative flex-1 w-full overflow-hidden">
                  <ProductVisual product={preview} className="p-2" />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 left-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-xs"
                >
                  <Plus className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>

        {/* DESKTOP FLOATING TILTED CARDS */}
        {DESKTOP_SLOTS.map((slot) => {
          const preview = getPreviewProduct(slot.cat);
          if (!preview) return null;

          return (
            <button
              key={slot.cat}
              type="button"
              onClick={() => onSelectCategory(slot.cat)}
              aria-label={`Lihat kategori ${slot.cat}`}
              className={`group absolute hidden md:flex w-[148px] lg:w-[178px] aspect-[0.76] flex-col overflow-hidden rounded-[22px] border border-black/[0.04] bg-white shadow-[0_14px_34px_rgba(15,12,8,0.11)] transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_42px_rgba(15,12,8,0.16)] ${slot.positionClass}`}
            >
              <span className="pointer-events-none relative z-10 w-full truncate px-2.5 pt-2.5 text-center text-[11px] font-medium tracking-wide text-neutral-500 lg:text-[12px]">
                {slot.cat}
              </span>

              <div className="relative flex-1 w-full overflow-hidden">
                <ProductVisual product={preview} className="p-3 lg:p-4" />
              </div>

              <span
                aria-hidden="true"
                className="absolute bottom-2.5 left-2.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-900 shadow-sm transition-colors group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}

        {/* CENTERPIECE LOCKUP + SEARCH PILL */}
        <div className="relative z-20 flex flex-col items-center px-3 text-center">
          {arabicTitle && (
            <div
              lang="ar"
              dir="rtl"
              className="select-none text-[68px] leading-[0.86] text-[#0a0a0a] sm:text-[96px] md:text-[130px] lg:text-[168px]"
              style={{
                fontFamily: '"Lalezar", var(--font-arabic)',
                textShadow: "4px 5px 0 rgba(212, 174, 88, 0.55)",
              }}
            >
              {arabicTitle}
            </div>
          )}

          <h1 className="mt-1.5 font-sans text-lg font-extrabold tracking-[0.14em] text-[#0a0a0a] uppercase sm:text-2xl md:text-3xl lg:text-[36px]">
            {shopName}
          </h1>

          <button
            type="button"
            onClick={onTriggerSearch}
            className="mt-3 inline-flex max-w-full items-center gap-2.5 rounded-full border-[1.5px] border-[#cfa546] bg-white/95 px-4 py-2 text-[11px] font-semibold tracking-wide text-neutral-800 shadow-[0_8px_22px_rgba(207,165,70,0.2)] backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#b38928] sm:mt-4 sm:gap-3 sm:px-6 sm:py-2.5 sm:text-sm"
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-neutral-500 sm:h-4 sm:w-4" />
            <span className="h-3.5 w-px bg-neutral-200 sm:h-4" aria-hidden="true" />
            <span className="truncate">
              {CATS.slice(0, 2).join(" · ")} · Parfum · {CATS[5]}
            </span>
          </button>
        </div>

        {/* MOBILE BOTTOM CLUSTER */}
        <div className="relative z-10 mt-3.5 flex w-full items-center justify-center gap-2.5 px-3 md:hidden">
          {MOBILE_BOTTOM_SLOTS.map((slot) => {
            const preview = getPreviewProduct(slot.cat);
            if (!preview) return null;
            return (
              <button
                key={slot.cat}
                type="button"
                onClick={() => onSelectCategory(slot.cat)}
                aria-label={`Lihat kategori ${slot.cat}`}
                className={`group relative flex w-[30%] max-w-[108px] aspect-[0.82] flex-col overflow-hidden rounded-[16px] border border-black/[0.05] bg-white shadow-[0_10px_24px_rgba(15,12,8,0.1)] transition-transform duration-200 active:scale-95 ${slot.tilt}`}
              >
                <span className="w-full truncate px-1.5 pt-1.5 text-center text-[9.5px] font-medium text-neutral-500">
                  {slot.cat}
                </span>
                <div className="relative flex-1 w-full overflow-hidden">
                  <ProductVisual product={preview} className="p-2" />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 left-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-xs"
                >
                  <Plus className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Warm Gold DM Admin Strip */}
      <div className="relative mt-4 overflow-hidden rounded-[14px] bg-gradient-to-r from-[#c49732] via-[#dab252] to-[#ecd082] px-5 py-4 text-[#0a0a0a] sm:px-8 sm:py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 h-52 w-52 rounded-full bg-white/25"
        />
        <div className="relative z-10 flex flex-col items-start justify-between gap-3.5 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <p className="text-base font-bold tracking-tight text-[#0a0a0a] sm:text-xl">
              {announcement || "Jika berminat membeli, silakan DM admin."}
            </p>
            {announcementSub && (
              <p className="mt-0.5 text-xs font-medium text-neutral-900/80 sm:text-sm">
                {announcementSub}
              </p>
            )}
          </div>

          {adminDm && (
            <a
              href={adminDm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] bg-[#0a0a0a] px-5 text-xs font-semibold tracking-wide text-[#f2d68d] transition-colors hover:bg-neutral-800 whitespace-nowrap"
            >
              <span>DM admin</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
