# 💰 Budget Buddy

**Budget Buddy** is a smart, voice-enabled, and AI-enhanced expense tracker that helps users monitor their daily spending, set monthly budgets, and gain insights into their financial habits — all in a clean, modern, and mobile-friendly interface.

---

## 🚀 Live Demo
https://budget-buddyxrime.netlify.app/

---

## 🧠 Features

- 🔐 **User Authentication** – Sign up and log in securely via Supabase
- 🧾 **Expense Logging** – Add amount, category, description, and date
- 🎙️ **Voice Input** – Log expenses using speech via Web Speech API
- 📊 **Analytics Dashboard** – Visual charts showing where your money goes
- 💡 **Monthly Budget Alerts** – Set spending limits and get alerts when you exceed them
- 🌗 **Dark Mode** – Toggle between light and dark themes
- 📁 **CSV Export** – Download your expenses as a `.csv` file

## 🛠 Tech Stack

| Frontend        | Backend         | Extras               |
|-----------------|-----------------|----------------------|
| React / Next.js | Supabase (Auth + Postgres) | TailwindCSS |
| Chart.js / Recharts | Supabase RLS Policies | Web Speech API | CSV Export | Dark Mode Toggle |

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/budget-buddy.git
cd budget-buddy

# Install dependencies
npm install

# Set up environment variables
touch .env.local
