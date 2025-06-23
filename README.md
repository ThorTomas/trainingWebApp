# Tendo (TrainingWebApp)

🏃 **Tendor** is a modern web application for creating and managing training plans and training diaries.
✅ It allows users to build custom training plans, log completed activities, and track their progress.

🔮 **Future plans**
- [ ] Move the project to FastAPI
- [ ] Direct integration with **Strava API** (and other APIs) for automatic data import and validation
- [ ] Ability to share training plans with a coach
- [ ] Training groups
- [ ] Advanced graphs and statistics for progress tracking
- [ ] Move to PostgreSQL
- [ ] Mobile optimization

---

## 🚀 Features

- User registration and login through email validation
- Personal profile management (name, date of birth, etc.)
- Create and edit training plans
- Clear calendar view of training days
- Mark completed trainings
- Support for up to 5 training sessions per day
- Multi-language support (EN, CZ)
- Prepared structure for future API integrations (Strava, Garmin)

---

## 🛠 Tech stack
- **Frontend:** React / Vite / CSS / i18next (translation)
- **Backend:** Flask (Python)
- **Database:** SQLite (for now)

---

## 📂 Project structure
```bash
trainingWebApp/
├── backend/ # Flask server, API routes, models, services
├── frontend/ # React frontend with dashboard and auth
└── .env # Configuration and secrets
```
👉 For full details, see [`project_struc.txt`](project_struc.txt)

---

## ⚙ How to run the project (MVP)
```bash
### Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
```

```bash
# Frontend
cd frontend
npm install
npm run dev
```
**The app will be running at:**  
- Backend: [http://127.0.0.1:5000](http://127.0.0.1:5000)  
- Frontend: [http://127.0.0.1:5173](http://127.0.0.1:5173)

## 📜 License
This project is licensed under the [MIT License](LICENSE).
⚠ Commercial use beyond open-source and personal projects should be discussed and agreed upon with the author (Tomáš Thoř).
Please contact me for licensing options for commercial applications.

## ✉ Author
Tomáš Thoř  
thor.tomik@gmail.com

## 💡 Notes
The project is in development and may contain incomplete features. Issues and feature requests are welcome! Feel free to check [issues page](../../issues).

