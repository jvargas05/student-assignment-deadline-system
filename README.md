# DueTrack - Student Assignment and Deadline Management System

**DCIT 26 Final Project** · Full-stack web application (React + React Router + Express + MongoDB + Mongoose)

| | |
|---|---|
| **Team** | Paloma, Vargas, Figueroa, De Leon, Macaburas_ |
| **Course / Section** | BSIT 3-5 |
| **GitHub repository** | _[https://github.com/your-team/deadline-manager](https://github.com/jvargas05/student-assignment-deadline-system)_ |
> Fill in the italic placeholders above before submitting.

---

## 1. Problem and users

Students handle many courses at once, and deadlines end up scattered across chat groups, notebooks and memory. Assignments, quizzes and exams get missed, or are remembered only the night before.

**DueTrack** gives students one place to record every academic task, see what is due first, and mark work as submitted.

**Target users:** college students (primary). The same design can later support student organizations or study groups.

## 2. Objectives

1. Let students create, view, update and delete assignments, quizzes, projects and exams with a due date, course, priority and status.
2. Show at a glance what is overdue, due today, or due soon, using a dashboard and color-coded cards.
3. Let students search, filter by status and sort their tasks so they can find work quickly.
4. Store all records in MongoDB so data is kept after the server restarts.
5. Provide a responsive interface that works comfortably on desktop, tablet and phone.

## 3. Features

- **Dashboard** with counts (Open, Overdue, Due in 7 days, Submitted) and a "Next up" list.
- **Full CRUD** on assignments (create, read, update, delete) through the React interface.
- **Urgency labels** computed from the due date: Overdue / Due today / Due in X days / Submitted.
- **One-tap "Mark submitted"** (PATCH) from the dashboard, list or detail page.
- **Search, status filter and sort** on the assignments list.
- **Form validation** on both client and server, with clear error messages.
- **Loading, empty and error states** on every data page.
- **Routing:** dashboard, list, dynamic detail page, add/edit forms with redirect after submit, and a 404 page.
- **Mobile-ready:** bottom tab navigation on phones, 44px touch targets, responsive layout.

**Out of scope (for this version):** user accounts / login, email or push notifications, file attachments, calendar sync, group collaboration.

## 4. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (functional components, hooks), Vite, React Router v6, plain CSS |
| Backend | Node.js (ES modules), Express 4, CORS, dotenv |
| Database | MongoDB with Mongoose 8 |
| Tools | Git/GitHub, nodemon, curl / Postman / Thunder Client |

## 5. Project structure

```
deadline-manager/
├── client/                     # React (Vite) frontend
│   ├── index.html
│   ├── vite.config.js          # dev proxy: /api -> http://localhost:5000
│   ├── .env.example
│   └── src/
│       ├── main.jsx            # entry point, BrowserRouter
│       ├── App.jsx             # route table
│       ├── constants.js
│       ├── api/assignments.js  # fetch calls to the Express API
│       ├── utils/dates.js      # date formatting + urgency logic
│       ├── components/         # reusable components (props-driven)
│       ├── pages/              # one file per route
│       └── styles/index.css
├── server/                     # Express API
│   ├── .env.example
│   └── src/
│       ├── index.js            # starts server after DB connects
│       ├── app.js              # middleware + routes
│       ├── config/db.js        # MongoDB connection
│       ├── models/Assignment.js        # Mongoose schema + validation
│       ├── controllers/assignmentController.js
│       ├── routes/assignments.js
│       ├── middleware/errorHandler.js  # 404 + error responses
│       └── seed.js             # optional sample data
├── docs/
│   ├── curl-tests.sh           # automated API tests
│   ├── api-tests.http          # same requests for REST Client / Thunder Client
│   └── screenshots/            # put your screenshots here
├── .gitignore
├── package.json                # helper scripts
└── README.md
```

## 6. Installation and run steps

**Requirements:** [Node.js 18+](https://nodejs.org), [Git](https://git-scm.com), and MongoDB (local or Atlas - see section 7).

```bash
# 1. Clone and enter the project
git clone <your-repository-url>
cd deadline-manager

# 2. Install dependencies for both server and client
npm run install:all

# 3. Create the server .env file (see sections 7 and 8)
#    macOS/Linux:  cp server/.env.example server/.env
#    Windows:      copy server\.env.example server\.env
#    then open server/.env and check MONGODB_URI

# 4. (Optional) add sample data
npm run seed

# 5. Start the API (terminal 1)  ->  http://localhost:5000
npm run dev:server

# 6. Start the React app (terminal 2)  ->  http://localhost:5173
npm run dev:client
```

Open **http://localhost:5173** in your browser. To view on a phone on the same Wi-Fi, run `npm --prefix client run dev -- --host` and open the "Network" URL that Vite prints. You can also use the browser's device toolbar (F12 → Toggle device toolbar) to demonstrate a mobile viewport.

**Production-style run (one server):**

```bash
npm run build                 # builds client/dist
NODE_ENV=production npm start # Express serves the API and the built React app on PORT
```

(On Windows PowerShell: `$env:NODE_ENV="production"; npm start`.)

## 7. MongoDB setup

**Option A - Local MongoDB**
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) (and optionally MongoDB Compass).
2. Make sure the MongoDB service is running.
3. Use `MONGODB_URI=mongodb://127.0.0.1:27017/deadline_manager` in `server/.env`. The database and collection are created automatically on first save.

**Option B - MongoDB Atlas (free cloud)**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Database Access → add a database user (username + password).
3. Network Access → allow your IP (or `0.0.0.0/0` for class demos only).
4. Connect → Drivers → copy the connection string into `MONGODB_URI` in `server/.env`, replacing `<username>` and `<password>`.

> Never commit `server/.env`. It is listed in `.gitignore`. Only `.env.example` is committed.

## 8. Environment variables

| File | Variable | Purpose | Example |
|---|---|---|---|
| `server/.env` | `PORT` | API port | `5000` |
| `server/.env` | `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/deadline_manager` |
| `server/.env` | `CLIENT_ORIGIN` | Allowed CORS origin(s), comma-separated | `http://localhost:5173` |
| `server/.env` | `NODE_ENV` | `development` or `production` | `development` |
| `client/.env` _(optional)_ | `VITE_API_URL` | API base URL when hosted separately | `/api` |

## 9. API capabilities

Base URL: `http://localhost:5000/api` · All responses are JSON.

| Method | Endpoint | Description | Success | Error codes |
|---|---|---|---|---|
| GET | `/health` | Server health check | 200 | - |
| GET | `/assignments` | List all. Query: `status`, `search`, `sort` (`dueDate`, `-dueDate`, `newest`, `title`) | 200 | 400 (invalid status) |
| GET | `/assignments/:id` | Get one | 200 | 400 (bad id), 404 |
| POST | `/assignments` | Create | 201 | 400 (validation) |
| PUT | `/assignments/:id` | Update (validated) | 200 | 400, 404 |
| PATCH | `/assignments/:id` | Partial update (e.g. `{"status":"Submitted"}`) | 200 | 400, 404 |
| DELETE | `/assignments/:id` | Delete | 200 | 400, 404 |

Any other route returns `404`. Unexpected failures return `500` with a generic message - stack traces and database details are never sent to the client (they are only logged on the server).

**Assignment fields**

| Field | Type | Rules |
|---|---|---|
| `title` | String | required, 3-120 chars, trimmed |
| `course` | String | required, max 60 chars |
| `description` | String | optional, max 1000 chars |
| `category` | String | `Assignment`, `Quiz`, `Project`, `Exam`, `Lab`, `Other` (default `Assignment`) |
| `dueDate` | Date | required |
| `priority` | String | `Low`, `Medium`, `High` (default `Medium`) |
| `status` | String | `Pending`, `In Progress`, `Submitted` (default `Pending`) |
| `createdAt`, `updatedAt` | Date | automatic timestamps |

**Example error response (400)**

```json
{ "message": "Validation failed", "errors": ["Title is required", "Course is required"] }
```

## 10. Testing notes

Full test cases and a results table are in the **Test Evidence** document. Summary:

**A. React interface (manual)** - add, view, edit, mark submitted, delete; search/filter/sort; invalid form input; open a non-existent assignment URL; open an unknown URL (404 page); stop the server to see the error state; empty database to see the empty state; mobile viewport (375px wide).

**B. API tests** - run the automated script (server must be running):

```bash
bash docs/curl-tests.sh
# or against a deployed URL:
bash docs/curl-tests.sh https://your-deployed-url.com
```

It covers valid input, invalid input, missing records (404), malformed IDs, empty search results and unknown routes. The same requests are available in `docs/api-tests.http` for the VS Code REST Client extension, and can be copied into Thunder Client or Postman.

**C. Persistence check** - create a record → stop the server (Ctrl+C) → start it again → refresh the page → the record is still there.

## 11. Screenshots

Add your screenshots to `docs/screenshots/` and link them here:

```
![Dashboard (desktop)](docs/screenshots/dashboard-desktop.png)
![Assignments list](docs/screenshots/list-desktop.png)
![Add form](docs/screenshots/add-form.png)
![Detail page](docs/screenshots/detail.png)
![Dashboard (mobile)](docs/screenshots/dashboard-mobile.png)
![404 page](docs/screenshots/not-found.png)
```

## 12. Deployment / demo

- **Local demo:** follow section 6.
- **Hosted (optional):** MongoDB Atlas for the database + a Node host such as Render. Build command: `npm run install:all && npm run build`. Start command: `npm start`. Set `NODE_ENV=production`, `MONGODB_URI` and `PORT` in the host's environment settings (never in the repository). Because Express serves `client/dist` in production, only one service is needed.

## 13. Git workflow and team contributions

- `main` always stays runnable. Larger work happens on short feature branches (e.g. `feature/assignment-form`, `feature/api-crud`), merged by pull request.
- Commit often with clear messages (e.g. `Add Mongoose Assignment model with validation`).
- Tasks are tracked with GitHub Issues / a Project board, one assignee per task.

| Member | Main contributions |
|---|---|
| _Member 1_ | _e.g. Express API + Mongoose model_ |
| _Member 2_ | _e.g. React pages and routing_ |
| _Member 3_ | _e.g. Components, styling, responsive design_ |
| _Member 4_ | _e.g. Testing, documentation, deployment_ |

## 14. Maintenance notes

- **Add a field:** update `server/src/models/Assignment.js` (and `EDITABLE_FIELDS` in the controller), then the form in `client/src/components/AssignmentForm.jsx` and the detail page.
- **Add a new resource** (e.g. `Course`): create a model, controller and route file, mount it in `server/src/app.js`, then add an API module and pages in the client.
- **Update dependencies:** run `npm outdated` and `npm update` inside `server/` and `client/`, then re-run the API test script.
- **Backups:** export the database with `mongodump` (local) or Atlas backups.
- **Keep secrets safe:** if a password was ever committed, change it in Atlas immediately.
