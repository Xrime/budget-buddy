Budget Buddy

Live App: budget-buddyxrime.netlify.app

Overview

Budget Buddy is a sleek, intuitive expense-tracker web app built with React, Tailwind CSS, and Vite. It enables users to add, view, and manage expenses easily across features like:

Dashboard View with real-time stats and summaries

Add Expense form for logging new spending

Analytics with charts to visualize spending trends

Settings panel for personalization

Features

Simple, responsive UI for effortless expense tracking

Seamless navigation between dashboard, add expense form, analytics, and settings

Instant UI updates when adding or deleting expenses

Exports expenses as CSV for easy record-keeping

Dark/light theming (if using ThemeContext)

Tech Stack

UI: React + Tailwind CSS

Build Tool: Vite (for fast development and optimized production)

State: Local component state (via hooks like useState)

Data & Persistence: (If applicable—e.g., local storage or Supabase, adjust accordingly)

Hosting: Netlify (continuous deploy from GitHub)

Screenshots / Demo

(Optional: Insert screenshots or embed GIFs of key views—Dashboard, Add Expense, Charts)

Getting Started (Local Setup)

Clone the repository:

git clone <your-repo-url>
cd <repo-directory>


Install dependencies:

npm install


Start development server:

npm run dev


Navigate to http://localhost:5173 (or the port shown) to preview locally.

Build for production:

npm run build


Outputs to dist/, ready to deploy.

Deployment

The app is already deployed on Netlify. To redeploy after local changes:

Push your latest changes to GitHub.

Netlify will auto-trigger a new build and deploy.

Alternatively, use the Netlify CLI:

npm install -g netlify-cli
netlify deploy --build --prod

Folder Structure
src/
├── components/
│   ├── Layout/Sidebar.tsx
│   ├── Layout/Header.tsx
│   ├── Dashboard/StatsCards.tsx
│   ├── Dashboard/BudgetOverview.tsx
│   ├── Dashboard/RecentExpenses.tsx
│   ├── AddExpense/ExpenseForm.tsx
│   ├── Analytics/ExpenseCharts.tsx
│   └── Settings/SettingsPanel.tsx
├── contexts/
│   └── ThemeContext.tsx
├── hooks/
│   └── useExpenses.ts
├── utils/
│   └── csvExport.ts
└── App.tsx

Usage

Dashboard: Offers summary cards and recent expense breakdowns.

Add Expense: Input expenses with details like amount, date, category, and notes.

Analytics: View charts showing patterns like daily or category-wise spending.

Settings: Adjust preferences (theme, and future enhancements).

Contributing

Contributions are welcome! If you'd like to add features (e.g., categories, budgets) or improve the app's styling or structure:

Fork the repository

Create a feature branch (git checkout -b feature-name)

Make changes and test locally

Submit a pull request, detailing what you’ve improved
