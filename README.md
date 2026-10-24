# SkillSync AI

SkillSync AI is an AI-inspired career readiness and skill-gap analysis platform. It analyzes a resume, optionally connects GitHub and LeetCode, calculates a transparent Career Readiness Score, identifies role-specific skill gaps, gives recommendations, supports target-role switching, provides a What-If Simulator, and downloads a career report.

## UI
The existing light/white SkillSync AI UI and component structure are preserved. Features are added to the existing dashboard rather than replacing the design.

## Score model
- Role-Specific Skills: 40 points
- GitHub Profile & Development Activity: 20 points
- LeetCode Problem-Solving: 20 points
- Resume/Profile Quality: 20 points

Missing optional GitHub/LeetCode data contributes 0 points; the denominator remains 100, so missing data cannot artificially inflate the score.

## Resume analysis
Resume sections are detected by actual section headings. A phrase such as "hands-on experience" inside a Career Objective does NOT count as an Experience/Internship section.

## Backend setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on `http://127.0.0.1:5000`.

## Frontend setup
```bash
npm install
npm run dev
```

Frontend normally runs on the Vite URL shown in the terminal.

## Optional profiles
GitHub and LeetCode usernames are optional. Without them, those components remain unavailable/0 rather than being fabricated.

## What-If Simulator
The simulator sends the current analysis plus a scenario to `/api/what-if`. It detects role-relevant skills explicitly mentioned in the scenario and recalculates the role component while keeping Resume, GitHub, and LeetCode scores unchanged.

## Download Report
The dashboard downloads a self-contained HTML career report that can also be printed/saved as PDF from the browser.
