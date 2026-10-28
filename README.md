# Smart Waste Management — OS Simulator

An interactive operating systems Producer–Consumer synchronization simulator featuring Dijkstra semaphores, mutex critical sections, and dramatic race condition collisions.

---

## Option 1: Run the Full React App Locally (Recommended)

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.0.0 or higher). Verify with:
```bash
node -v
npm -v
```

### 2. Install Dependencies
Open your terminal in this project folder and run:
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open in Your Browser
Visit:
```
http://localhost:3000
```
(or `http://localhost:5173` if port 3000 is occupied).

---

## Option 2: Run Without Node.js (Instant Standalone HTML)

If you don't want to install Node.js or want to run it instantly offline:
1. Open the included `standalone.html` file directly in any web browser (double-click the file or right-click → Open With → Chrome/Firefox/Safari).
2. It contains the complete simulation, sound effects, collision animations, and overlays in a single file with zero dependencies!

---

## Available Scripts

- `npm run dev`: Starts the local development server at `http://localhost:3000`.
- `npm run build`: Compiles TypeScript and builds production-ready static assets in the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Checks TypeScript types with `tsc --noEmit`.
