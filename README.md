# Habit Tracker

[![CI](https://github.com/alisfand99/Habit-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/alisfand99/Habit-Tracker/actions/workflows/ci.yml)

A local-first habit tracker for web and Android. Check off habits daily, watch streaks grow, and unlock achievements. All data stays on the device: there is no account and no server.

## Features

- **Today view** with one-tap check-ins, emoji and categories, and a focus overlay for the habit you are working on
- **Weekly log** and **stats** with streaks, completion rates and history
- **Gamification:** 37 achievements with progress tracking
- **Reminders:** configurable local notifications per habit
- **Feedback:** haptics and sound effects (via Capacitor)
- **Calendars:** Gregorian, Persian (Jalali) and Hijri, switchable in Settings
- **Dark mode**, mobile-first layout and glassmorphism UI
- **Android app** built from the same codebase with Capacitor

## Tech stack

React 18, Vite, Tailwind CSS, Lucide icons, `date-fns` with Jalali support, Capacitor 8 (Android, Haptics).

## Getting started

```bash
git clone https://github.com/alisfand99/Habit-Tracker.git
cd Habit-Tracker
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

### Android

```bash
npm run android:update     # build the web app, regenerate icons, sync to Android
npm run cap:open:android   # open the project in Android Studio and run it
```

`build-android.ps1` automates the same steps on Windows. Sound files can be fetched with `npm run download:sounds`.

## Project structure

```
src/
├── components/   Today, weekly, stats and settings tabs, modals, drawers
├── hooks/        useHabits, useGamification, useNotifications, useHaptics, useSoundEffects
└── utils/        calendar helpers (Gregorian, Jalali, Hijri)
android/          Capacitor Android project
```

## Design notes

- Habits and settings are stored in `localStorage`, so the app works fully offline and nothing leaves the phone.
- Business logic lives in hooks, which keeps the UI components small and easy to test.
