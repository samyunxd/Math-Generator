# Math Practice Web App - Context & Feature Plan

## 🎯 Main Goal
A single-page, responsive, pastel-themed web app for practicing basic math operations (addition, subtraction, multiplication, division) with adjustable difficulty, performance tracking, and a cozy, minimalist vibe.

---

## 🌟 Main Features (Phase 1)
- Clean, minimalist, pastel-themed design (cozy, calming, large centered equation)
- Settings panel (top-left or bottom-left, small, easy to use)
  - Operation type: Add / Subtract / Multiply / Divide / Mixed
  - Number of questions to generate
  - Min and Max range of numbers (e.g. 1 to 20)
  - Option to allow negatives (for subtraction)
  - Show division answers as decimals or whole numbers
  - Timed Mode toggle (optional)
  - Number of addends (for addition, e.g. 2, 3, or more numbers to add)
  - Enable answer input box (user types answer, auto-checks)
- Question flow
  - Generate button: creates a new question (no answer shown yet)
  - Show Answer button: reveals the correct answer
  - Next question: auto-advance or manual (if enabled)
- All interactions on one page (no reloads, smooth experience)
- Responsive layout (desktop & mobile friendly)
- Perfect worksheet-style alignment (each digit in its own column, answer digits directly under the numbers above)
- Timed mode (timer pauses when answer is shown, resumes for next question)
- Session progress and score tracking (correct/incorrect, accuracy %)

---

## 🚀 Extra Features (Phase 2+)
- Streak bonus: show streaks for consecutive correct answers
- Sound effects: chime/tick for correct/wrong, mute option
- Theme toggle: Pastel Mode / Dark Mode
- Save progress: local storage for settings/progress
- Score tracker: correct/incorrect, accuracy %, optional time tracking
- Timer option: countdown/stopwatch
- Streak bonus: show streaks for consecutive correct answers
- Challenge mode: auto-increasing difficulty
- Mixed mode: random operations in one session
- Answer input box: type answer, auto-check (optional)
- Mobile-friendly controls: big buttons, tap/swipe, etc.
- Multi-addend support for other operations (e.g. multi-row multiplication)
- Worksheet print/export (generate printable PDF or worksheet)
- Customizable answer input underline style (matches worksheet look)
- Disable browser autocomplete for answer input
- Animated feedback for correct/wrong answers
- Stable, non-jumping UI for all elements

---

## ❌ What to Avoid
- Too many settings upfront (hide advanced in "More Settings")
- Distracting design (no weird fonts, soft animations only)
- Page reloads or interruptive forms
- Misaligned digits (all digits must be in their own columns, answer digits directly under the numbers above)
- Input box or underline jumping/moving on answer
- Browser autocomplete suggestions for answer input

---

## 📝 Development Plan
1. Build main features and core UI/UX (Phase 1)
   - Start with worksheet-style rendering and settings for operation, range, addends, etc.
   - Ensure perfect digit alignment for all question types.
   - Add answer input box, timer, and session progress.
2. Confirm main features are complete
3. Add extra features (Phase 2+), one at a time, confirming after each

---

## This file is a living document. Update as needed during development. 