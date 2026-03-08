# AI Prompt Combat 2.0

**Live website:** [https://www.aipromptcombat.in/](https://www.aipromptcombat.in/)

A competition web portal for **AI Prompt Combat 2.0** — an event that tests and enhances students' skills in **Generative AI** and **Prompt Engineering**. The platform showcases the event, handles registration, and provides the competition interface for AI image and video generation rounds.

---

## Credits

| Role | Name |
|------|------|
| **Technical Lead** | Rounak Jain |
| **President & Developer** | Vipin Tomar |

The site was developed under the **Kaggle Koders** and **Kalasarthi** clubs in the CSE–AIDS department at SISTec.

---

## Overview

AI Prompt Combat 2.0 is an **individual participation** event structured in two phases:

- **Phase 1 — AI Image Generation:** Participants create images from complex visual prompts; submissions are scored and reflected on a live leaderboard.
- **Phase 2 — AI Video Generation:** Top performers from Phase 1 advance to a video synthesis round, submitting generated videos and the prompts used.

The web portal provides:

- Event information, schedule, prizes, and rules  
- Registration and login (frontend; backend can be connected)  
- Countdown to event start  
- Tutorial video section  
- Lobby/dashboard for participants  
- Round 1 (image) and Round 2 (video) interfaces  
- Live leaderboard  
- Faculty and student coordinator details  

---

## Tech Stack

| Category | Technology |
|----------|-------------|
| **Framework** | React 19 |
| **Build tool** | Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Smooth scroll** | Lenis |
| **Notifications** | react-hot-toast |
| **HTTP** | Axios |
| **AI APIs** | Replicate (for image generation in Round 1) |

---

## Project Structure

```
AI-Prompt-Combat-main/
├── ai-prompt-combat/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing Page/   # Hero, About, Prizes, Faculty, Team, etc.
│   │   │   ├── Navbar/
│   │   │   ├── Round1/        # Round 1 UI components
│   │   │   └── Lobby/
│   │   ├── pages/             # LandingPage, Lobby, Round1, Round2, etc.
│   │   ├── context/           # AuthContext (frontend-only by default)
│   │   ├── hooks/
│   │   ├── config.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── ...
├── README.md                  # This file
└── ...
```

---

## Key Features

### Landing Page

- **Hero:** Title, event date (2nd April, 11:00 AM – 1:00 PM), countdown to start, CTA buttons, stats (Prize Pool ₹10K, 2 hrs, 2 Rounds).
- **About:** Event description, Phase 1, Elimination Protocol, Phase 2.
- **Schedule (Timeline):** Reporting, Round 1, Round 2, Felicitation.
- **Tutorial:** Embedded video section for “how the competition works.”
- **Important Dates:** Same schedule in a dedicated section.
- **Prizes:** 1st ₹5,000, 2nd ₹3,000, 3rd ₹2,000; entry fee ₹199; certificates and trophies.
- **Event Details:** Venue (AIDS AV Hall, Lab 3, Lab 4–5), entry fee, faculty coordinators (Ms. Madhuri Walia, Ms. Ruchi Jain), student coordinators (with contact numbers), rules and regulations.
- **Organizers, Faculty, Team:** Club and department info and key people.
- **Footer:** Quick links, social (LinkedIn, Instagram), contact.

### App Routes

| Path | Description |
|------|--------------|
| `/` | Landing page |
| `/register` | Registration |
| `/login` | Login |
| `/lobby` | Participant dashboard (round access, leaderboard link) |
| `/round-1/rules` | Round 1 rules |
| `/round1` | Round 1 — AI image generation |
| `/round-2/rules` | Round 2 rules |
| `/round-2` | Round 2 — AI video generation |
| `/leaderboard` | Live leaderboard |
| `/admin` | Admin (placeholder when backend is disconnected) |

### UX

- Responsive layout (mobile and desktop).
- Smooth scrolling (Lenis) and Framer Motion animations.
- Hash-based in-page navigation (e.g. `/#about`, `/#contact`).
- Toast notifications for actions and errors.
- Dark theme with gold/primary accent (`#D4AF37`).

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** (or yarn/pnpm)

### Install and run

```bash
cd ai-prompt-combat
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the URL shown in the terminal).

### Build for production

```bash
npm run build
```

Output is in `ai-prompt-combat/dist`. Serve with any static host (e.g. Netlify, Vercel, or your own server).

### Preview production build

```bash
npm run preview
```

---

## Configuration

- **Environment:** Use `.env` for API keys and config if you add backend/Firebase (see `src/firebase.js` and `src/config.js`).
- **Event date (countdown):** In `src/components/Landing Page/HeroSection.jsx`, `getEventDate()` sets the target (default: 2nd April, 11:00 AM); adjust year/month/day if needed.
- **Tutorial video:** Set `YOUTUBE_VIDEO_ID` in `src/components/Landing Page/TutorialVideo.jsx` to embed your YouTube tutorial.

---

## Backend and Auth

The app can run as a **frontend-only** demo:

- Auth is simulated (no Firebase/auth server required).
- Lobby, leaderboard, and round submission flows work in the UI; connect your own backend/APIs to persist data and enforce rules.

To connect a real backend:

- Configure Firebase (or your auth/database) via env and `src/firebase.js`.
- Point API calls in Round1, Round2, Lobby, and Leaderboard to your server.

---

## License and Contact

For event or website queries, contact the **Student Coordinators** or **Faculty Coordinators** listed on the live site: [https://www.aipromptcombat.in/](https://www.aipromptcombat.in/).

---

**AI Prompt Combat 2.0** — *Where Creativity Meets Precision.*
