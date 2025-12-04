
# HR Workflow Designer (Prototype)

A React-based visual editor for designing and simulating internal HR processes. This application allows administrators to visually map out workflows (e.g., Onboarding, Leave Approval), configure individual steps, and test the logic using a built-in simulation engine.

## 🚀 How to Run

This project was built using **React (Vite)** and **TypeScript**.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hr-workflow-designer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` (or the port shown in your terminal).

---

## 🏗 Architecture

The project follows a modular, feature-based architecture designed for scalability and separation of concerns.

```text
src/
├── components/          # UI Components
│   ├── CustomNodes.tsx  # React Flow custom node definitions (Start, Task, Approval, etc.)
│   ├── NodeConfigPanel.tsx # Form logic for editing selected nodes
│   ├── Sidebar.tsx      # Draggable node palette
│   └── SimulationPanel.tsx # Sandbox environment for testing flows
├── hooks/
│   └── useWorkflow.ts   # Custom hook managing React Flow state & interactions
├── services/
│   └── apiService.ts    # Mock API layer (Simulates REST endpoints & latency)
├── types.ts             # TypeScript interfaces & Domain models
├── constants.ts         # Static configuration (Node Types, Initial State)
└── App.tsx              # Main layout and composition
```

### Key Architectural Patterns
1. **Custom Hooks (`useWorkflow`)**: All complex graph logic (drag-and-drop handlers, connection logic, selection state) is extracted out of the view layer. This keeps `App.tsx` clean and focused solely on layout composition.
2. **Service Layer Abstraction**: The `apiService.ts` module isolates "backend" logic. In a real app, this would be replaced with `axios` or `fetch` calls without refactoring the UI components.
3. **Component Composition**: Nodes are built using small, styled atomic components to ensure visual consistency across different node types.

---

## 💡 Design Decisions

### 1. Library Choice: React Flow vs. Custom Canvas
I chose **React Flow** because it handles the heavy lifting of coordinate systems, zooming/panning, and edge rendering. This allowed me to focus on the *business logic* (node configuration, simulation) rather than the math of rendering a graph.

### 2. UI Framework: Material UI (MUI v6)
Given the requirement for an "Enterprise" tool, I selected **Material UI**.
- **Consistency:** Provides a cohesive look and feel suitable for internal tools.
- **Speed:** Rapid development of complex forms (Selects, Date Pickers, text inputs) in the Configuration Panel.
- **Theming:** Used `styled` components to separate CSS from JSX, ensuring clean code maintenance.

### 3. Simulation Strategy (Frontend-Side)
To satisfy the "Simulation" requirement without a real backend, I implemented a **Graph Traversal Algorithm (BFS-like)** in `apiService.ts`.
- It validates the graph structure (e.g., checks for a Start node, detects simple loops).
- It uses `setTimeout` to mimic network latency, providing realistic feedback to the user (loading states, step-by-step execution logs).

### 4. Layout
I moved away from overlapping panels (modals) to a **Tiled Layout**.
- **Sidebar (Left):** Always visible for easy access to tools.
- **Config Panel (Right):** Appears side-by-side with the canvas so users can see the node they are editing.
- **Simulation (Bottom):** A dedicated terminal-like area to view execution logs without obstructing the visual flow.

---

## ✅ Completed vs. Future Improvements

### Completed Features
- [x] **Drag-and-Drop Canvas:** Support for 5 custom node types (Start, Task, Approval, Automation, End).
- [x] **Node Configuration:** Dynamic forms that update node data in real-time.
- [x] **Mock API Layer:** Simulated endpoints for fetching automation actions (`GET /automations`) and running workflows (`POST /simulate`).
- [x] **Simulation Engine:** Visual log of workflow execution with validation for disconnected graphs.
- [x] **Responsive Layout:** Clean CSS layout using Flexbox and MUI.

### Future Improvements (With More Time)
1. **Persistent Backend:** Integrate with a real Node.js/Express backend to save workflow JSON to a database (PostgreSQL/MongoDB).
2. **Complex Branching Logic:** Currently, the flow is linear or simple merging. I would add "Decision/If-Else" nodes that evaluate variables (e.g., `if salary > 50k`) to split the path.
3. **Undo/Redo:** Implement `zundo` or a history stack to allow users to revert changes on the canvas.
4. **Minimap & Controls:** Add React Flow's `<MiniMap />` for better navigation of large workflows.
5. **Node Validation Visuals:** Show red borders/icons directly on nodes on the canvas if they are missing required configuration (e.g., missing Assignee).
