<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Vazirmatn&weight=700&size=42&duration=3000&pause=1000&color=6C5CE7&center=true&vCenter=true&width=600&lines=%E2%9C%85+TodoApp;Organize+your+day;Stay+focused+%26+productive" alt="TodoApp" />

<p><b>A modern, fast and beautiful task manager with a Persian (RTL) interface</b></p>

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
</p>

<p>
  <img src="https://img.shields.io/github/license/1887-mehdi/TodoApp?style=flat-square&color=6C5CE7" alt="License">
  <img src="https://img.shields.io/github/last-commit/1887-mehdi/TodoApp?style=flat-square&color=27AE60" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/1887-mehdi/TodoApp?style=flat-square&color=E67E22" alt="Repo Size">
  <img src="https://img.shields.io/github/stars/1887-mehdi/TodoApp?style=flat-square&color=F1C40F" alt="Stars">
</p>

<p>
  <a href="https://1887-mehdi.github.io/TodoApp/"><img src="https://img.shields.io/badge/🚀_Live_Demo-6C5CE7?style=for-the-badge" alt="Live Demo"></a>
  <a href="https://github.com/1887-mehdi/TodoApp/issues"><img src="https://img.shields.io/badge/🐞_Report_Bug-E74C3C?style=for-the-badge" alt="Report Bug"></a>
  <a href="https://github.com/1887-mehdi/TodoApp/issues"><img src="https://img.shields.io/badge/💡_Request_Feature-27AE60?style=for-the-badge" alt="Request Feature"></a>
</p>

</div>

<br>

<div align="center">

<a href="#-preview"><img src="https://img.shields.io/badge/📸_Preview-6C5CE7?style=flat-square" alt="Preview"></a>
<a href="#-features"><img src="https://img.shields.io/badge/✨_Features-6C5CE7?style=flat-square" alt="Features"></a>
<a href="#-tech-stack"><img src="https://img.shields.io/badge/🛠_Tech_Stack-6C5CE7?style=flat-square" alt="Tech Stack"></a>
<a href="#-getting-started"><img src="https://img.shields.io/badge/🚀_Getting_Started-6C5CE7?style=flat-square" alt="Getting Started"></a>
<a href="#-project-structure"><img src="https://img.shields.io/badge/📂_Structure-6C5CE7?style=flat-square" alt="Structure"></a>
<a href="#-architecture"><img src="https://img.shields.io/badge/🧩_Architecture-6C5CE7?style=flat-square" alt="Architecture"></a>
<a href="#-license"><img src="https://img.shields.io/badge/📄_License-6C5CE7?style=flat-square" alt="License"></a>

</div>

## 📸 Preview

<div align="center">
  <img src="Screenshot.png" alt="TodoApp Screenshot" width="850">
  <br><br>
  <i>Dark theme with progress tracking, priorities, and due dates</i>
</div>

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| ➕ | **Quick add** | Add a task in seconds with priority and due date |
| ✏️ | **Full editing** | Edit title, description, priority, and due date in a modal |
| ✔️ | **Mark as done** | Complete tasks and track what's left |
| 🔍 | **Search** | Instantly search through all your tasks |
| 🎯 | **Priorities** | Low, medium, and high priority levels |
| 📅 | **Due dates** | Built-in date picker for deadlines |
| 📊 | **Progress bar** | See your daily progress at a glance |
| 🗂️ | **Filters** | View all, active, or completed tasks |
| 🖱️ | **Drag & drop** | Reorder tasks by dragging |
| 🌗 | **Light / Dark theme** | Switch themes with a single click |
| 💾 | **Auto-save** | Tasks are stored in your browser (localStorage) |
| 🌐 | **RTL support** | Persian (Farsi) interface with Vazirmatn font |
| 📱 | **Responsive** | Works on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Design tokens, layout, and components |
| **JavaScript (ES Modules)** | Vanilla JS, no frameworks |
| **Bootstrap 5 (RTL)** | Layout and edit modal |
| **Bootstrap Icons** | Icons |
| **Vazirmatn** | Persian font (self-hosted) |

</div>

---

## 🚀 Getting Started

No build step or installation needed.

**1. Clone the repository**

```bash
git clone https://github.com/1887-mehdi/TodoApp.git
cd TodoApp
```

**2. Run the project**

Since the project uses ES Modules, open it with a local server (opening `index.html` directly may be blocked by the browser):

```bash
# Option 1: VS Code → install "Live Server" extension → Right click index.html → Open with Live Server

# Option 2: Python
python -m http.server 8000

# Option 3: Node
npx serve
```

Then visit `http://localhost:8000` (or the address your server shows).

---

## 📂 Project Structure

```
TodoApp/
├── index.html
├── Screenshot.png
├── fonts/
│   └── vazirmatn/            # Self-hosted variable font
├── vendor/
│   ├── bootstrap/            # Bootstrap RTL (CSS + JS)
│   └── bootstrap-icons/      # Icon font
├── css/
│   ├── main.css              # Entry point (@import only)
│   ├── base/                 # Fonts, design tokens, reset
│   ├── layout/               # Header, body, footer, responsive
│   └── components/           # Button, form, filters, modal, toast...
└── js/
    ├── main.js               # Composition root
    ├── core/                 # Constants, DOM, storage, state
    ├── components/           # Todo item/list, modal, toast, drag & drop, date picker
    └── utils/                # Helper functions
```

---

## 🧩 Architecture

The project follows a clean, modular structure:

- **Design tokens** in CSS variables make theming (light/dark) simple and consistent.
- **Component-based CSS and JS** keep every piece small, reusable, and easy to maintain.
- **`main.js` as composition root** wires all modules together in one place.
- **Central state + storage layer** separates data logic from the UI.

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m "Add AmazingFeature"`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author

<div align="center">

**Mehdi**

[![GitHub](https://img.shields.io/badge/GitHub-1887--mehdi-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/1887-mehdi)

<br>

⭐ **If you like this project, give it a star!** ⭐

</div>
