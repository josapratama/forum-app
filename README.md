# Forum App

Aplikasi forum diskusi berbasis React yang dibangun dengan Redux Toolkit, dilengkapi dengan Automation Testing dan CI/CD.

## 🚀 Demo

**Live URL:** https://forum-app-woad-two.vercel.app/

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Redux Toolkit** — state management
- **React Router DOM** — routing
- **Storybook** — component documentation (React Ecosystem)
- **Vitest** + **React Testing Library** — unit & integration testing
- **Cypress** — E2E testing
- **GitHub Actions** — CI/CD

## 📦 Instalasi

```bash
npm install
```

## 🧪 Menjalankan Test

### Unit & Integration Test

```bash
npm test
```

### E2E Test

E2E test membutuhkan server yang berjalan. Ada dua cara:

**Cara 1 — Otomatis (dev server + cypress sekaligus):**

```bash
npm run e2e:dev
```

Perintah ini akan menjalankan dev server di port 5173, menunggu hingga siap, lalu menjalankan Cypress secara otomatis.

**Cara 2 — Manual (jika sudah ada server berjalan di port 4173):**

```bash
npm run build
npm run preview  # jalankan di terminal terpisah
npm run e2e      # jalankan di terminal lain
```

**Cara 3 — Buka Cypress UI:**

```bash
npm run e2e:open
```

## 🖥️ Menjalankan Aplikasi

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## 📖 Storybook

```bash
npm run storybook
```

## 🔧 Scripts

| Script              | Deskripsi                                      |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Jalankan dev server                            |
| `npm run build`     | Build untuk production                         |
| `npm run preview`   | Preview hasil build di port 4173               |
| `npm test`          | Jalankan unit & integration tests              |
| `npm run e2e`       | Jalankan E2E tests (perlu server di port 4173) |
| `npm run e2e:dev`   | Jalankan E2E tests dengan dev server otomatis  |
| `npm run e2e:open`  | Buka Cypress UI                                |
| `npm run storybook` | Jalankan Storybook di port 6006                |

## 📁 Struktur Project

```
src/
├── api/          # API layer
├── components/   # Reusable components
├── hooks/        # Custom hooks
├── pages/        # Page components
├── store/        # Redux store & slices
│   └── slices/   # Auth, Threads, ThreadDetail, Leaderboard, Loading
├── stories/      # Storybook stories
├── styles/       # Global styles
├── tests/        # Unit & component tests
│   ├── components/
│   └── store/
└── utils/        # Utility functions

cypress/
└── e2e/          # End-to-End tests
```
