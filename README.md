# 6D Ops - OneTeam

This is the monorepo for the "6D Ops - OneTeam" internal project management application.

## Overview

The repository contains two separate frontend applications and the shared Firebase backend configuration:

* **`apps/public-ui`**: The main application for team members to view projects, manage tasks, and submit reports. Uses Google Auth.
* **`apps/admin-ui`**: The administrative interface for managing projects, users, and roles. Uses Email/Password auth.
* **`firebase/`**: Contains Firestore rules and Cloud Functions for backend logic.

## Prerequisites

* Node.js (v18 or later)
* npm (v9 or later)
* Firebase CLI (`npm install -g firebase-tools`)

## Local Development Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd 6d-ops-oneteam
    ```

2.  **Install all dependencies:**
    This project uses npm workspaces. Run the install command from the root directory.
    ```sh
    npm run install-all
    ```

3.  **Create Environment Files:**
    You need to create a `.env.local` file in both `apps/public-ui/` and `apps/admin-ui/`.

    * Copy the contents of `.env.example` into a new `.env.local` file in each app directory.
    * Fill in the values with your actual Firebase project configuration keys.

4.  **Run the Development Servers:**
    To run both the public and admin UIs simultaneously, use the script from the root `package.json`.
    ```sh
    npm run dev
    ```
    * The Public UI will typically run on `http://localhost:5173`.
    * The Admin UI will typically run on `http://localhost:5174`.

## Deployment

Deployment to Firebase Hosting is handled automatically via GitHub Actions when code is pushed to the `main` branch.

* The `public-ui` app is deployed to the main project hosting URL.
* The `admin-ui` app is deployed to its separate hosting target.

To deploy manually, use the Firebase CLI from the root directory:
```sh
# Deploy everything (hosting, rules, functions)
firebase deploy

# Deploy only a specific part
firebase deploy --only hosting:public-ui
firebase deploy --only hosting:admin-ui
firebase deploy --only firestore:rules
```
