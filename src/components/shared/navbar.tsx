"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuItems = [
    { label: "Produk", href: "/#produk" },
    { label: "Jasa", href: "/#jasa" },
    {
      label: "Journey",
      href: "/#journey",
      subMenus: [
        { label: "Sumber Daya Gratis", href: "/#sumber-daya" },
        { label: "Blog", href: "/blog" },
        { label: "Buku", href: "/#buku" },
        { label: "Kampus Kangguru", href: "/#kampus" },
      ],
    },
    { label: "AI", href: "/#ai" },
    { label: "Lab", href: "/lab" },
    { label: "Freelance", href: "/#freelance" },
    { label: "Handbook", href: "/#handbook" },
    {
      label: "Belajar",
      href: "/#belajar",
      subMenus: [
        { label: "Product Management", href: "/#pm" },
        { label: "Bisnis Digital", href: "/#bisnis" },
        { label: "Vibe Coding", href: "/#vibe-coding" },
        { label: "Produktivitas & Content Creation", href: "/#produktivitas" },
      ],
    },
    { label: "Komunitas", href: "/#komunitas" },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-2 left-0 right-0 z-[90] transition-all duration-300 px-4 md:px-6 pointer-events-auto"
    >
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${scrolled || mobileOpen ? "bg-[#05050A]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" : "bg-transparent border border-transparent"}`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={closeMobile} className="relative flex items-center justify-center group">
              <Image
                src="/assets/logo%20AAPE.png"
                alt="AAPE Logo"
                width={220}
                height={66}
                priority
                className="h-14 sm:h-16 md:h-[72px] w-auto object-contain group-hover:scale-[1.03] transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigasi utama">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group px-1">
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold tracking-wide text-white/70 hover:text-white transition-all rounded-lg group-hover:bg-white/5"
                >
                  {item.label}
                  {item.subMenus && <ChevronDown className="w-3.5 h-3.5 text-brand-accent/70 group-hover:text-brand-accent transition-transform duration-300 group-hover:-rotate-180" />}
                </Link>

                {item.subMenus && (
                  <div className="absolute top-[120%] left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 w-64 z-50">
                    <div className="bg-[#05050A]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden group/menu">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-accent/20 blur-[40px] rounded-full pointer-events-none transition-opacity opacity-0 group-hover/menu:opacity-100" />

                      {item.subMenus.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="px-4 py-3 text-[13px] font-semibold text-white/70 hover:text-white rounded-xl transition-all relative group/sub overflow-hidden flex items-center"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 to-emerald-500/0 group-hover/sub:from-brand-accent/20 group-hover/sub:to-transparent rounded-xl transition-all duration-300" />
                          <span className="relative z-10 flex-1">{sub.label}</span>
                          <span className="relative z-10 text-brand-accent opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-300">
                            &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Tutup navigasi" : "Buka navigasi"}
              aria-expanded={mobileOpen}
              className="p-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Navigasi mobile"
            className="lg:hidden px-4 pb-5 border-t border-white/5"
          >
            <div className="pt-3 flex flex-col gap-1">
              {menuItems.map((item) => (
                <div key={item.label} className="rounded-xl overflow-hidden">
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.subMenus && <ChevronDown className="w-3.5 h-3.5 text-white/40" />}
                  </Link>
                  {item.subMenus && (
                    <div className="ml-4 pl-3 border-l border-white/10 mb-2 flex flex-col">
                      {item.subMenus.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={closeMobile}
                          className="px-3 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
