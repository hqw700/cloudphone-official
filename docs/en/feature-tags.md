# Device Tag Management & Matrix Filtering

When managing dozens or hundreds of devices, ScrcpyOverWebRTC provides a robust **color-coded device tagging and responsive matrix filtering system**, allowing you to categorize fleets by project, hardware model, team assignment, or operational status.

---

## 🏷️ Key Features

1. **Custom Names & Color Palettes**:
   - Each tag includes a unique identifier, customizable name (e.g. `Production`, `QA Testbed`, `Game Bot Farm A`), and high-contrast color badges.
2. **Cloud & Local Dual-Track Persistence**:
   - Tag modifications save locally in `localStorage` and synchronize immediately to the signaling server under `data/tags.json`;
   - Logging in from different workstations or browsers automatically syncs your tag architecture.
3. **Sub-Millisecond Responsive Filtering**:
   - The top toolbar displays all active tag chips with device count indicators;
   - Clicking any tag chip instantly filters the matrix view, displaying only matching devices and streamlining batch operations across large farms.

---

## 🛠️ Step-by-Step Instructions

### 1. Create or Assign Tags
1. On any device card or list row, click the **"Edit Tags"** icon (🏷️).
2. In the tag management modal:
   - **Existing Tags**: Check or uncheck to assign/remove;
   - **Create New Tag**: Enter a name, pick an accent color, and click "Add Tag".
3. Save changes; the device card immediately renders the color-coded tag pills.

### 2. Filter Matrix by Tag
1. Navigate to the **"Dashboard"** or device list.
2. The toolbar displays all available filter chips (e.g. `🏷️ Production (8)`, `🏷️ Testbed (3)`).
3. Click a chip to filter the matrix to matching devices; non-matching devices are smoothly hidden.
4. Click again to clear the filter and restore full fleet view.
