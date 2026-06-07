# 📅 AI Study Planner

A web-based AI-powered study planner that generates a personalized day-by-day schedule based on your syllabus topics, exam date, and daily availability.

## 🚀 Features
- Paste any topics or syllabus
- Set your exam deadline and daily study hours
- Get a smart schedule with priority levels (high / medium / low)
- Automatic revision days at the end
- Study tips for every day

## 🛠️ Tech Stack
- HTML, CSS, JavaScript
- Claude AI API (Anthropic)
- No backend required

## 💡 How It Works
1. User enters topics, exam date, and study hours
2. App distributes topics across available days
3. Final 1–2 days are reserved for revision
4. Each topic is tagged with a priority level

## 🔧 Architecture Decisions
- Frontend-only — no backend needed, keeps it simple and fast
- Topics parsed and distributed using a priority-based algorithm
- AI prompt engineered to return strict JSON for clean rendering

## 📈 Future Improvements
- Google Calendar export
- Spaced repetition logic
- Progress tracking across sessions

## 👨‍💻 Built By
[Your Name] — Built as part of an internship application prototype challenge
