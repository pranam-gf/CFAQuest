
# CFAQuest Interview Prep Guide

This document provides a deep dive into the architecture, technologies, and concepts used in the CFAQuest project. It's designed to prepare you for a technical interview by explaining the "what" and the "why" of each part of the stack.

---

## 1. High-Level Architecture (The Big Picture)

CFAQuest is a **monorepo** full-stack application built with a modern JavaScript/TypeScript stack.

- **Frontend:** A dynamic single-page application (SPA) built with **React**. It is responsible for everything the user sees and interacts with in the browser.
- **Backend:** A **Node.js** API server built with the **Express** framework. It handles business logic, data processing, and communication with the database.
- **Hosting:** The entire application is deployed on **Vercel**. The frontend is served as a static site, and the backend runs as a **serverless function**.

Think of it like this: Your Python/ML background is great for the "engine" (the backend logic). The frontend is the "car body and dashboard" the user interacts with, and Vercel is the "road and infrastructure" it all runs on.

---

## 2. Project Structure Explained

The project uses a **monorepo** structure, meaning the code for the frontend and backend lives in the same repository. This is managed by `npm workspaces`, defined in the root `package.json`.

- `/client/`: Contains the entire React frontend application.
- `/server/`: Contains the entire Node.js/Express backend API.
- `/api/`: A special directory for Vercel. It contains the entry point for the serverless function that runs our backend.
- `/shared/`: Contains code that is shared between the client and server (e.g., data validation schemas) to avoid duplication and ensure consistency.
- `/public/`: Static assets (like images) that are publicly accessible.
- `package.json` (root): Manages dependencies and scripts for the entire project. Notice the `workspaces` key.
- `vercel.json`: The configuration file for deploying the application to Vercel. This is a critical file to understand.

---

## 3. Frontend Deep Dive (`/client`)

The frontend is what the user sees. It's built to be fast, interactive, and modern.

### Key Technologies:

- **React (v18):**
    - **What:** A JavaScript library for building user interfaces. It uses a component-based architecture.
    - **Concept:** Think of the UI as a tree of components (e.g., `Header`, `Chart`, `Button`). Each component manages its own state (data). When the state changes, React efficiently updates only the necessary parts of the screen.
    - **Interview Topics:**
        - **JSX:** The syntax used to write HTML-like code in JavaScript.
        - **Components & Props:** Reusable UI pieces and how you pass data to them (like function arguments).
        - **State & Hooks:** `useState` for managing component-level data. `useEffect` for handling side effects (like fetching data) when a component renders or state changes.

- **Vite:**
    - **What:** The build tool and development server for the frontend.
    - **Concept:** It's an alternative to older tools like Webpack or Create React App. Its main advantage is an extremely fast development server, which speeds up development significantly. For production, it bundles all the code into optimized static files.

- **TypeScript:**
    - **What:** A superset of JavaScript that adds static typing.
    - **Concept:** Coming from Python, you're used to dynamic typing. TypeScript is like adding type hints (`str`, `int`, `list`) to your Python code, but for JavaScript. It helps catch errors during development before the code is even run. All `.ts` and `.tsx` files use TypeScript.

- **Styling: Tailwind CSS & shadcn/ui:**
    - **What:** A modern approach to styling.
    - **Tailwind CSS:** A utility-first CSS framework. Instead of writing CSS files, you apply pre-existing classes directly in your HTML/JSX (e.g., `className="text-blue-500 font-bold"`). This is configured in `tailwind.config.ts`.
    - **shadcn/ui:** This is NOT a component library, but a collection of reusable components (`/components/ui`) that you copy into your project. They are built using Radix UI (for accessibility) and styled with Tailwind CSS. It provides building blocks like `Button`, `Card`, `Dialog`.

- **Routing: `wouter`**
    - **What:** A library to handle client-side routing.
    - **Concept:** In a Single Page Application (SPA), clicking a link doesn't always reload the page from the server. `wouter` intercepts the URL change and tells React to render a different component (e.g., show the `/compare` page component when the URL is `/compare`).

- **Data Fetching & State: `TanStack React Query`**
    - **What:** A powerful library for managing "server state".
    - **Concept:** This is one of the most important libraries in the frontend. It simplifies fetching, caching, and updating data from your backend API. It handles loading states, error states, and re-fetching data automatically, making the UI more robust and responsive. It is configured in `lib/queryClient.ts`.

---

## 4. Backend Deep Dive (`/server`)

The backend is the brain of the operation, written in a style that might feel familiar to Flask or FastAPI in Python.

### Key Technologies:

- **Node.js:**
    - **What:** A JavaScript runtime environment. It allows you to run JavaScript code on a server (outside of a browser).
    - **Concept:** It's asynchronous and event-driven. This is different from a typical Python web server. Instead of handling one request per thread, Node.js uses a single thread and an "event loop" to handle many requests concurrently without getting blocked by I/O operations (like database queries).

- **Express.js:**
    - **What:** A minimal and flexible web application framework for Node.js.
    - **Concept:** It provides a simple API for creating routes, handling HTTP requests (GET, POST, etc.), and managing middleware. `server/routes.ts` likely defines the API endpoints (e.g., `/api/data`).

- **TypeScript & Build Process:**
    - **`tsx`:** Used to run TypeScript code directly in development without a separate compilation step.
    - **`esbuild`:** A very fast bundler used to compile the TypeScript backend code into a single, optimized JavaScript file (`/server/dist/index.js`) for production.

- **Database: PostgreSQL & Supabase**
    - **What:** The `package.json` lists both `postgres` and `@supabase/supabase-js`.
    - **`postgres`:** This is a lightweight, direct PostgreSQL client for Node.js. This suggests the application connects directly to a PostgreSQL database.
    - **`@supabase/supabase-js`:** Supabase is a "Backend as a Service" platform built on top of PostgreSQL. It can be used for more than just the database (e.g., authentication, file storage). The presence of both libraries might mean it's using Supabase's database infrastructure but connecting with the direct `postgres` client for some queries. **You should investigate `server/database-storage.ts` to be certain.**

- **Validation: `Zod`**
    - **What:** A TypeScript-first schema declaration and validation library.
    - **Concept:** This is used to define the "shape" of data. For example, you can define a schema that requires a `name` to be a string and an `age` to be a positive number. Zod is used in `/shared/schema.ts` to ensure that data sent from the client to the server (and vice-versa) is valid. This prevents bugs and adds a layer of security.

---

## 5. Deployment & Hosting (`vercel.json`)

This is how the code gets onto the internet. The `vercel.json` file is the instruction manual for the Vercel platform.

- **Vercel:** A cloud platform for hosting frontend and serverless applications. It's known for its excellent developer experience and integration with Git.

- **Serverless Functions:**
    - **Concept:** This is a key modern cloud concept. Instead of running a server 24/7 on a virtual machine, you deploy your backend code as a "function". Vercel automatically manages everything: it spins up the function when a request comes in, runs your code, and shuts it down. It scales automatically and you only pay for when it runs.
    - **Implementation:**
        1. A request comes in to `https://your-app.com/api/some-data`.
        2. The `vercel.json` `routes` config sees the `/api/` prefix and forwards the request to the `api/index.ts` function.
        3. `api/index.ts` is the serverless entry point. It imports and runs your main Express app from `/server/index.ts`.
        4. Your Express app handles the request and sends a response, just like it would on a traditional server.

- **Build & Deployment Flow:**
    1. You push code to your Git repository (e.g., GitHub).
    2. Vercel detects the push and starts a new deployment.
    3. It runs the `installCommand` (`npm install`).
    4. It runs the `buildCommand` (`npm run build --workspace=client`), which uses Vite to create the optimized static frontend in `/client/dist`.
    5. Vercel deploys the `/client/dist` directory as the static site.
    6. It looks at the `functions` config in `vercel.json` and builds the serverless function from `api/index.ts`, making sure to include all the necessary code from the `/server` directory.
    7. Once complete, the new version of your site is live.

---

## 6. How to Run Locally

To understand the project, you must run it.

1.  **Install Dependencies:** In the root directory, run `npm install`. This will install all dependencies for the root, client, and server workspaces.
2.  **Run Development Servers:** In the root directory, run `npm run dev`.
    - This uses `concurrently` to run two commands at once: `npm run dev --workspace=client` (starts the Vite dev server) and `npm run dev --workspace=server` (starts the Node.js backend server with `tsx`).
    - The frontend will be available at a local URL (e.g., `http://localhost:5173`).
    - The backend will run on a different port (e.g., `http://localhost:3000`).
    - The frontend is configured to send its API requests to the local backend server during development.

Good luck with your interview!
