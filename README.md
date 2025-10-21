# 🦊 RaffleFox Admin Portal

**RaffleFox** is a secure, cloud-based admin portal designed to manage digital raffles, prizes, sponsors, and user databases.
It provides a streamlined dashboard for administrators to handle game operations, monitor participants, manage partner libraries, and automate notifications — all from one place.

---

## 🚀 Features

### 🎮 Game & Prize Management

* Create, edit, and monitor active raffle games.
* Add prizes with images, descriptions, and statuses.
* Track prize inventory and winners in real-time.

### 👥 Gamers & Sponsors

* Manage player accounts, including profile details and game history.
* Add and manage sponsors, logos, and campaigns.
* Control partner and admin access levels.

### 📦 Library & Media Management

* Upload and manage game images and sponsor assets.
* Store and organize digital files with Firebase Storage integration.

### 🔔 Notifications

* Send announcements or push notifications to users.
* Manage in-app or email alerts for key events.

### 🔐 Authentication & Access Control

* Secure login via Firebase Authentication.
* Role-based permissions for Admins, Partners, and Operators.

---

## 🧩 Tech Stack

| Layer                | Technology                        |
| -------------------- | --------------------------------- |
| **Framework**        | Next.js 15 (React 19)             |
| **UI Library**       | React Components + Tailwind CSS   |
| **State Management** | React Hooks / Context API         |
| **Backend Services** | Firebase Auth, Firestore, Storage |
| **Deployment**       | Netlify                           |
| **Version Control**  | GitHub                            |

---

## 🛠️ Local Development

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-org/rafflefox-admin.git
cd rafflefox-admin
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add your environment variables

Create a `.env.local` file in the root directory with the following keys:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ Run the development server

```bash
npm run dev
```

Then visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Deployment

The app is deployed on **Netlify**:
🔗 [raffle-games.netlify.app](https://raffle-games.netlify.app/)

To deploy updates:

1. Commit and push changes to the `main` branch.
2. Netlify will automatically detect changes and redeploy.

---

## 📁 Folder Structure

```
├── components/         # Reusable UI components
├── pages/              # Next.js routes
│   ├── index.js        # Dashboard
│   ├── login.js        # Auth page
│   ├── prize-database/
│   ├── game-database/
│   ├── partner-management/
│   ├── admin-management/
│   └── ...
├── lib/                # Firebase and helper functions
├── public/             # Static assets
├── styles/             # Global stylesheets
└── .env.local.example  # Example environment file
```

---

## 🧑‍💻 Contributors

* **Lead Developer:** [Your Name]
* **Design & UI:** [Contributor or Team Name]
* **Deployment:** Netlify

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

