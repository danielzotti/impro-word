# Impro Word

**Impro Word** is a minimalist, elegant web application designed for improvisers, writers, and creative thinkers. Handy tool to generate random words for your improv sessions.  
It is a **Progressive Web App (PWA)**, meaning you can install it on your device and use it **offline**.
It generates random words in Italian and English, categorized by parts of speech, to spark inspiration and creative exercises.

## ✨ Features

- **Bilingual Support**: Toggle between Italian and English word databases.
- **Category Filtering**: Filter words by **Nouns**, **Verbs**, or **Adjectives**, or explore the **Any** category for random surprises.
- **Glassmorphism Design**: A premium, modern UI with smooth transitions, gradients, and a sleek dark theme.
- **Responsive & Interactive**: Fully optimized for mobile and desktop with interactive hover effects and animations using Framer Motion.
- **Local Persistence**: Remembers your preferred language and category settings across sessions.

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/danielzotti/impro-word.git
   cd impro-word
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Access the app:**
   Open [http://localhost:3023](http://localhost:3023) in your browser.

## 🛠 Tech Stack

The project is built with modern, high-performance technologies:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **UI Components**: [Base UI](https://base-ui.com/), [Lucide React](https://lucide.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **Linter/Formatter**: [Biome](https://biomejs.dev/)
- **Natural Language**: [Compromise](https://github.com/spencermountain/compromise) (for word processing)

---

Developed with ❤️ for the improv and creative community.

## TODO

- [ ] Fix min height (dvh?)
- [ ] Add screenshots to README
- [ ] Add timer that resets on each word change
- [ ] Add more words / languages
