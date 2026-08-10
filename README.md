# 🧠 CodeCanvas AI — AI-Powered Code Review and Optimization

> Analyze, refactor, and export code review guidance with a responsive developer workspace.

---

## 📌 Overview

CodeCanvas AI provides an interactive code review experience for developers. Paste source code into the editor, run AI-powered analysis, and receive structured feedback plus optimized refactoring suggestions. The app also supports PDF export for sharing results.

---

## ✨ Features

- 🔍 AI-driven code review and quality analysis
- ⚡ Optimization recommendations for performance and readability
- 📄 Downloadable PDF reports of analysis and refactor suggestions
- 🧩 Multi-language support through plain text input
- 🎛️ Clean, responsive UI built with Radix and Tailwind
- 🧠 GenKit AI flows for code review and optimization

---

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, Radix UI |
| **AI** | GenKit, Google Gemini via @genkit-ai/google-genai |
| **Forms / UI** | React Hook Form, Lucide React |
| **Export** | jsPDF, html2canvas |
| **Utilities** | clsx, class-variance-authority, date-fns |

---

## ⚙️ Installation

```bash
# Clone repository
git clone <repo-url>
cd CodeCanvas-AI-main

# Install dependencies
npm install
```

### Requirements

- Node.js 20+
- npm

---

## 🚀 Development

```bash
npm run dev
```

The app runs by default on port `9002`.

### Useful scripts

- `npm run dev` — Start the dev server with Turbopack
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Run Next.js linting
- `npm run typecheck` — Run TypeScript checks
- `npm run genkit:dev` — Start GenKit AI flows in dev mode
- `npm run genkit:watch` — Start GenKit AI flows in watch mode

---

## 🔐 Environment Configuration

Create a `.env` file at the project root for any API keys or environment values required by your AI provider. Example:

```env
GENKIT_API_KEY=your_genkit_api_key
GOOGLE_API_KEY=your_google_api_key
```

> Update the variables to match your preferred AI provider and local configuration.

---
## 🧭 Usage

1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Paste or type code into the editor
4. Click `Analyse Code` to generate a review
5. Use `Optimize` to create improved code suggestions
6. Download the report as PDF if needed

---

## � Future Improvements

- Add support for more programming languages with syntax-aware parsing
- Improve AI flow prompts for deeper security and architecture recommendations
- Add theme switching and customizable UI preferences
- Persist analysis history and allow comparison between multiple reports
- Add collaboration features such as sharing review sessions or comments

---

## 🙏 Acknowledgements

- Built with Next.js, Tailwind CSS, and Radix UI
- AI orchestration powered by GenKit and Google Gemini
- UI components inspired by modern developer tooling patterns

---
