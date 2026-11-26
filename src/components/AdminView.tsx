import { useState, useEffect, type FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  Store,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  CATS,
  DEFAULT_NEXT_ID,
  dmUrl,
  LOGO,
  PASS,
  SEED,
  shrinkImage,
  type Product,
  type StoreState,
} from "../data/catalog";

interface AdminViewProps {
  store: StoreState;
  authed: boolean;
  onAuthChange: (authed: boolean) => void;
  onUpdateStore: (next: StoreState) => boolean;
  onExitAdmin: () => void;
}

type AdminTab = "catalog" | "profile";

export function AdminView({
  store,
  authed,
  onAuthChange,
  onUpdateStore,
  onExitAdmin,
}: AdminViewProps) {
  const [password, setPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("catalog");

  // Profile Draft State (for comfortable batch editing + live preview)
  const [profileDraft, setProfileDraft] = useState({
    shop: store.shop,
    tagline: store.tagline,
    arabicTitle: store.arabicTitle,
    dm: store.dm,
    ann: store.ann,
    annSub: store.annSub,
    footerNote: store.footerNote,
    logo: store.logo || LOGO,
  });

  // Password Change State
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; err?: boolean } | null>(
    null
  );

  // Add Product State
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<string>(CATS[0]);
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setProfileDraft({
      shop: store.shop,
      tagline: store.tagline,
      arabicTitle: store.arabicTitle,
      dm: store.dm,
      ann: store.ann,
      annSub: store.annSub,
      footerNote: store.footerNote,
      logo: store.logo || LOGO,
    });
  }, [store]);

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(null), 2800);
  };

  const activePassword = store.adminPass || PASS;

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === activePassword) {
      setAuthError("");
      setPassword("");
      onAuthChange(true);
    } else {
      setAuthError("Password salah. Coba lagi.");
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-white px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-[14px] border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <p className="text-[11px] font-medium tracking-[0.2em] text-neutral-500 uppercase">
            {store.shop}
          </p>
          <h1
            className="mt-1 text-3xl font-semibold text-neutral-950"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Admin Panel
          </h1>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <input
                type={showLoginPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password admin"
                aria-label="Password admin"
                autoComplete="current-password"
                autoFocus
                className="h-11 w-full rounded-[10px] border border-neutral-300 bg-white pr-11 pl-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowLoginPass((v) => !v)}
                aria-label={showLoginPass ? "Sembunyikan password" : "Lihat password"}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-800"
              >
                {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {authError && (
              <p role="alert" className="text-xs font-medium text-[#c82323]">
                {authError}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="submit"
              className="h-11 w-full rounded-[10px] bg-[#0a0a0a] text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="h-10 w-full rounded-[10px] border border-neutral-200 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-900"
            >
              Kembali ke Katalog
            </button>
          </div>
        </form>
      </div>
    );
  }

  const commitStore = (next: StoreState): boolean => {
    const ok = onUpdateStore(next);
    if (!ok) {
      showNotice("Penyimpanan browser penuh. Hapus beberapa foto produk.");
    }
    return ok;
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const ok = commitStore({
      ...store,
      shop: profileDraft.shop.trim() || "Jastip.Mekkah",
      tagline: profileDraft.tagline.trim(),
      arabicTitle: profileDraft.arabicTitle.trim(),
      dm: profileDraft.dm.trim(),
      ann: profileDraft.ann.trim(),
      annSub: profileDraft.annSub.trim(),
      footerNote: profileDraft.footerNote.trim(),
      logo: profileDraft.logo || LOGO,
    });
    if (ok) showNotice("Profil toko berhasil disimpan.");
  };

  const handleUploadLogo = async (file: File) => {
    try {
      const dataUrl = await shrinkImage(file);
      setProfileDraft((d) => ({ ...d, logo: dataUrl }));
      commitStore({ ...store, logo: dataUrl });
      showNotice("Logo toko diperbarui.");
    } catch {
      showNotice("Gagal memproses logo.");
    }
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) {
      setPassMessage({ text: "Password baru tidak boleh kosong.", err: true });
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassMessage({ text: "Konfirmasi password tidak cocok.", err: true });
      return;
    }
    const ok = commitStore({ ...store, adminPass: newPass });
    if (ok) {
      setNewPass("");
      setConfirmNewPass("");
      setPassMessage({ text: "Password admin berhasil diperbarui." });
      window.setTimeout(() => setPassMessage(null), 3000);
    }
  };

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    const price = Number(newPrice);
    if (!name || !price) return;

    const nextItem: Product = {
      id: store.nextId,
      cat: newCat,
      name,
      price,
      old: null,
      stock: newStock === "" ? null : Number(newStock),
      tag: "",
      isNew: true,
      img: "",
    };

    commitStore({
      ...store,
      items: [...store.items, nextItem],
      nextId: store.nextId + 1,
    });
    setNewName("");
    setNewPrice("");
    setNewStock("");
    showNotice(`"${name}" ditambahkan.`);
  };

  const updateProductField = <K extends keyof Product>(
    id: number,
    field: K,
    value: Product[K]
  ) => {
    commitStore({
      ...store,
      items: store.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleUploadImage = async (id: number, file: File) => {
    try {
      const dataUrl = await shrinkImage(file);
      updateProductField(id, "img", dataUrl);
      showNotice("Foto produk diperbarui.");
    } catch {
      showNotice("Gagal memproses gambar.");
    }
  };

  const handleDeleteProduct = (id: number) => {
    commitStore({
      ...store,
      items: store.items.filter((item) => item.id !== id),
    });
    setConfirmDeleteId(null);
    showNotice("Produk dihapus.");
  };

  const handleResetSeed = () => {
    commitStore({
      ...store,
      items: SEED.map((item) => ({ ...item })),
      nextId: DEFAULT_NEXT_ID,
    });
    setConfirmReset(false);
    showNotice("Semua produk dikembalikan ke data awal.");
  };

  const previewDmUrl = dmUrl(profileDraft.dm);

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Top Bar */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={store.logo || LOGO}
              alt={store.shop}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border border-[#d6a736] object-cover"
            />
            <div>
              <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
                {store.shop}
              </p>
              <h1 className="text-lg font-semibold text-neutral-950 sm:text-xl">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-neutral-300 bg-white px-3.5 text-xs font-medium text-neutral-800 hover:border-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Lihat Katalog</span>
            </button>
            <button
              type="button"
              onClick={() => onAuthChange(false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-neutral-900 px-3.5 text-xs font-medium text-white hover:bg-neutral-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto flex max-w-5xl gap-1 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "catalog"
                ? "border-neutral-950 text-neutral-950"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Katalog Produk</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "profile"
                ? "border-neutral-950 text-neutral-950"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Edit Profil Toko</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 pt-6 sm:px-6">
        {notice && (
          <div className="flex items-center gap-2 rounded-[10px] bg-neutral-900 px-4 py-3 text-xs font-medium text-white shadow-sm">
            <Check className="h-4 w-4 text-[#d6a736]" />
            <span>{notice}</span>
          </div>
        )}

        {activeTab === "profile" ? (
          <div className="space-y-6">
            {/* Live Store Header & Banner Preview */}
            <section className="overflow-hidden rounded-[12px] border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-3 text-xs font-semibold text-neutral-500">
                Pratinjau Langsung Header & Banner
              </div>
              <div className="bg-[#050505] px-5 py-4 text-white">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={profileDraft.logo || LOGO}
                    alt="Preview logo"
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-full border-[1.5px] border-[#d6a736] object-cover"
                  />
                  <div className="flex flex-col leading-none">
                    <span
                      className="text-2xl font-extrabold italic text-[#d6a736]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {profileDraft.shop || "Jastip.Mekkah"}
                    </span>
                    {profileDraft.tagline && (
                      <span className="mt-0.5 text-[10px] tracking-[0.24em] text-[#c99e3a] lowercase">
                        {profileDraft.tagline}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#c49732] via-[#dab252] to-[#ecd082] px-5 py-3.5 text-[#0a0a0a]">
                <p className="text-sm font-bold">
                  {profileDraft.ann || "Jika berminat membeli, silakan DM admin."}
                </p>
                {profileDraft.annSub && (
                  <p className="mt-0.5 text-xs text-neutral-900/80">{profileDraft.annSub}</p>
                )}
              </div>
            </section>

            {/* Profile Form */}
            <form
              onSubmit={handleSaveProfile}
              className="space-y-6 rounded-[12px] border border-neutral-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={profileDraft.logo || LOGO}
                    alt="Logo toko"
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-full border-2 border-[#d6a736] bg-black object-cover"
                  />
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-950">Logo Toko</h2>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Ditampilkan pada header dan ikon admin.
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:border-neutral-900">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Ganti Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadLogo(file);
                          }}
                        />
                      </label>
                      {profileDraft.logo !== LOGO && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDraft((d) => ({ ...d, logo: LOGO }));
                            commitStore({ ...store, logo: LOGO });
                            showNotice("Logo dikembalikan ke default.");
                          }}
                          className="rounded-[8px] border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:border-neutral-900"
                        >
                          Reset Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-medium text-neutral-700">
                  Nama Toko
                  <input
                    type="text"
                    value={profileDraft.shop}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, shop: e.target.value }))
                    }
                    placeholder="Jastip.Mekkah"
                    className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm text-neutral-950"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-neutral-700">
                  Subjudul / Tagline Header
                  <input
                    type="text"
                    value={profileDraft.tagline}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, tagline: e.target.value }))
                    }
                    placeholder="katalog jastip"
                    className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm text-neutral-950"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-neutral-700">
                  Tulisan Arab di Banner Showcase
                  <input
                    type="text"
                    dir="rtl"
                    value={profileDraft.arabicTitle}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, arabicTitle: e.target.value }))
                    }
                    placeholder="مكة"
                    className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm text-neutral-950"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-neutral-700">
                  Keterangan Footer
                  <input
                    type="text"
                    value={profileDraft.footerNote}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, footerNote: e.target.value }))
                    }
                    placeholder="Katalog Jastip Makkah"
                    className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm text-neutral-950"
                  />
                </label>

                <div className="grid gap-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-neutral-700">
                    Kontak DM Admin (username Instagram tanpa @, atau link https://wa.me/...)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={profileDraft.dm}
                      onChange={(e) =>
                        setProfileDraft((d) => ({ ...d, dm: e.target.value }))
                      }
                      placeholder="has.a.null atau https://wa.me/628..."
                      className="h-10 flex-1 min-w-[220px] rounded-[8px] border border-neutral-300 px-3 text-sm text-neutral-950"
                    />
                    {previewDmUrl && (
                      <a
                        href={previewDmUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-1.5 rounded-[8px] border border-neutral-300 px-3.5 text-xs font-medium text-neutral-800 hover:border-neutral-900"
                      >
                        <span>Tes Link DM</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {previewDmUrl && (
                    <span className="text-[11px] text-neutral-500">
                      Link aktif: {previewDmUrl}
                    </span>
                  )}
                </div>

                <label className="grid gap-1.5 text-xs font-medium text-neutral-700 sm:col-span-2">
                  Judul Banner DM Admin
                  <input
                    type="text"
                    value={profileDraft.ann}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, ann: e.target.value }))
                    }
                    placeholder="Jika berminat membeli, silakan DM admin."
                    className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm text-neutral-950"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-neutral-700 sm:col-span-2">
                  Subteks Banner DM Admin
                  <input
                    type="text"
                    value={profileDraft.annSub}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, annSub: e.target.value }))
                    }
                    placeholder="Sebutkan nama produk yang kamu mau..."
                    className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm text-neutral-950"
                  />
                </label>
              </div>

              <div className="flex justify-end border-t border-neutral-100 pt-4">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#0a0a0a] px-6 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Simpan Profil Toko</span>
                </button>
              </div>
            </form>

            {/* Password Management */}
            <form
              onSubmit={handleChangePassword}
              className="rounded-[12px] border border-neutral-200 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-950">
                  Ganti Password Admin
                </h2>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Password saat ini aktif digunakan untuk login ke halaman admin.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Password baru"
                    aria-label="Password baru"
                    className="h-10 w-full rounded-[8px] border border-neutral-300 pr-10 pl-3 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass((v) => !v)}
                    aria-label={showNewPass ? "Sembunyikan password" : "Lihat password"}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-800"
                  >
                    {showNewPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <input
                  type={showNewPass ? "text" : "password"}
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  placeholder="Ulangi password baru"
                  aria-label="Ulangi password baru"
                  className="h-10 w-full rounded-[8px] border border-neutral-300 px-3 text-sm"
                />
              </div>

              {passMessage && (
                <p
                  className={`mt-2.5 text-xs font-medium ${
                    passMessage.err ? "text-[#c82323]" : "text-emerald-700"
                  }`}
                >
                  {passMessage.text}
                </p>
              )}

              <div className="mt-4">
                <button
                  type="submit"
                  className="h-9 rounded-[8px] border border-neutral-900 bg-white px-4 text-xs font-semibold text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
                >
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Product */}
            <section className="rounded-[12px] border border-neutral-200 bg-white p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-neutral-950">
                Tambah Produk Baru
              </h2>
              <form onSubmit={handleAddProduct} className="mt-4 grid gap-3 sm:grid-cols-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama produk"
                  aria-label="Nama produk"
                  className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm sm:col-span-2"
                />
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  aria-label="Kategori"
                  className="h-10 rounded-[8px] border border-neutral-300 bg-white px-3 text-sm"
                >
                  {CATS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Harga (Rp)"
                  inputMode="numeric"
                  aria-label="Harga"
                  className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm tabular-nums"
                />
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="Stok (kosong = ada)"
                  inputMode="numeric"
                  aria-label="Stok"
                  className="h-10 rounded-[8px] border border-neutral-300 px-3 text-sm tabular-nums"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[8px] bg-[#0a0a0a] px-4 text-xs font-medium text-white hover:bg-neutral-800 sm:col-span-3 sm:w-fit"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Produk</span>
                </button>
              </form>
            </section>

            {/* Product List by Category */}
            {CATS.map((cat) => {
              const list = store.items.filter((p) => p.cat === cat);
              if (!list.length) return null;

              return (
                <section
                  key={cat}
                  className="rounded-[12px] border border-neutral-200 bg-white p-5 sm:p-6"
                >
                  <h3 className="border-b border-neutral-100 pb-3 text-sm font-semibold tracking-wide text-neutral-950 uppercase">
                    {cat}
                  </h3>

                  <div className="divide-y divide-neutral-100">
                    {list.map((p) => (
                      <div key={p.id} className="space-y-3 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-neutral-900">
                            {p.name}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-neutral-600">
                              <input
                                type="checkbox"
                                checked={p.isNew}
                                onChange={(e) =>
                                  updateProductField(p.id, "isNew", e.target.checked)
                                }
                                className="accent-neutral-900"
                              />
                              <span>Baru</span>
                            </label>

                            <label className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-neutral-900">
                              <Upload className="h-3 w-3" />
                              <span>Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadImage(p.id, file);
                                }}
                              />
                            </label>

                            {p.img && (
                              <button
                                type="button"
                                onClick={() => updateProductField(p.id, "img", "")}
                                className="inline-flex items-center gap-1 rounded-[7px] border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 hover:border-neutral-900"
                              >
                                <X className="h-3 w-3" />
                                <span>Hapus foto</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => updateProductField(p.id, "stock", 0)}
                              className="rounded-[7px] border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700 hover:border-neutral-900"
                            >
                              Habis
                            </button>

                            {confirmDeleteId === p.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="rounded-[7px] bg-[#c82323] px-2.5 py-1 text-xs font-medium text-white"
                                >
                                  Ya, hapus
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="rounded-[7px] border border-neutral-200 px-2 py-1 text-xs text-neutral-600"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(p.id)}
                                aria-label={`Hapus ${p.name}`}
                                className="inline-flex items-center gap-1 rounded-[7px] border border-neutral-200 px-2.5 py-1 text-xs text-[#c82323] hover:border-[#c82323]"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Hapus</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <label className="grid gap-1 text-[11px] font-medium text-neutral-500">
                            Harga
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) =>
                                updateProductField(
                                  p.id,
                                  "price",
                                  Number(e.target.value || 0)
                                )
                              }
                              className="h-9 rounded-[8px] border border-neutral-300 px-2.5 text-sm text-neutral-950 tabular-nums"
                            />
                          </label>
                          <label className="grid gap-1 text-[11px] font-medium text-neutral-500">
                            Harga coret
                            <input
                              type="number"
                              value={p.old ?? ""}
                              placeholder="kosong"
                              onChange={(e) =>
                                updateProductField(
                                  p.id,
                                  "old",
                                  e.target.value === "" ? null : Number(e.target.value)
                                )
                              }
                              className="h-9 rounded-[8px] border border-neutral-300 px-2.5 text-sm text-neutral-950 tabular-nums"
                            />
                          </label>
                          <label className="grid gap-1 text-[11px] font-medium text-neutral-500">
                            Stok
                            <input
                              type="number"
                              value={p.stock ?? ""}
                              placeholder="ada"
                              onChange={(e) =>
                                updateProductField(
                                  p.id,
                                  "stock",
                                  e.target.value === "" ? null : Number(e.target.value)
                                )
                              }
                              className="h-9 rounded-[8px] border border-neutral-300 px-2.5 text-sm text-neutral-950 tabular-nums"
                            />
                          </label>
                          <label className="grid gap-1 text-[11px] font-medium text-neutral-500">
                            Info / Catatan
                            <input
                              type="text"
                              value={p.tag}
                              onChange={(e) =>
                                updateProductField(p.id, "tag", e.target.value)
                              }
                              className="h-9 rounded-[8px] border border-neutral-300 px-2.5 text-sm text-neutral-950"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Reset Data */}
            <section className="rounded-[12px] border border-neutral-200 bg-white p-5">
              {confirmReset ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium text-neutral-800">
                    Kembalikan semua produk ke data awal? Perubahan manual akan hilang.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetSeed}
                      className="rounded-[8px] bg-[#c82323] px-3.5 py-2 text-xs font-medium text-white"
                    >
                      Ya, Kembalikan
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="rounded-[8px] border border-neutral-300 px-3.5 py-2 text-xs font-medium text-neutral-700"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Kembalikan data awal</span>
                </button>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
