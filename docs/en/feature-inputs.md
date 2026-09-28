# Advanced Input: IME Text, Clipboard & Keymapping

When controlling remote Android devices, text typing friction with non-Latin characters, broken clipboard synchronizations, and awkward PC-to-touch controls are common challenges.  
ScrcpyOverWebRTC provides a cohesive input subsystem consisting of **100% full-text IME injection, silent bidirectional clipboard sync, and a visual keymapping engine**.

---

## ⌨️ 1. 100% Full-Text IME Character Injection

### 1. Underlying Bottleneck & Breakthrough
- **Android System Limits**: Android's native `InputManager` and standard scrcpy `injectChar` APIs only support ASCII code points. Directly sending non-ASCII characters (Chinese, Japanese, accented characters, emojis) causes Android to discard events with `Could not inject char`.
- **Architectural Solution**:
  1. The web controller creates a **1px transparent textarea session manager** inside the viewport, locking physical focus whenever users click on the stream;
  2. Listens to browser native `compositionstart` / `compositionend` input synthesis events;
  3. When candidate selection finishes (e.g. pressing Space on Sogou, Microsoft, or Apple Pinyin), the frontend writes the resolved text atomically into the Android system clipboard and triggers an immediate Paste event;
  4. **Result**: Achieves **100% smooth character injection** without requiring specialized third-party keyboard apps on the cloud phone.

### 2. Usage
Click into any text field inside the cloud phone display, and type normally using your desktop OS's native IME (Microsoft Pinyin, Sogou, Gboard, Apple Chinese). Characters land on the screen instantaneously upon word selection.

---

## 📋 2. Silent Bidirectional Clipboard Sync

The system synchronizes clipboards between the host PC and remote Android devices:

### 1. Mechanism
- **Focus Rebound Sync**: When switching back to the cloud phone browser tab, the frontend checks for local clipboard changes and silently updates the Android clipboard via the WebRTC DataChannel;
- **Keyboard Shortcuts**: Pressing `Ctrl + V` (`Cmd + V` on macOS) pastes desktop text or URLs directly into the active Android text cursor;
- **Infinite Loop Prevention**: Both sides compute rolling hashes of recent clipboard contents, eliminating infinite feedback loops.

---

## 🎮 3. Visual Keymapping Engine

The interface includes a full-featured visual keymapping editor comparable to top Android emulators, mapping keyboard strokes to touch coordinates and multi-touch gestures.

### 1. Core Mapping Types

| Type | Mechanics | Common Use Cases |
| :--- | :--- | :--- |
| **Tap (Single Click)** | Binds a key (e.g. `Space`) to coordinates (`X, Y`), dispatching touch Down/Up events | Action buttons, shooting, jump, menu confirmation |
| **Joystick (8-Axis D-Pad)** | Binds directional keys (`WASD`) around a virtual center, computing smooth directional vectors | MOBA navigation, FPS character movement |
| **Swipe (Linear Gesture)** | Binds a key to execute a smooth vector swipe between two points with configurable duration | Video feed scrolling (TikTok), unlock gestures |
| **Command (System Key)** | Maps physical keys (e.g. `Esc`) directly to Android `BACK`, `HOME`, or `POWER` | Quick exit, return to desktop |

### 2. Editor Workflow
1. In the direct control sidebar, click the **"Keymapping Editor"** icon.
2. Drag key types (Tap, Joystick, Swipe) from the toolbar onto the device screen.
3. Click a mapped element and press your desired physical key (e.g. `F`).
4. Click **"Save"**. Configurations persist in `localStorage` and can be exported/imported as JSON files.
