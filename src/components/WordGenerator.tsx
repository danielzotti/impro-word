"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, RefreshCw, Sparkles, Timer } from "lucide-react";
import itWords from "../../data/it.json";
import enWords from "../../data/en.json";
import esWords from "../../data/es.json";
import Image from "next/image";

type Word = {
  word: string;
  category: string;
};

type Language = "it" | "en" | "es";
type Category = "noun" | "verb" | "adjective" | "any";

const CATEGORIES_OPTIONS = [
  { value: "any", labels: { it: "Tutte le categorie", en: "All Categories", es: "Todas las categorías" } },
  { value: "noun", labels: { it: "Sostantivi", en: "Nouns", es: "Sustantivos" } },
  { value: "verb", labels: { it: "Verbi", en: "Verbs", es: "Verbos" } },
  { value: "adjective", labels: { it: "Aggettivi", en: "Adjectives", es: "Adjetivos" } },
];

const CATEGORY_LABELS: Record<string, Record<Language, string>> = {
  noun: { it: "Sostantivi", en: "Nouns", es: "Sustantivos" },
  verb: { it: "Verbi", en: "Verbs", es: "Verbos" },
  adjective: { it: "Aggettivi", en: "Adjectives", es: "Adjetivos" },
  any: { it: "Tutte le categorie", en: "All Categories", es: "Todas las categorías" },
};

const TEXTS = {
  it: {
    title: "Parola Casuale",
    next: "Nuova Parola",
    category: "Categoria",
    any: "Qualsiasi",
  },
  en: {
    title: "Random Word",
    next: "Next Word",
    category: "Category",
    any: "Any",
  },
  es: {
    title: "Palabra Aleatoria",
    next: "Siguiente Palabra",
    category: "Categoría",
    any: "Cualquiera",
  },
};

const STORAGE_KEY = "impro-word-config";

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function WordGenerator() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Language>("it");
  const [category, setCategory] = useState<Category>("any");
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  let words;
  if (lang === "it") {
    words = itWords;
  } else if (lang === "en") {
    words = enWords;
  } else {
    words = esWords;
  }

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { lang: sLang, category: sCat } = JSON.parse(saved);
        if (sLang) setLang(sLang);
        if (sCat) {
          // Fallback for legacy keys or invalid values
          const validCategories: Category[] = ["noun", "verb", "adjective", "any"];
          setCategory(validCategories.includes(sCat) ? sCat : "any");
        }
      } catch (e) {
        console.error("Error loading config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, category }));
    }
  }, [lang, category, isLoaded]);

  // Timer logic
  useEffect(() => {
    if (!isLoaded || !currentWord) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoaded, currentWord]);

  const getRandomWord = useCallback(() => {
    let filtered = words as Word[];
    if (category !== "any") {
      filtered = filtered.filter((w) => w.category === category);
    }

    if (filtered.length === 0) return null;

    let next;
    do {
      next = filtered[Math.floor(Math.random() * filtered.length)];
    } while (filtered.length > 1 && next.word === currentWord?.word);

    return next;
  }, [words, category, currentWord]);

  const handleNext = useCallback(() => {
    const next = getRandomWord();
    setCurrentWord(next);
    setElapsedSeconds(0);
  }, [getRandomWord]);

  // Initial word
  useEffect(() => {
    if (isLoaded && !currentWord) {
      setCurrentWord(getRandomWord());
    }
  }, [isLoaded, currentWord, getRandomWord]);

  // Don't render until loaded to avoid hydration mismatch
  if (!isLoaded) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto p-6 space-y-8">
      {/* Decor */}
      <h1 className="flex gap-2 text-white/40 items-center">
        {/* Add icon */}
        <Image src="/icon.png" alt="Icon" width={28} height={28} />
        <span className="text-4xl font-light tracking-widest uppercase italic">Impro Word</span>
      </h1>

      {/* Header / Settings */}
      <div className="w-full flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full px-3">
          <Languages className="w-4 h-4 text-white/70" />
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value as Language);
            }}
            className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer p-1"
          >
            <option value="it" className="text-black">Italiano</option>
            <option value="en" className="text-black">English</option>
            <option value="es" className="text-black">Español</option>
          </select>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full px-3">
            <Sparkles className="w-4 h-4 text-white/70" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as Category);
              }}
              className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer p-1"
            >
              {CATEGORIES_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-black">
                  {opt.labels[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Word Card */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl rounded-full" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord?.word || "initial"}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full z-10"
          >
            <Card className="w-full h-full aspect-square flex flex-col items-center justify-center text-center bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl rounded-3xl overflow-hidden group">
              <CardContent className="py-12 px-1 flex flex-col items-center">
                <motion.span
                  className="text-white/50 text-sm font-medium uppercase tracking-[0.2em] mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentWord ? CATEGORY_LABELS[currentWord.category]?.[lang] || currentWord.category : ""}

                </motion.span>
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-md break-all mb-8">
                  {currentWord?.word}
                </h2>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full px-3 min-w-24 justify-between">
                  <Timer className="w-4 h-4 text-white/70" />
                  <span className="text-white text-lg font-medium text-center font-mono">{formatTime(elapsedSeconds)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleNext}
        size="lg"
        className="w-full py-8 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
        <span className="flex items-center gap-3 relative z-10">
          <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          {TEXTS[lang].next}
        </span>
      </Button>

    </div>
  );
}
