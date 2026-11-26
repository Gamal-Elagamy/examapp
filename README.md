# 🎓 Elevate Exam App

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://examapp-sigma.vercel.app/)

> **Elevate Exam App** is an enterprise-grade, full-stack Online Examination and Assessment Platform. Built with the latest **Next.js 16 (App Router)** and **React 19**, it delivers a dual-role experience: an interactive, frictionless assessment portal for students, paired with a robust administrative dashboard for managing diplomas, exams, question banks, and audit logging.

---

## 🌐 Live Demo

🔗 **Production URL:** [https://examapp-sigma.vercel.app/](https://examapp-sigma.vercel.app/)

---

## ✨ Key Highlights

- **⚡ Blazing Fast Architecture:** Built with Next.js 16 App Router using Server Components by default, pushing client components strictly to interactive leaves for minimal bundle size and lightning-fast LCP/FCP.
- **🛡️ Role-Based Access Control (RBAC):** Parallel route interception (`@student` and `@admin` slots) with token-backed edge proxy middleware protecting privileged routes for Students, Admins, and Super Admins.
- **📊 Real-time Assessment Engine:** Timed examinations, multi-choice question navigation, radio selections, auto-submission on expiration, and instant performance analytics.
- **🛠️ Comprehensive Admin Dashboard:** Full CRUD management for Diplomas, Exams, and Question Banks with immutability locks and image uploads.
- **📜 Enterprise Audit Logging System:** Deep forensic event inspection (`/admin/audit-log/[id]`), structured JSON metadata view, granular filtering (by Category, Action, User), and Super Admin deletion governance.
- **♿ 100/100 Lighthouse Standards:** High-contrast WCAG AA accessibility, zero `any` strict TypeScript typing, canonical Tailwind v4 tokens, and modern AVIF/WebP image optimization.

---

## 🚀 System Architecture & Portals

```
                       ┌───────────────────────────────┐
                       │   Authentication & RBAC Proxy │
                       │    (NextAuth.js v4 + JWT)     │
                       └───────────────┬───────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
  ┌───────────────────────────┐                 ┌───────────────────────────┐
  │      Student Portal       │                 │      Admin Dashboard      │
  │       (@user slot)        │                 │       (@admin slot)       │
  ├───────────────────────────┤                 ├───────────────────────────┤
  │ • Diplomas Catalog        │                 │ • Diplomas Management     │
  │ • Infinite Scroll Browse  │                 │ • Exams Builder & Rules   │
  │ • Exam Taking Interface   │                 │ • Question Bank Editor    │
  │ • Live Countdown Timer    │                 │ • Immutability Control    │
  │ • Submission Analytics    │                 │ • Audit Logs & History    │
  │ • Profile & OTP Security  │                 │ • User & Role Management  │
  └───────────────────────────┘                 └───────────────────────────┘
```

### 👨‍🎓 1. Student Portal

- **Diploma Discovery:** Dynamic grid browsing with responsive aspect ratio cards, smooth hover expansions, and infinite scroll pagination powered by TanStack Query.
- **Examination Session:** Distraction-free exam taking environment with synchronized timers, state persistence, question jumper, and instant score computation with breakdown charts.
- **Student Profile & Settings:** Profile updates, avatar selection, password change, and email change verification via email OTP flow.

### 🛡️ 2. Comprehensive Admin Dashboard

- **Diplomas Management:** Create, view, edit, and delete diplomas with custom image uploads, title search, immutability filtering, and multi-criteria sorting.
- **Exams Management:** Set duration, question limits, passing scores, and manage questions directly from the exam workspace.
- **Question Bank & Editor:** Interactive question editor with multi-choice options, correct answer selection, and bulk question upload capabilities.
- **Security & Immutability:** Exams and diplomas can be marked as `immutable` to lock modifications, with special override capabilities reserved strictly for Super Admins.
- **Enterprise Audit Logs:** Complete traceability of every administrative action (CREATE, UPDATE, DELETE). Detailed inspection page displaying actor IP address, HTTP method, user agent, updated fields, and raw payload metadata.
- **Unified Confirmation Modals:** Reusable design system modal (`ConfirmDeleteDialog`) across all critical destructive operations with double-confirmation protection.

---

## 🛠️ Tech Stack & Libraries

| Category           | Technologies                    | Description                                                                    |
| :----------------- | :------------------------------ | :----------------------------------------------------------------------------- |
| **Framework**      | **Next.js 16.4.6** (App Router) | React Server Components, Parallel Routes, Server Actions & Route Handlers      |
| **Core**           | **React 19.3.0**                | Modern concurrent features, `use()` hook, and Suspense boundaries              |
| **Language**       | **TypeScript 5 (Strict)**       | Zero `any`, strict type checking, end-to-end typed API contracts               |
| **Styling**        | **Tailwind CSS v4**             | Canonical modern utilities (`bg-linear-to-*`, `inset-s-*`), CSS variables      |
| **UI Components**  | **shadcn/ui & Radix UI**        | Accessible headless primitives (Dialog, Select, Checkbox, Slot)                |
| **Icons & Media**  | **Lucide React**                | Featherweight tree-shaken SVG icon system                                      |
| **Data Fetching**  | **TanStack Query v5**           | Server-state management, cache invalidation, key factories, optimistic updates |
| **Form Handling**  | **React Hook Form**             | High-performance uncontrolled form state management                            |
| **Validation**     | **Zod v4**                      | Schema validation for forms, environment variables, and backend payloads       |
| **Authentication** | **NextAuth.js v4**              | Secure JWT-based session management with role-based edge proxy guards          |
| **Notifications**  | **Sonner**                      | Clean, accessible toast notifications                                          |

---

## 📁 Clean Feature-Based Architecture

The codebase follows a strictly modular **Feature-Based Architecture**:

```
src/
├── app/                              # Next.js App Router (Routing & Layouts only)
│   ├── (dashboard)/                  # Parallel Route Slots (@user, @admin)
│   │   ├── @admin/admin/             # Admin Dashboard Routes
│   │   │   ├── audit-log/            # Audit Log List & Details [id]
│   │   │   ├── diplomas/             # Diplomas Management (CRUD)
│   │   │   ├── exams/                # Exams & Question Bank
│   │   │   └── profile/              # Admin Profile & Security
│   │   └── @user/                    # Student Examination Portal
│   ├── api/                          # Next.js Route Handlers (Upload, Auth Proxy)
│   └── (auth)/                       # Authentication Pages (Login, Register, OTP)
├── features/                         # Modular business domains
│   ├── account/                      # Profile, password change, email verification
│   ├── admin/                        # Dashboard components, tables, filters, forms
│   ├── audit-logs/                   # Audit log list, details route, log filters
│   ├── auth/                         # Login, signup, password recovery schemas & APIs
│   ├── diplomas/                     # Diploma cards, infinite query, CRUD hooks
│   ├── exams/                        # Exam runner, timer, submission logic
│   ├── questions/                    # Question bank forms, validation schemas
│   └── submissions/                  # Exam grading & submission analytics
├── shared/                           # Reusable enterprise primitives
│   ├── components/                   # Unified dialogs (ConfirmDeleteDialog), providers
│   ├── layout/                       # Shared navigation, headers, and sidebars
│   ├── lib/
│   │   ├── apis/                     # Centralized API fetchers
│   │   ├── constants/                # App constants, routes, API endpoints
│   │   ├── types/                    # Domain TypeScript declarations (.d.ts)
│   │   └── utils/                    # Error extraction, formatting, class merging
│   └── ui/                           # Primitive shadcn/ui components
├── auth.ts                           # NextAuth configuration
├── proxy.ts                          # Edge request proxy & RBAC guards
└── routes.ts                         # Strongly-typed centralized application routes
```

---

## ⚡ Lighthouse & Quality Metrics

Tested on live production deployment ([examapp-sigma.vercel.app](https://examapp-sigma.vercel.app/)):

| Metric                   |     Score     |            Status            |
| :----------------------- | :-----------: | :--------------------------: |
| **Best Practices**       | **100 / 100** |        🟢 Exceptional        |
| **SEO**                  | **100 / 100** | 🟢 Optimal Search Visibility |
| **Accessibility (a11y)** | **98 - 100**  |     🟢 WCAG AA Compliant     |
| **Performance**          | **85 - 95+**  | 🟢 Fast FCP & Optimized LCP  |

---

## 🏁 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/examapp.git
cd examapp

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, and NEXTAUTH_URL

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ using <b>Next.js 16</b>, <b>React 19</b>, and <b>Tailwind CSS v4</b>.
</p>
