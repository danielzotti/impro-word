"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, RefreshCw, Sparkles } from "lucide-react";
import itWords from "../../data/it.json";
import enWords from "../../data/en.json";

type Word = {
  word: string;
  category: string;
};

type Language = "it" | "en";
type Category = "noun" | "verb" | "adjective" | "any";

const CATEGORIES_OPTIONS = [
  { value: "any", labels: { it: "Tutte le categorie", en: "All Categories" } },
  { value: "noun", labels: { it: "Sostantivi", en: "Nouns" } },
  { value: "verb", labels: { it: "Verbi", en: "Verbs" } },
  { value: "adjective", labels: { it: "Aggettivi", en: "Adjectives" } },
];

const CATEGORY_LABELS: Record<string, Record<Language, string>> = {
  noun: { it: "Sostantivi", en: "Nouns" },
  verb: { it: "Verbi", en: "Verbs" },
  adjective: { it: "Aggettivi", en: "Adjectives" },
  any: { it: "Tutte le categorie", en: "All Categories" },
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
};

const STORAGE_KEY = "impro-word-config";

export default function WordGenerator() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Language>("it");
  const [category, setCategory] = useState<Category>("any");
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  const words = lang === "it" ? itWords : enWords;

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

  const handleNext = () => {
    const next = getRandomWord();
    setCurrentWord(next);
  };

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
          </select>
        </div>

        <div className="flex-1">
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 text-white rounded-full">
              <SelectValue>
                {CATEGORIES_OPTIONS.find(opt => opt.value === category)?.labels[lang]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.labels[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <CardContent className="p-12 flex flex-col items-center">
                <motion.span
                  className="text-white/50 text-sm font-medium uppercase tracking-[0.2em] mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentWord ? CATEGORY_LABELS[currentWord.category]?.[lang] || currentWord.category : ""}

                </motion.span>
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-md">
                  {currentWord?.word}
                </h2>
                <div className="w-12 h-1 bg-white/30 rounded-full mt-8 group-hover:w-24 transition-all duration-500" />
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

      {/* Decor */}
      <div className="flex gap-2 text-white/40 items-center">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-light tracking-widest uppercase italic">Impro Word</span>
      </div>
    </div>
  );
}
