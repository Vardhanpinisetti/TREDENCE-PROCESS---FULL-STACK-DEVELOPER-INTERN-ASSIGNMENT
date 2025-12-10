# HR Workflow Designer

**React + TypeScript + Vite** — A lightweight visual workflow designer for HR processes (Start → Task → Approval → Automated → End).
This README documents what we built and gives step-by-step instructions to run, export/import workflows, and push the project to GitHub.

---

## Table of contents

1. Project overview
2. Features implemented
3. Project structure (how it looks)
4. How to run locally (quick)
5. How to use the app (step-by-step)

   * Build a simple workflow (Start → Task → Approval → Automated → End)
   * Export workflow JSON
   * Save the JSON file (exact filename & place)
   * Import workflow JSON back into the app
   * Simulate workflow
6. Git / GitHub: push your project (clean steps)
7. Screenshots (where to place them)
8. Next steps / optional improvements
9. License / credits

---

## 1. Project overview

This app is a drag-and-drop workflow designer built with **React**, **TypeScript** and **React Flow**. Users can add node types (Start, Task, Approval, Automated, End), connect them with edges, edit node properties in a side panel, export the workflow as JSON, import workflows, and run a simple simulation.

---

## 2. Features implemented

* Custom node types: **Start, Task, Approval, Automated, End**
* Add nodes from left palette (sidebar)
* Drag & drop nodes on canvas, connect nodes using edges
* Node details panel (edit label and type-specific properties)
* Toolbar with: **Export**, **Import**, **Simulate**
* Export copies workflow JSON to clipboard
* Import accepts pasted JSON and loads nodes + edges
* Simulation shows a readable step list (alert) sorted top→bottom

---

## 3. Project structure (how it should look)

```
Desktop
 └─ hr-workflow-designer
     ├─ components
     │   ├─ canvas
     │   ├─ forms
     │   └─ sidebar
     ├─ context
     ├─ public
     ├─ services
     ├─ src
     │   ├─ assets
     │   │   └─ workflow-example.json      <- placed example export here (optional)
     │   ├─ App.tsx
     │   ├─ main.tsx
     │   └─ index.css
     ├─ utils
     ├─ .gitignore
     ├─ package.json
     ├─ tsconfig.json
     └─ README.md
```

---

## 4. How to run locally (quick)

(Assumes Node & npm installed)

1. Open terminal in project folder:

   ```bash
   cd "C:\React Projects\hr-workflow-designer"
   ```
2. Install:

   ```bash
   npm install
   ```
3. Start dev server:

   ```bash
   npm run dev
   ```
4. Open browser:

   ```
   http://localhost:5173
   ```

---

## 5. How to use the app (step-by-step)

### A. Build the workflow: Start → Task → Approval → Automated → End

1. Open the app in the browser.
2. From the **Node Palette** (left sidebar) click each node button to add:

   * Click **Start Node** → it adds the Start node on the canvas.
   * Click **Task Node** → it adds a Task node, position it underneath Start.
   * Click **Approval Node** → position under Task.
   * Click **Automated Step Node** → position under Approval.
   * Click **End Node** → position under Automated.
3. Connect nodes:

   * Hover over a source handle (bottom of a node). Click and drag to the target handle (top of the next node). Repeat to create the vertical chain:

     ```
     Start -> Task -> Approval -> Automated -> End
     ```

### B. Edit node properties

1. Click a node to open the **Node Details** panel (right side).
2. Change `Label` or any type-specific fields (Assignee, Approver Role, Action ID, etc.)
3. Changes are saved live in the node’s `data.config`.

### C. Export workflow JSON (copy)

1. Click **Export** (toolbar, top).
2. App copies a JSON string to your clipboard and shows an alert: *"Workflow JSON copied to clipboard."*

### D. Save exported JSON in Notepad (exact filename & where)

1. Open **Notepad** (or any code editor).
2. Paste (Ctrl+V) the JSON you copied.
3. Save the file with this filename:

   ```
   workflow-example.json
   ```

   **Where to save it:** inside your project (optional), recommended:

   ```
   hr-workflow-designer/src/assets/workflow-example.json
   ```

   That way you keep an example workflow inside the repo and can open it later.

### E. Import workflow JSON back into the app

1. Click **Import** (toolbar).
2. A prompt appears: **Paste workflow JSON:** — open the file you saved, copy all JSON and paste into the prompt, then press **OK**.
3. If JSON is valid the app will load the nodes & edges and show *"Workflow loaded."*

> Tip: Instead of copy/paste you can keep multiple JSON files in `src/assets` and open them in an editor to copy their contents when importing.

### F. Simulate

1. Click **Simulate** (toolbar).
2. The app sorts nodes top→bottom and shows a step list (alert) describing each node (Assignee, Role, Action, etc.). This is a simple textual simulation to verify the flow.

---

## 6. Git / GitHub: push your project (recommended safe steps)

If your remote repo already had a README or initial commit and you see push rejections, use these safe steps:

1. Add remote (if not already set):

   ```bash
   git remote add origin https://github.com/<your-username>/<repo>.git
   ```
2. Ensure you are on main:

   ```bash
   git switch main
   ```

   or create main if needed:

   ```bash
   git switch -c main
   ```
3. Pull remote changes first (merge or rebase):

   ```bash
   git pull --rebase origin main
   ```

   If there are conflicts, resolve them, then:

   ```bash
   git add <files>
   git rebase --continue
   ```
4. Commit local changes:

   ```bash
   git add .
   git commit -m "Initial project upload"
   ```
5. Push:

   ```bash
   git push -u origin main
   ```

   If remote has unrelated commits and you want to overwrite (be careful — this replaces remote):

   ```bash
   git push -u origin main --force
   ```

> In your case you used `--force` to push — that is okay for a fresh repo but avoid force pushes on shared branches later.



## 7. Screenshots

Add screenshots into `docs/` or `src/assets/screenshots/` and reference them in README.

Suggested screenshots to include:

* Canvas with Start → Task → Approval → Automated → End
* NodeConfigPanel open with a node selected
* Export dialog / exported JSON saved in editor
* GitHub repo page showing files


## 8. Next steps / optional improvements

* Add keyboard **Delete** shortcut or right-click menu to delete nodes.
  Implementation ideas:

  * Add a focused-node state and handle `keydown` event for `Delete` to call a `removeNode` function.
  * Or add a toolbar **Delete** button that removes the selected node.
* Persist workflows to localStorage or backend (PUT/GET).
* Improve import UX to accept a file upload instead of paste prompt.
* Better simulation: show timeline, logs, and success/failure conditions.


## Example snippet: exported JSON (small example)

Save this in `src/assets/workflow-example.json` as a starting example:

```json
{
  "nodes": [
    { "id": "1", "type": "start", "label": "Start", "config": {}, "position": { "x": 350, "y": 80 } },
    { "id": "2", "type": "task", "label": "Task", "config": { "assignee": "Unassigned" }, "position": { "x": 350, "y": 180 } },
    { "id": "3", "type": "approval", "label": "Approval", "config": { "approverRole": "" }, "position": { "x": 350, "y": 280 } },
    { "id": "4", "type": "automated", "label": "Automated Step", "config": { "actionId": "" }, "position": { "x": 350, "y": 380 } },
    { "id": "5", "type": "end", "label": "End", "config": {}, "position": { "x": 350, "y": 480 } }
  ],
  "edges": [
    { "source": "1", "target": "2" },
    { "source": "2", "target": "3" },
    { "source": "3", "target": "4" },
    { "source": "4", "target": "5" }
  ]
}


