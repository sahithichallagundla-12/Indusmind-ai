# INDUSMIND AI — Unified Warehouse & Operations Brain

> Transform unstructured warehouse manuals, standard operating procedures, and safety checklists into real-time operational intelligence.

**INDUSMIND AI** is a world-class enterprise knowledge intelligence platform designed as a central operations brain for smart warehouses, distribution centers, logistics hubs, and asset-intensive facilities. Built in style of premium SaaS interfaces (Stripe, Linear, Apple), it offers a dark-theme, interactive dashboard that acts as the single source of truth for assets, compliance, and logs.

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Executive Dashboard
* **Real-time Metrics**: Displays active monitoring states including processed documents, LangGraph knowledge connections, active sensor anomalies, and regulatory audit gaps.
* **Warehouse Load Monitoring**: Features interactive area charts visualizing active sorting load throughput and subsystem stress indicators.
* **Recent Activity Feed**: Keeps operators updated with live, chronological warehouse ingestion logs and alert status updates.

### 2. 📂 Document Center
* **Ingestion Dropzone**: Simulates file upload interfaces for onboarding warehouse SOPs, equipment guides, and fire hazard checklists.
* **Filtered Repositories**: Sorts files automatically under categories such as *SOP Manuals*, *Equipment Specs*, *Safety Guidelines*, and *Compliance Reports*.
* **Interactive Document Drawer**: Explores parsed PDF metadata, document authors, sizing, and excerpted chunks.

### 3. 💬 AI Copilot
* **RAG Retrieval Engine**: Queries warehouse manuals using suggested prompt chips like *"Show maintenance history for Conveyor Belt B-04"* or *"List safety audits for Zone C"*.
* **Interactive Citations**: Every AI response references source documents with interactive badges. Clicking a citation badge instantly takes the operator to that file in the Document Center.

### 4. 🔧 Maintenance Intel
* **Diagnostics Watchlist**: Displays anomaly logs for assets such as `Conveyor Belt B-04` (vibration offsets), `Forklift FL-12` (pressure seals), and `Barcode Scanner Net` (scanner drifts).
* **Action Dispatcher**: Updates subsystem states (e.g. *Open*, *Investigating*, *Scheduled*, *Resolved*) and routes instructions.
* **Vibration Charts**: Visualizes wear index projections versus failure rates using Recharts.

### 5. 🛡️ Compliance Intel
* **Regulatory Checklists**: Links operations with OSHA Title 29 safety audit protocols.
* **Audit Index Score**: Keeps track of facility readiness with automated calculations and predicted score updates.
* **Manual Compiler**: Compiles historical safety audit sheets and triggers celebration feedback upon compliance documentation success.

### 6. 📖 Lessons Learned
* **Bottleneck Chronology**: Lists historical operational incidents, root-cause analyses (RCA), and permanent corrective actions (e.g. conveyor belt tension adjustments).
* **Brain Shortcuts**: Consults the AI Copilot on specific historical breakdowns directly from the catalog timeline.

### 7. 🕸️ Knowledge Graph
* **Interactive Canvas**: Renders a custom SVG topology network illustrating the relationships between technical specs, safety guidelines, and active assets.
* **Force-Directed Controls**: Supports zooming (in/out) and coordinate panning. Clicking nodes pulls up their active connection directory in the side inspector.

### 8. 📈 Predictive Analytics
* **Throughput Regressions**: Projects stress curves and wear limits across M3, M6, or M12 ranges.
* **Life Warning Indicators**: Visually highlights wear limit warnings for active hydraulic valves, actuators, and belts.

### 9. ⚙️ Settings
* **Model Inference Sliders**: Adjusts LLM temperature, context windows, and primary inference models.
* **Vector DB Validator**: Tests and validates connection states to custom database schemas.
* **Access Credentials**: Manages live developer keys and organizational user permissions.

---

## 🛠️ Technology Stack

* **Core**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS, PostCSS (configured with premium custom dark scrollbars and frosted glass `.glass-panel` utilities)
* **Visualization**: Recharts (Composed & Area charts customized for dark slate tooltips)
* **Icons**: Lucide React
* **Feedback Utilities**: Canvas Confetti

---

## 💻 Local Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your local machine.

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "Intelligent documents analyzer"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```
   * The application will run locally at [http://localhost:5173](http://localhost:5173).

4. **Build the production bundle**:
   ```bash
   npm run build
   ```
   * Compiles the TypeScript configurations and generates optimized build assets in the `/dist` directory.
