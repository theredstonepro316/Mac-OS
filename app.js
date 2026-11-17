document.open();
document.write(`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>macOS Full Interactive Emulator (69 Apps + Games Library + Safari Bundler)</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <script src="https://cdn.jsdelivr.net/npm/lucide@0.469.0/dist/umd/lucide.min.js"></script>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      background: radial-gradient(circle at 20% 20%, #3b82f6 0%, #1e1b4b 45%, #090d16 100%);
      color: #f8fafc;
      height: 100vh;
      width: 100vw;
      transition: background 0.5s ease;
    }
    .glass {
      background: rgba(20, 25, 38, 0.82);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.14);
    }
    .selectable, input, textarea, pre, code, [contenteditable="true"] { user-select: text; }
    .code-font { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .mac-window {
      position: absolute;
      border-radius: 14px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.68), 0 0 0 1px rgba(255,255,255,0.14);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: popIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes popIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .dock-item { transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1); }
    .dock-item:hover { transform: translateY(-8px) scale(1.15); }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
  </style>
</head>
<body id="mac-body" class="flex flex-col justify-between" ondragover="event.preventDefault()" ondrop="handleDesktopDrop(event)">

  <input id="global-html-picker" type="file" accept=".html,.htm,text/html" class="hidden" onchange="loadHtmlFileFromInput(this)" />

  <!-- macOS Top Menu Bar -->
  <header class="h-7 px-3 glass flex items-center justify-between text-xs z-50 border-b border-white/10">
    <div class="flex items-center gap-4">
      <button onclick="openApp('System Information')" class="font-bold text-sm hover:opacity-80 cursor-pointer"></button>
      <span id="active-app-name" class="font-semibold tracking-tight">Finder</span>
      <button onclick="openApp('Applications')" class="text-white/80 hover:text-white cursor-pointer">All 69 Apps</button>
      <button onclick="openApp('Apple Games')" class="text-purple-300 hover:text-white font-medium cursor-pointer">Apple Games</button>
      <button onclick="openApp('Safari')" class="text-white/80 hover:text-white cursor-pointer">Safari Bundler</button>
      <button onclick="triggerOpenHtmlFile()" class="text-sky-300 hover:text-white cursor-pointer">Open .html…</button>
      <button onclick="openApp('Terminal')" class="text-white/80 hover:text-white cursor-pointer">Terminal</button>
    </div>

    <div class="flex items-center gap-3.5 text-white/90">
      <button onclick="toggleSpotlight()" title="Spotlight Search (⌘K)" class="hover:text-white flex items-center gap-1 cursor-pointer">
        <i data-lucide="search" class="w-3.5 h-3.5"></i>
      </button>
      <button onclick="openApp('AirPort Utility')" title="Wi-Fi" class="hover:text-white cursor-pointer">
        <i data-lucide="wifi" class="w-3.5 h-3.5"></i>
      </button>
      <button onclick="openApp('Activity Monitor')" title="Battery & CPU" class="hover:text-white flex items-center gap-1 cursor-pointer">
        <i data-lucide="battery-charging" class="w-3.5 h-3.5 text-emerald-400"></i>
        <span class="text-[11px]">100%</span>
      </button>
      <span id="mac-clock" class="font-medium tabular-nums">Tue Nov 17 10:57 AM</span>
    </div>
  </header>

  <!-- Desktop Area -->
  <main id="desktop" class="relative flex-1 w-full overflow-hidden p-4">

    <!-- Desktop Icons (Right Side) -->
    <div class="absolute right-5 top-5 flex flex-col gap-4 items-center text-center z-0">
      <button onclick="openApp('Apple Games')" class="group flex flex-col items-center w-24 cursor-pointer">
        <div class="w-12 h-12 rounded-xl bg-purple-500/35 border border-purple-400/50 flex items-center justify-center shadow-lg group-hover:bg-purple-500/55 transition">
          <i data-lucide="gamepad-2" class="w-6 h-6 text-purple-200"></i>
        </div>
        <span class="mt-1 text-[11px] font-semibold drop-shadow text-purple-200">Apple Games</span>
      </button>

      <button onclick="openApp('Applications')" class="group flex flex-col items-center w-24 cursor-pointer">
        <div class="w-12 h-12 rounded-xl bg-sky-500/30 border border-sky-400/40 flex items-center justify-center shadow-lg group-hover:bg-sky-500/50 transition">
          <i data-lucide="layout-grid" class="w-6 h-6 text-sky-300"></i>
        </div>
        <span class="mt-1 text-[11px] font-medium drop-shadow">All 69 Apps</span>
      </button>

      <button onclick="openApp('Safari')" class="group flex flex-col items-center w-24 cursor-pointer">
        <div class="w-12 h-12 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center shadow-lg group-hover:bg-blue-500/50 transition">
          <i data-lucide="compass" class="w-6 h-6 text-blue-300"></i>
        </div>
        <span class="mt-1 text-[11px] font-medium drop-shadow">Safari Bundler</span>
      </button>

      <button onclick="triggerOpenHtmlFile()" class="group flex flex-col items-center w-24 cursor-pointer">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center shadow-lg group-hover:bg-emerald-500/50 transition">
          <i data-lucide="file-code-2" class="w-6 h-6 text-emerald-300"></i>
        </div>
        <span class="mt-1 text-[11px] font-medium drop-shadow text-emerald-200">Run HTML File</span>
      </button>

      <button onclick="openApp('GarageBand')" class="group flex flex-col items-center w-24 cursor-pointer">
        <div class="w-12 h-12 rounded-xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center shadow-lg group-hover:bg-amber-500/50 transition">
          <i data-lucide="music" class="w-6 h-6 text-amber-300"></i>
        </div>
        <span class="mt-1 text-[11px] font-medium drop-shadow">GarageBand</span>
      </button>

      <button onclick="openApp('Chess')" class="group flex flex-col items-center w-24 cursor-pointer">
        <div class="w-12 h-12 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shadow-lg group-hover:bg-indigo-500/50 transition">
          <i data-lucide="crown" class="w-6 h-6 text-indigo-300"></i>
        </div>
        <span class="mt-1 text-[11px] font-medium drop-shadow">Chess</span>
      </button>
    </div>

    <!-- Spotlight Search Modal -->
    <div id="spotlight" class="hidden fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/45" onclick="if(event.target===this)toggleSpotlight()">
      <div class="w-full max-w-lg glass rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div class="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <i data-lucide="search" class="w-5 h-5 text-sky-400"></i>
          <input id="spotlight-input" type="text" oninput="filterSpotlight(this.value)" placeholder="Spotlight Search — Launch any of the 69 macOS apps..." class="w-full bg-transparent text-white text-sm outline-none" />
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">ESC</span>
        </div>
        <div id="spotlight-results" class="max-h-72 overflow-y-auto divide-y divide-white/5"></div>
      </div>
    </div>

  </main>

  <!-- macOS Bottom Dock -->
  <footer class="pb-3 flex justify-center z-50 pointer-events-none">
    <div class="pointer-events-auto glass px-3 py-2 rounded-2xl flex items-center gap-2 shadow-2xl overflow-x-auto max-w-[95vw]">
      <button onclick="openApp('Applications')" title="Applications (69)" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="layout-grid" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Apple Games')" title="Apple Games (One-Click Games)" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="gamepad-2" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Safari')" title="Safari (HTML Runner & HTTP Bundler)" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="compass" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Messages')" title="Messages" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="message-circle" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Notes')" title="Notes" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="notebook-pen" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Numbers')" title="Numbers Spreadsheet" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="table" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Freeform')" title="Freeform Canvas" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="pen-tool" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('GarageBand')" title="GarageBand Synth" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="music" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Grapher')" title="Grapher" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="line-chart" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Calculator')" title="Calculator" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-700 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="calculator" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('Terminal')" title="Terminal" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-zinc-700 to-black flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="terminal" class="w-6 h-6 text-white"></i></button>
      <button onclick="openApp('System Settings')" title="System Settings" class="dock-item w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-zinc-500 to-slate-700 flex items-center justify-center shadow-md cursor-pointer"><i data-lucide="settings" class="w-6 h-6 text-white"></i></button>
    </div>
  </footer>

  <script>
    const MAC_APPS = [
      { name: "Activity Monitor", cat: "Utilities", icon: "activity", color: "from-emerald-500 to-teal-700", desc: "View system activity, CPU, memory, and energy usage." },
      { name: "AirPort Utility", cat: "Utilities", icon: "wifi", color: "from-sky-500 to-blue-700", desc: "Manage Wi-Fi networks and base stations." },
      { name: "Apple Games", cat: "Media & Entertainment", icon: "gamepad-2", color: "from-purple-500 to-indigo-700", desc: "Organize and play built-in HTML5 games with one click." },
      { name: "App Store", cat: "System", icon: "shopping-bag", color: "from-blue-500 to-blue-700", desc: "Find, download, and buy Mac apps." },
      { name: "Audio MIDI Setup", cat: "Utilities", icon: "sliders", color: "from-slate-500 to-slate-700", desc: "Configure audio and MIDI devices." },
      { name: "Automator", cat: "Automation & Dev", icon: "bot", color: "from-cyan-500 to-blue-600", desc: "Create workflows to automate repetitive tasks." },
      { name: "Bluetooth File Exchange", cat: "Utilities", icon: "bluetooth", color: "from-blue-500 to-indigo-600", desc: "Send files via wireless Bluetooth connections." },
      { name: "Books", cat: "Media & Entertainment", icon: "book-open", color: "from-orange-400 to-amber-600", desc: "Read and listen to e-books and audiobooks." },
      { name: "Boot Camp Assistant", cat: "Utilities", icon: "hard-drive", color: "from-zinc-500 to-slate-700", desc: "Install Windows on Intel-based Macs." },
      { name: "Calculator", cat: "Productivity", icon: "calculator", color: "from-orange-500 to-amber-700", desc: "Perform basic, scientific, and programmer calculations." },
      { name: "Calendar", cat: "Productivity", icon: "calendar", color: "from-red-500 to-rose-700", desc: "Organize events, meetings, and schedules." },
      { name: "Chess", cat: "Media & Entertainment", icon: "crown", color: "from-amber-600 to-stone-800", desc: "Play chess against the computer or other players." },
      { name: "Clock", cat: "Productivity", icon: "clock", color: "from-slate-700 to-black", desc: "Set alarms, world clocks, stopwatches, and timers." },
      { name: "ColorSync Utility", cat: "Graphics & Media", icon: "palette", color: "from-pink-500 to-violet-600", desc: "Manage color profiles for devices and displays." },
      { name: "Console", cat: "Utilities", icon: "file-warning", color: "from-amber-500 to-yellow-700", desc: "View system log messages and diagnostic data." },
      { name: "Contacts", cat: "Productivity", icon: "contact", color: "from-amber-700 to-stone-800", desc: "Store and manage people and company information." },
      { name: "Dictionary", cat: "Productivity", icon: "book-a", color: "from-red-600 to-rose-800", desc: "Look up definitions, synonyms, and Wikipedia info." },
      { name: "Digital Color Meter", cat: "Graphics & Media", icon: "pipette", color: "from-fuchsia-500 to-purple-700", desc: "Find the exact color value of any pixel on your screen." },
      { name: "Directory Utility", cat: "Utilities", icon: "network", color: "from-blue-600 to-slate-800", desc: "Manage connections to network directory servers." },
      { name: "Disk Utility", cat: "Utilities", icon: "disc", color: "from-slate-500 to-zinc-700", desc: "Format, repair, and manage hard drives and disk images." },
      { name: "DVD Player", cat: "Media & Entertainment", icon: "disc-3", color: "from-indigo-500 to-purple-700", desc: "Play DVD movies on your Mac." },
      { name: "FaceTime", cat: "Communication", icon: "video", color: "from-emerald-400 to-green-600", desc: "Make video and audio calls." },
      { name: "Find My", cat: "Utilities", icon: "radar", color: "from-green-500 to-emerald-700", desc: "Locate people, devices, and items." },
      { name: "Font Book", cat: "Graphics & Media", icon: "type", color: "from-zinc-600 to-stone-800", desc: "Install, preview, and manage system fonts." },
      { name: "Freeform", cat: "Productivity", icon: "pen-tool", color: "from-sky-400 to-blue-600", desc: "Collaborate on a flexible digital canvas." },
      { name: "GarageBand", cat: "Media & Entertainment", icon: "music", color: "from-amber-500 to-red-600", desc: "Create, record, and edit music." },
      { name: "Grapher", cat: "Productivity", icon: "line-chart", color: "from-indigo-500 to-blue-700", desc: "Visualize and analyze 2D and 3D mathematical equations." },
      { name: "Home", cat: "System", icon: "home", color: "from-amber-400 to-orange-500", desc: "Control HomeKit-compatible smart accessories." },
      { name: "Image Capture", cat: "Graphics & Media", icon: "camera", color: "from-cyan-500 to-sky-700", desc: "Transfer images from cameras or scan documents." },
      { name: "Image Playground", cat: "Graphics & Media", icon: "sparkles", color: "from-fuchsia-500 to-indigo-600", desc: "Create custom images with Apple Intelligence." },
      { name: "iMovie", cat: "Media & Entertainment", icon: "film", color: "from-violet-500 to-purple-800", desc: "Edit and create home movies." },
      { name: "iPhone Mirroring", cat: "System", icon: "smartphone", color: "from-slate-600 to-slate-900", desc: "View and control your iPhone directly on your Mac." },
      { name: "Journal", cat: "Productivity", icon: "book-heart", color: "from-indigo-400 to-purple-600", desc: "Capture and write daily thoughts or reflections." },
      { name: "Keynote", cat: "Productivity", icon: "presentation", color: "from-sky-400 to-blue-600", desc: "Create and deliver presentations." },
      { name: "Magnifier", cat: "Utilities", icon: "zoom-in", color: "from-blue-500 to-indigo-700", desc: "Zoom in on text and objects." },
      { name: "Mail", cat: "Communication", icon: "mail", color: "from-sky-400 to-blue-600", desc: "Manage email accounts." },
      { name: "Maps", cat: "Productivity", icon: "map", color: "from-emerald-400 to-teal-600", desc: "Find directions, transit info, and locations." },
      { name: "Messages", cat: "Communication", icon: "message-circle", color: "from-green-400 to-emerald-600", desc: "Send text, photo, and video messages." },
      { name: "Migration Assistant", cat: "Utilities", icon: "arrow-left-right", color: "from-blue-500 to-cyan-700", desc: "Transfer data from another Mac or a PC." },
      { name: "Music", cat: "Media & Entertainment", icon: "disc-2", color: "from-rose-500 to-pink-700", desc: "Play and organize your music library." },
      { name: "News", cat: "Media & Entertainment", icon: "newspaper", color: "from-rose-500 to-red-700", desc: "Read curated news stories and magazines." },
      { name: "Notes", cat: "Productivity", icon: "notebook-pen", color: "from-amber-400 to-yellow-600", desc: "Jot down quick thoughts, checklists, and sketches." },
      { name: "Numbers", cat: "Productivity", icon: "table", color: "from-green-500 to-emerald-700", desc: "Build spreadsheets and data charts." },
      { name: "Pages", cat: "Productivity", icon: "file-text", color: "from-orange-400 to-amber-600", desc: "Write and design word-processing documents." },
      { name: "Passwords", cat: "System", icon: "key-round", color: "from-slate-600 to-zinc-800", desc: "Store and manage saved passwords, passkeys, and verification codes." },
      { name: "Phone", cat: "Communication", icon: "phone", color: "from-emerald-500 to-green-700", desc: "Make and receive phone calls via your connected iPhone." },
      { name: "Photo Booth", cat: "Graphics & Media", icon: "aperture", color: "from-red-500 to-pink-600", desc: "Take fun photos and video clips with camera effects." },
      { name: "Photos", cat: "Graphics & Media", icon: "image", color: "from-pink-400 to-amber-500", desc: "Organize, edit, and share your photo and video collection." },
      { name: "Podcasts", cat: "Media & Entertainment", icon: "podcast", color: "from-purple-500 to-violet-800", desc: "Discover and listen to audio stories and shows." },
      { name: "Preview", cat: "Graphics & Media", icon: "eye", color: "from-sky-500 to-blue-700", desc: "View and annotate PDF files and images." },
      { name: "Print Center", cat: "Utilities", icon: "printer", color: "from-slate-500 to-slate-700", desc: "Monitor and manage active print jobs." },
      { name: "QuickTime Player", cat: "Media & Entertainment", icon: "play-circle", color: "from-sky-500 to-indigo-600", desc: "Play and edit video and audio files." },
      { name: "Reminders", cat: "Productivity", icon: "list-checks", color: "from-blue-500 to-indigo-600", desc: "Create to-do lists and task trackers." },
      { name: "Safari", cat: "Internet & Web", icon: "compass", color: "from-blue-400 to-cyan-600", desc: "Browse the web, run local HTML files, and bundle HTML/CSS/JS." },
      { name: "Screen Sharing", cat: "Utilities", icon: "monitor", color: "from-indigo-500 to-slate-700", desc: "View and control another Mac over a network." },
      { name: "Screenshot", cat: "Utilities", icon: "crop", color: "from-slate-500 to-zinc-700", desc: "Capture screenshots or screen recordings." },
      { name: "Script Editor", cat: "Automation & Dev", icon: "file-code", color: "from-amber-500 to-orange-700", desc: "Write and run AppleScript or JavaScript automation code." },
      { name: "Shortcuts", cat: "Automation & Dev", icon: "layers", color: "from-pink-500 to-indigo-600", desc: "Create automated multi-step workflows." },
      { name: "Stickies", cat: "Productivity", icon: "sticky-note", color: "from-yellow-300 to-amber-500", desc: "Keep quick sticky notes on your desktop." },
      { name: "Stocks", cat: "Productivity", icon: "trending-up", color: "from-slate-700 to-blue-900", desc: "Track market news, stocks, and watchlists." },
      { name: "System Information", cat: "System", icon: "cpu", color: "from-slate-600 to-slate-800", desc: "View detailed hardware, network, and software specs." },
      { name: "System Settings", cat: "System", icon: "settings", color: "from-zinc-500 to-slate-700", desc: "Customize your Mac preferences." },
      { name: "Terminal", cat: "Automation & Dev", icon: "terminal", color: "from-zinc-800 to-black", desc: "Access the UNIX command-line shell." },
      { name: "TextEdit", cat: "Productivity", icon: "align-left", color: "from-slate-400 to-slate-600", desc: "Create and edit plain or rich text documents." },
      { name: "Tips", cat: "System", icon: "lightbulb", color: "from-amber-400 to-yellow-600", desc: "Learn helpful guides and shortcuts for your Mac." },
      { name: "TV", cat: "Media & Entertainment", icon: "tv", color: "from-zinc-800 to-black", desc: "Watch movies, TV shows, and Apple TV+ content." },
      { name: "Voice Memos", cat: "Media & Entertainment", icon: "mic", color: "from-rose-500 to-red-700", desc: "Record and share audio clips." },
      { name: "VoiceOver Utility", cat: "System", icon: "volume-2", color: "from-blue-600 to-indigo-800", desc: "Configure the built-in screen reader." },
      { name: "Weather", cat: "Productivity", icon: "cloud-sun", color: "from-sky-400 to-blue-600", desc: "Check local and global weather forecasts." }
    ];

    // =========================================================================
    // GAMES_LIBRARY: Add any HTML game here to get a one-click button in Apple Games!
    // (Remember to write closing script tags inside backticks as <\/script>)
    // =========================================================================
    const GAMES_LIBRARY = [
      {
        id: "reflex",
        title: "Reflex Star",
        color: "from-pink-500 to-amber-500",
        html: `<!DOCTYPE html>
<html>
<head><style>
  body { margin:0; background:#0f172a; color:#fff; font-family:-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  #star { position:absolute; width:50px; height:50px; border-radius:50%; border:none; background:linear-gradient(135deg,#ec4899,#f59e0b); color:#fff; font-size:22px; cursor:pointer; box-shadow:0 0 22px rgba(245,158,11,0.7); transition:transform 0.08s; }
  #star:active { transform:scale(0.9); }
</style></head>
<body>
  <h3 style="position:fixed;top:12px;margin:0;color:#fbbf24;">Score: <span id="s">0</span></h3>
  <button id="star" onclick="hit()">★</button>
  <script>
    let score = 0;
    function hit() {
      score++;
      document.getElementById('s').textContent = score;
      const b = document.getElementById('star');
      b.style.left = (10 + Math.random() * 75) + '%';
      b.style.top = (20 + Math.random() * 65) + '%';
    }
  <\/script>
</body>
</html>`
      },
      {
        id: "snake",
        title: "Neon Snake",
        color: "from-emerald-500 to-teal-700",
        html: `<!DOCTYPE html>
<html>
<head><style>
  body { margin:0; background:#090d16; color:#34d399; font-family:monospace; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; }
  canvas { border:2px solid #34d399; border-radius:10px; background:#020617; }
</style></head>
<body>
  <div style="margin-bottom:8px;font-size:13px;">Score: <strong id="sc">0</strong> • Click game & use Arrow Keys</div>
  <canvas id="c" width="300" height="270"></canvas>
  <script>
    const ctx = document.getElementById('c').getContext('2d');
    let snake = [{x:150,y:135}], dx = 15, dy = 0, food = {x:90,y:90}, sc = 0;
    window.addEventListener('keydown', e => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key==='ArrowUp' && dy===0) { dx=0; dy=-15; }
      if (e.key==='ArrowDown' && dy===0) { dx=0; dy=15; }
      if (e.key==='ArrowLeft' && dx===0) { dx=-15; dy=0; }
      if (e.key==='ArrowRight' && dx===0) { dx=15; dy=0; }
    });
    setInterval(() => {
      const head = {x:(snake[0].x+dx+300)%300, y:(snake[0].y+dy+270)%270};
      snake.unshift(head);
      if (head.x===food.x && head.y===food.y) {
        sc++; document.getElementById('sc').textContent = sc;
        food = {x:Math.floor(Math.random()*20)*15, y:Math.floor(Math.random()*18)*15};
      } else snake.pop();
      ctx.clearRect(0,0,300,270);
      ctx.fillStyle='#f43f5e'; ctx.fillRect(food.x,food.y,14,14);
      ctx.fillStyle='#34d399'; snake.forEach(p=>ctx.fillRect(p.x,p.y,14,14));
    }, 110);
  <\/script>
</body>
</html>`
      },
      {
        id: "pong",
        title: "Cyber Pong",
        color: "from-sky-500 to-indigo-700",
        html: `<!DOCTYPE html>
<html>
<head><style>
  body { margin:0; background:#0f172a; color:#38bdf8; font-family:-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; }
  canvas { border:2px solid #38bdf8; border-radius:10px; background:#020617; cursor:none; }
</style></head>
<body>
  <div style="margin-bottom:8px;font-size:13px;">Hits: <strong id="hits">0</strong> • Move mouse to control paddle</div>
  <canvas id="p" width="360" height="240"></canvas>
  <script>
    const c = document.getElementById('p'), ctx = c.getContext('2d');
    let px = 140, bx = 180, by = 80, vx = 3.2, vy = 3.2, hits = 0;
    c.onmousemove = e => { const r = c.getBoundingClientRect(); px = Math.max(0, Math.min(280, e.clientX - r.left - 40)); };
    setInterval(() => {
      bx += vx; by += vy;
      if (bx < 7 || bx > 353) vx = -vx;
      if (by < 7) vy = -vy;
      if (by > 216 && bx > px && bx < px + 80) { vy = -Math.abs(vy); hits++; document.getElementById('hits').textContent = hits; }
      if (by > 240) { bx = 180; by = 60; hits = 0; document.getElementById('hits').textContent = 0; }
      ctx.clearRect(0,0,360,240);
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(px, 224, 80, 10);
      ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI*2); ctx.fill();
    }, 16);
  <\/script>
</body>
</html>`
      },
      {
        id: "flappy",
        title: "Sky Hopper",
        color: "from-amber-500 to-orange-700",
        html: `<!DOCTYPE html>
<html>
<head><style>
  body { margin:0; background:#0c4a6e; color:#fff; font-family:-apple-system,sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; }
  canvas { border:2px solid #7dd3fc; border-radius:10px; background:linear-gradient(#0284c7,#0369a1); cursor:pointer; }
</style></head>
<body>
  <div style="margin-bottom:8px;font-size:13px;">Score: <strong id="sc">0</strong> • Click canvas or press Space to jump</div>
  <canvas id="f" width="340" height="240"></canvas>
  <script>
    const c = document.getElementById('f'), ctx = c.getContext('2d');
    let y = 110, vy = 0, pipeX = 340, gapY = 70, sc = 0;
    function flap() { vy = -5.5; }
    c.onmousedown = flap;
    window.onkeydown = e => { if (e.code === 'Space') { e.preventDefault(); flap(); } };
    setInterval(() => {
      vy += 0.32; y += vy; pipeX -= 2.6;
      if (pipeX < -30) { pipeX = 340; gapY = 30 + Math.random() * 110; sc++; document.getElementById('sc').textContent = sc; }
      if (y < 0 || y > 224 || (pipeX < 74 && pipeX + 30 > 50 && (y < gapY || y + 16 > gapY + 75))) {
        y = 110; vy = 0; pipeX = 340; sc = 0; document.getElementById('sc').textContent = 0;
      }
      ctx.clearRect(0,0,340,240);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(pipeX, 0, 30, gapY);
      ctx.fillRect(pipeX, gapY + 75, 30, 240);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(50, y, 20, 16);
    }, 18);
  <\/script>
</body>
</html>`
      }
    ];

    let zCounter = 10;
    let openWindows = {};
    let sysLogs = [
      "[10:57:01] kernel: Darwin Kernel Version 25.0.0 booted successfully.",
      "[10:57:02] WindowServer: Metal GPU compositor active.",
      "[10:57:03] AppleGames: Games library initialized."
    ];
    let bundledOutputCache = "";
    let audioCtx = null;

    function playTone(freq = 440, duration = 0.25, type = "sine") {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch {}
    }

    function logSystem(msg) {
      const t = new Date().toTimeString().split(" ")[0];
      sysLogs.push(`[${t}] ${msg}`);
    }

    window.addEventListener("DOMContentLoaded", () => {
      updateClock();
      setInterval(updateClock, 15000);
      openApp("Apple Games");
      if (window.lucide) lucide.createIcons();
    });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleSpotlight();
      } else if (e.key === "Escape") {
        document.getElementById("spotlight").classList.add("hidden");
      }
    });

    function updateClock() {
      const now = new Date();
      document.getElementById("mac-clock").textContent =
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + " " +
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }

    // Global HTML File Picker & Desktop Drag-and-Drop
    function triggerOpenHtmlFile() {
      document.getElementById("global-html-picker").click();
    }

    function loadHtmlFileFromInput(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => runHtmlInsideSafari(e.target.result, file.name);
      reader.readAsText(file);
      input.value = "";
    }

    function handleDesktopDrop(e) {
      e.preventDefault();
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => runHtmlInsideSafari(ev.target.result, file.name);
      reader.readAsText(file);
    }

    function runHtmlInsideSafari(htmlContent, fileName = "local-page.html") {
      openApp("Safari");
      bundledOutputCache = htmlContent;
      const frame = document.getElementById("safari-frame");
      const srcBox = document.getElementById("safari-source");
      const urlInput = document.getElementById("safari-url");
      const stats = document.getElementById("safari-stats");
      if (urlInput) urlInput.value = `file:///Users/mac/Desktop/${fileName}`;
      if (frame) frame.srcdoc = htmlContent;
      if (srcBox) srcBox.value = htmlContent;
      if (stats) stats.textContent = `Running ${fileName} (${htmlContent.length.toLocaleString()} chars)`;
      logSystem(`Safari: Executed local file ${fileName}`);
    }

    function toggleSpotlight() {
      const modal = document.getElementById("spotlight");
      modal.classList.toggle("hidden");
      if (!modal.classList.contains("hidden")) {
        const input = document.getElementById("spotlight-input");
        input.value = "";
        filterSpotlight("");
        setTimeout(() => input.focus(), 30);
      }
    }

    function filterSpotlight(query) {
      const q = query.trim().toLowerCase();
      const matches = MAC_APPS.filter(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q));
      const box = document.getElementById("spotlight-results");
      box.innerHTML = matches.map(app => `
        <button onclick="openApp('${app.name}'); toggleSpotlight();" class="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/10 text-left cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center"><i data-lucide="${app.icon}" class="w-4 h-4 text-white"></i></div>
            <div><div class="text-xs font-semibold text-white">${app.name}</div><div class="text-[11px] text-white/60 truncate max-w-xs">${app.desc}</div></div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">${app.cat}</span>
        </button>
      `).join("");
      if (window.lucide) lucide.createIcons();
    }

    function focusWindow(appName) {
      const win = openWindows[appName];
      if (!win) return;
      zCounter++;
      win.style.zIndex = zCounter;
      document.getElementById("active-app-name").textContent = appName;
    }

    function closeWindow(appName) {
      const win = openWindows[appName];
      if (win) {
        win.remove();
        delete openWindows[appName];
        document.getElementById("active-app-name").textContent = "Finder";
      }
    }

    function openApp(appName) {
      if (openWindows[appName]) { focusWindow(appName); return; }
      logSystem(`LaunchServices: Launched ${appName}.app`);

      const desktop = document.getElementById("desktop");
      const win = document.createElement("div");
      zCounter++;

      const largeApps = ["Applications", "Apple Games", "Safari", "Numbers", "Pages", "Keynote", "Freeform", "Grapher", "Chess", "GarageBand", "Terminal", "Script Editor"];
      const isLarge = largeApps.includes(appName);
      const width = isLarge ? 740 : 480;
      const height = isLarge ? 490 : 370;
      const offset = (Object.keys(openWindows).length * 26) % 150;

      win.className = "mac-window glass";
      win.style.width = Math.min(width, window.innerWidth - 36) + "px";
      win.style.height = Math.min(height, window.innerHeight - 105) + "px";
      win.style.left = (36 + offset) + "px";
      win.style.top = (22 + offset) + "px";
      win.style.zIndex = zCounter;
      win.onmousedown = () => focusWindow(appName);

      win.innerHTML = `
        <div class="window-header h-9 px-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between cursor-move shrink-0">
          <div class="flex items-center gap-2">
            <button onclick="closeWindow('${appName}')" class="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-400 cursor-pointer" title="Close"></button>
            <span class="w-3 h-3 rounded-full bg-amber-400"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          </div>
          <span class="text-xs font-semibold text-white/90">${appName}</span>
          <div class="w-10"></div>
        </div>
        <div class="flex-1 overflow-auto p-4 text-xs selectable">
          ${renderAppBody(appName)}
        </div>
      `;

      makeDraggable(win, win.querySelector(".window-header"));
      desktop.appendChild(win);
      openWindows[appName] = win;
      document.getElementById("active-app-name").textContent = appName;
      if (window.lucide) lucide.createIcons();
      initAppBehavior(appName);
    }

    function makeDraggable(el, handle) {
      let startX = 0, startY = 0, origX = 0, origY = 0;
      handle.onmousedown = (e) => {
        if (e.target.tagName === "BUTTON") return;
        e.preventDefault();
        startX = e.clientX; startY = e.clientY;
        origX = el.offsetLeft; origY = el.offsetTop;
        document.onmousemove = (ev) => {
          el.style.left = Math.max(0, origX + (ev.clientX - startX)) + "px";
          el.style.top = Math.max(0, origY + (ev.clientY - startY)) + "px";
        };
        document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
      };
    }

    function renderAppBody(appName) {
      switch (appName) {
        case "Applications":
          return `
            <div class="space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div>
                  <h2 class="text-sm font-bold">macOS Applications (${MAC_APPS.length} Interactive Apps)</h2>
                  <p class="text-[11px] text-white/60">Click any icon to launch, or press <kbd class="px-1.5 py-0.5 rounded bg-white/10">⌘K</kbd> to search.</p>
                </div>
                <input type="text" oninput="filterAppGrid(this.value)" placeholder="Filter 69 apps..." class="bg-black/30 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-sky-400" />
              </div>
              <div id="apps-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                ${MAC_APPS.map(app => `
                  <button data-app-card="${app.name.toLowerCase()} ${app.cat.toLowerCase()}" onclick="openApp('${app.name}')" class="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center text-center transition cursor-pointer">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow mb-1">
                      <i data-lucide="${app.icon}" class="w-4 h-4 text-white"></i>
                    </div>
                    <span class="font-semibold text-[10px] text-white leading-tight">${app.name}</span>
                  </button>
                `).join("")}
              </div>
            </div>`;

        case "Apple Games":
          return `
            <div class="flex flex-col h-full space-y-2.5">
              <div class="flex flex-wrap items-center justify-between gap-2 bg-purple-500/15 border border-purple-400/30 p-2.5 rounded-xl">
                <div class="flex flex-wrap items-center gap-1.5">
                  ${GAMES_LIBRARY.map(g => `
                    <button onclick="launchBuiltInGame('${g.id}')" class="px-3 py-1.5 rounded-lg bg-gradient-to-r ${g.color} text-white font-semibold text-xs shadow hover:opacity-90 active:scale-95 transition cursor-pointer">
                      ▶ ${g.title}
                    </button>
                  `).join("")}
                </div>
                <span id="active-game-title" class="text-[11px] text-purple-200 font-medium">Playing: ${GAMES_LIBRARY[0].title}</span>
              </div>

              <iframe id="game-runner-frame" sandbox="allow-scripts allow-same-origin allow-pointer-lock" class="flex-1 w-full min-h-[310px] bg-slate-950 rounded-xl border border-white/15"></iframe>
            </div>`;

        case "Safari":
          return `
            <div class="flex flex-col h-full space-y-2.5">
              <div class="flex flex-wrap items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/10">
                <button onclick="triggerOpenHtmlFile()" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 font-semibold text-[11px] cursor-pointer">
                  Open .html
                </button>
                <select onchange="document.getElementById('safari-url').value=this.value" class="bg-slate-800 border border-white/15 rounded-lg px-2 py-1.5 text-[11px] text-sky-300 outline-none">
                  <option value="https://en.wikipedia.org/w/api.php?action=parse&page=MacOS&format=json&origin=*">Wikipedia: macOS (Live + CSS)</option>
                  <option value="https://httpbin.org/html">httpbin.org/html (Live)</option>
                  <option value="https://example.com/index.html">example.com (HTML+CSS+JS Sim)</option>
                </select>
                <input id="safari-url" type="text" value="https://en.wikipedia.org/w/api.php?action=parse&page=MacOS&format=json&origin=*" class="flex-1 min-w-[150px] bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs code-font text-emerald-300 outline-none" />
                <button onclick="runSafariBundler()" class="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold cursor-pointer">Fetch & Bundle</button>
              </div>
              <div class="flex items-center justify-between text-[11px] text-white/70">
                <div class="flex items-center gap-1.5">
                  <button onclick="document.getElementById('safari-frame').classList.remove('hidden');document.getElementById('safari-source').classList.add('hidden')" class="px-2.5 py-1 rounded bg-white/15 text-white cursor-pointer">Rendered Page</button>
                  <button onclick="document.getElementById('safari-frame').classList.add('hidden');document.getElementById('safari-source').classList.remove('hidden')" class="px-2.5 py-1 rounded hover:bg-white/10 cursor-pointer">Edit / View HTML+CSS+JS</button>
                  <button onclick="applyEditedSafariSource()" class="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 cursor-pointer">▶ Run Source</button>
                </div>
                <div class="flex items-center gap-2">
                  <span id="safari-stats" class="code-font text-emerald-300">Ready</span>
                  <button onclick="downloadBundledFromSafari()" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer">Save .html</button>
                </div>
              </div>
              <iframe id="safari-frame" sandbox="allow-scripts allow-same-origin" class="flex-1 w-full bg-white rounded-xl border border-white/15 min-h-[280px]" srcdoc="<div style='font-family:sans-serif;padding:2rem;color:#1e293b;'><h2>Safari HTML Runner & HTTP Bundler</h2><p>Click <b>Open .html</b> to run a local HTML file, drag & drop any .html file onto the desktop, or click <b>Fetch & Bundle</b> to bundle a live page.</p></div>"></iframe>
              <textarea id="safari-source" class="hidden flex-1 w-full bg-slate-950 text-emerald-300 code-font p-3 rounded-xl border border-white/15 min-h-[280px] outline-none" placeholder="Write or edit HTML + CSS + JS here and click 'Run Source'..."></textarea>
            </div>`;

        case "Calculator":
          return `
            <div class="flex flex-col h-full">
              <div class="flex gap-1 mb-2 text-[10px]">
                <button onclick="document.getElementById('calc-sci').classList.add('hidden')" class="px-2 py-0.5 rounded bg-white/15 cursor-pointer">Basic</button>
                <button onclick="document.getElementById('calc-sci').classList.remove('hidden')" class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer">Scientific & Programmer</button>
              </div>
              <input id="calc-display" readonly value="0" class="w-full bg-black/40 text-right text-2xl font-light code-font p-3 rounded-xl border border-white/10 mb-2" />
              <div id="calc-sci" class="hidden grid grid-cols-4 gap-1 mb-1.5 text-[11px]">
                <button onclick="calcFn('sin')" class="py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 cursor-pointer">sin</button>
                <button onclick="calcFn('cos')" class="py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 cursor-pointer">cos</button>
                <button onclick="calcFn('sqrt')" class="py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 cursor-pointer">√x</button>
                <button onclick="calcFn('hex')" class="py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 cursor-pointer">HEX</button>
              </div>
              <div class="grid grid-cols-4 gap-1.5 flex-1">
                ${["7","8","9","/","4","5","6","*","1","2","3","-","C","0","=","+"].map(k => `<button onclick="calcPress('${k}')" class="rounded-lg bg-white/10 hover:bg-white/20 font-bold text-sm cursor-pointer">${k}</button>`).join("")}
              </div>
            </div>`;

        case "Numbers":
          return `
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="font-bold text-emerald-300">Budget & Data Sheet (Supports =B1+B2 formulas)</span>
                <button onclick="recalcNumbers()" class="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold cursor-pointer">Recalculate</button>
              </div>
              <table class="w-full border-collapse text-xs code-font">
                <thead><tr class="bg-white/10"><th class="p-1.5 border border-white/15">Row</th><th class="p-1.5 border border-white/15">A (Item)</th><th class="p-1.5 border border-white/15">B (Value)</th><th class="p-1.5 border border-white/15">C (Result)</th></tr></thead>
                <tbody>
                  <tr><td class="p-1.5 border border-white/15 text-center">1</td><td class="p-1 border border-white/15"><input id="num-A1" value="Server Hosting" class="w-full bg-transparent outline-none"/></td><td class="p-1 border border-white/15"><input id="num-B1" value="25" oninput="recalcNumbers()" class="w-full bg-transparent outline-none"/></td><td id="num-C1" class="p-1.5 border border-white/15 text-emerald-300">25</td></tr>
                  <tr><td class="p-1.5 border border-white/15 text-center">2</td><td class="p-1 border border-white/15"><input id="num-A2" value="Domain Name" class="w-full bg-transparent outline-none"/></td><td class="p-1 border border-white/15"><input id="num-B2" value="12" oninput="recalcNumbers()" class="w-full bg-transparent outline-none"/></td><td id="num-C2" class="p-1.5 border border-white/15 text-emerald-300">12</td></tr>
                  <tr><td class="p-1.5 border border-white/15 text-center">3</td><td class="p-1 border border-white/15"><input id="num-A3" value="Total Sum" class="w-full bg-transparent font-bold outline-none"/></td><td class="p-1 border border-white/15"><input id="num-B3" value="=B1+B2" oninput="recalcNumbers()" class="w-full bg-transparent text-sky-300 outline-none"/></td><td id="num-C3" class="p-1.5 border border-white/15 font-bold text-amber-300">37</td></tr>
                </tbody>
              </table>
            </div>`;

        case "Pages":
        case "Notes":
        case "TextEdit":
        case "Journal":
        case "Stickies":
          return `
            <div class="flex flex-col h-full space-y-2">
              <div class="flex items-center gap-1.5 pb-1.5 border-b border-white/10">
                <button onclick="document.execCommand('bold')" class="px-2 py-0.5 rounded bg-white/10 font-bold cursor-pointer">B</button>
                <button onclick="document.execCommand('italic')" class="px-2 py-0.5 rounded bg-white/10 italic cursor-pointer">I</button>
                <button onclick="document.execCommand('underline')" class="px-2 py-0.5 rounded bg-white/10 underline cursor-pointer">U</button>
                <span class="text-[11px] text-white/50 ml-auto">${appName} Rich Document</span>
              </div>
              <div contenteditable="true" class="flex-1 bg-black/25 border border-white/10 rounded-xl p-3 outline-none overflow-auto leading-relaxed">
                <h3 class="text-sm font-bold mb-1">Welcome to ${appName}</h3>
                <p>Click anywhere here to type, format text, or paste notes.</p>
              </div>
            </div>`;

        case "Keynote":
          return `
            <div class="flex flex-col h-full space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sky-300">Presentation Deck (3 Slides)</span>
                <div class="flex gap-1.5">
                  <button onclick="changeSlide(-1)" class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer">◀ Prev</button>
                  <button onclick="changeSlide(1)" class="px-2.5 py-1 rounded bg-sky-500 text-white font-semibold cursor-pointer">Next ▶</button>
                </div>
              </div>
              <div id="keynote-stage" contenteditable="true" class="flex-1 rounded-xl bg-gradient-to-br from-slate-800 to-indigo-950 border border-white/15 p-6 flex flex-col items-center justify-center text-center outline-none">
                <h2 class="text-xl font-bold">Slide 1: How HTTP & Proxies Work</h2>
                <p class="text-white/75 mt-2">Click to edit slide text directly or press Next ▶</p>
              </div>
            </div>`;

        case "Freeform":
          return `
            <div class="flex flex-col h-full space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-white/70">Pen Color:</span>
                ${["#38bdf8","#f43f5e","#34d399","#fbbf24","#ffffff"].map(c => `<button onclick="window._ffColor='${c}'" style="background:${c}" class="w-5 h-5 rounded-full border border-white/40 cursor-pointer"></button>`).join("")}
                <button onclick="clearFreeform()" class="ml-auto px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer">Clear Board</button>
              </div>
              <canvas id="freeform-canvas" width="680" height="360" class="flex-1 w-full bg-slate-950 rounded-xl border border-white/15 cursor-crosshair"></canvas>
            </div>`;

        case "Grapher":
          return `
            <div class="flex flex-col h-full space-y-2">
              <div class="flex items-center gap-2">
                <span class="code-font text-sky-300">y =</span>
                <input id="grapher-fn" value="Math.sin(x) * 3" class="flex-1 bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 code-font text-emerald-300 outline-none" />
                <button onclick="plotGrapher()" class="px-3 py-1 rounded-lg bg-indigo-500 text-white font-semibold cursor-pointer">Plot Equation</button>
              </div>
              <canvas id="grapher-canvas" width="680" height="340" class="flex-1 w-full bg-slate-950 rounded-xl border border-white/15"></canvas>
            </div>`;

        case "GarageBand":
          return `
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-amber-300">Polyphonic Web Audio Synthesizer</span>
                <span class="text-[11px] text-white/60">Click keys below to play live audio</span>
              </div>
              <div class="grid grid-cols-8 gap-1.5 h-36">
                ${[
                  {n:"C4",f:261.63},{n:"D4",f:293.66},{n:"E4",f:329.63},{n:"F4",f:349.23},
                  {n:"G4",f:392.00},{n:"A4",f:440.00},{n:"B4",f:493.88},{n:"C5",f:523.25}
                ].map(k => `<button onmousedown="playTone(${k.f},0.45,'triangle')" class="rounded-b-xl bg-white text-slate-900 hover:bg-amber-100 active:bg-amber-300 font-bold flex flex-col justify-end items-center pb-3 shadow cursor-pointer">${k.n}</button>`).join("")}
              </div>
              <div class="grid grid-cols-4 gap-2">
                <button onmousedown="playTone(90,0.2,'sine')" class="py-2.5 rounded-xl bg-rose-500/30 border border-rose-400/40 font-bold cursor-pointer">Kick</button>
                <button onmousedown="playTone(210,0.15,'square')" class="py-2.5 rounded-xl bg-sky-500/30 border border-sky-400/40 font-bold cursor-pointer">Snare</button>
                <button onmousedown="playTone(880,0.08,'sawtooth')" class="py-2.5 rounded-xl bg-amber-500/30 border border-amber-400/40 font-bold cursor-pointer">Hi-Hat</button>
                <button onmousedown="playTone(330,0.5,'sine')" class="py-2.5 rounded-xl bg-emerald-500/30 border border-emerald-400/40 font-bold cursor-pointer">Bass</button>
              </div>
            </div>`;

        case "Chess":
          return `
            <div class="flex flex-col items-center space-y-2">
              <div class="flex justify-between w-full max-w-[360px] items-center">
                <span class="font-semibold text-amber-300">Click any piece, then click a target square</span>
                <button onclick="initChess()" class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer">Reset</button>
              </div>
              <div id="chess-board" class="grid grid-cols-8 w-[340px] h-[340px] border-2 border-amber-500/50 rounded-lg overflow-hidden"></div>
            </div>`;

        case "Terminal":
          return `
            <div class="flex flex-col h-full bg-black/80 rounded-xl p-3 code-font text-emerald-400">
              <div id="term-out" class="flex-1 overflow-y-auto space-y-1 whitespace-pre-wrap text-[11px]">macOS Darwin Kernel — Type 'help', 'ls', 'date', 'neofetch', or 'open Apple Games'</div>
              <div class="flex items-center gap-1.5 pt-2 border-t border-white/10">
                <span class="text-sky-400">user@macbook ~ %</span>
                <input id="term-in" onkeydown="if(event.key==='Enter')runTermCmd(this)" class="flex-1 bg-transparent text-white outline-none" autofocus />
              </div>
            </div>`;

        case "Script Editor":
          return `
            <div class="flex flex-col h-full space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-amber-300 font-semibold">JavaScript for Automation (JXA)</span>
                <button onclick="runScriptEditor()" class="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold cursor-pointer">▶ Run Script</button>
              </div>
              <textarea id="script-code" class="flex-1 bg-black/50 border border-white/15 rounded-xl p-2.5 code-font text-sky-300 outline-none">const apps = 69;\nreturn "macOS Emulator active with " + apps + " working apps at " + new Date().toLocaleTimeString();</textarea>
              <pre id="script-out" class="h-16 bg-black/70 border border-white/10 rounded-xl p-2 code-font text-emerald-300 overflow-auto">Result will appear here...</pre>
            </div>`;

        case "Automator":
        case "Shortcuts":
          return `
            <div class="space-y-2.5">
              <div class="p-3 rounded-xl bg-sky-500/15 border border-sky-400/30">
                <div class="font-bold text-sky-300">${appName} Workflow: Fetch & Bundle Live Web Page</div>
                <p class="text-[11px] text-white/75 mt-1">Executes a multi-step workflow that downloads HTML, inlines CSS/JS, and opens the bundle in Safari.</p>
              </div>
              <div class="p-2.5 rounded-lg bg-white/5 border border-white/10">Step 1: <strong>Get Contents of URL</strong> (Wikipedia API)</div>
              <div class="p-2.5 rounded-lg bg-white/5 border border-white/10">Step 2: <strong>Inline External Stylesheets & Scripts</strong></div>
              <button onclick="openApp('Safari'); runSafariBundler();" class="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold cursor-pointer">▶ Run Workflow Now</button>
            </div>`;

        case "Digital Color Meter":
        case "ColorSync Utility":
          return `
            <div class="space-y-3">
              <p class="text-white/75">Pick any color swatch below to inspect its exact sRGB, HEX, and RGB values:</p>
              <input type="color" value="#38bdf8" oninput="updateColorMeter(this.value)" class="w-full h-16 rounded-xl cursor-pointer bg-transparent" />
              <div id="color-readout" class="p-3 rounded-xl bg-black/40 border border-white/10 code-font text-xs space-y-1">
                <div>HEX: <span class="text-sky-300">#38BDF8</span></div>
                <div>RGB: <span class="text-emerald-300">rgb(56, 189, 248)</span></div>
                <div>Profile: <span class="text-amber-300">Display P3 / sRGB IEC61966-2.1</span></div>
              </div>
            </div>`;

        case "Passwords":
          return `
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="font-bold">iCloud Keychain & Passwords</span>
                <button onclick="genMacPassword()" class="px-2.5 py-1 rounded bg-sky-500 text-white font-semibold cursor-pointer">Generate Strong Password</button>
              </div>
              <input id="gen-pass-box" readonly value="xK9#mP2$vL8@qR4!" class="w-full bg-black/40 border border-white/15 rounded-lg p-2.5 code-font text-emerald-300 text-center text-sm" />
              <div class="divide-y divide-white/10 bg-white/5 rounded-xl border border-white/10">
                <div class="p-2.5 flex justify-between"><span>github.com</span><span class="code-font text-white/60">••••••••••••</span></div>
                <div class="p-2.5 flex justify-between"><span>apple.com</span><span class="code-font text-white/60">Passkey Active</span></div>
              </div>
            </div>`;

        case "Clock":
          return `
            <div class="space-y-3 text-center">
              <div class="grid grid-cols-3 gap-2">
                <div class="p-2.5 rounded-xl bg-white/5 border border-white/10"><div class="text-white/60">New York</div><div class="font-bold text-sm mt-0.5">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div></div>
                <div class="p-2.5 rounded-xl bg-white/5 border border-white/10"><div class="text-white/60">London</div><div class="font-bold text-sm mt-0.5">${new Date().toLocaleTimeString('en-GB', {timeZone:'Europe/London',hour:'2-digit',minute:'2-digit'})}</div></div>
                <div class="p-2.5 rounded-xl bg-white/5 border border-white/10"><div class="text-white/60">Tokyo</div><div class="font-bold text-sm mt-0.5">${new Date().toLocaleTimeString('ja-JP', {timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit'})}</div></div>
              </div>
              <div class="p-3 rounded-xl bg-black/30 border border-white/10">
                <div class="text-white/60 mb-1">Stopwatch</div>
                <div id="sw-display" class="text-2xl code-font font-bold text-amber-300">0.0s</div>
                <div class="flex justify-center gap-2 mt-2">
                  <button onclick="startStopwatch()" class="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold cursor-pointer">Start</button>
                  <button onclick="stopStopwatch()" class="px-3 py-1 rounded bg-rose-500 text-white font-bold cursor-pointer">Stop</button>
                  <button onclick="resetStopwatch()" class="px-3 py-1 rounded bg-white/15 cursor-pointer">Reset</button>
                </div>
              </div>
            </div>`;

        case "Reminders":
          return `
            <div class="space-y-2.5">
              <div class="flex gap-1.5">
                <input id="rem-input" placeholder="New reminder..." class="flex-1 bg-black/35 border border-white/15 rounded-lg px-2.5 py-1.5 outline-none" />
                <button onclick="addReminder()" class="px-3 py-1.5 rounded-lg bg-sky-500 text-white font-semibold cursor-pointer">Add</button>
              </div>
              <div id="rem-list" class="space-y-1.5">
                <label class="flex items-center gap-2 p-2 rounded-lg bg-white/5"><input type="checkbox" checked class="accent-sky-400"/><span>Build interactive macOS Emulator</span></label>
                <label class="flex items-center gap-2 p-2 rounded-lg bg-white/5"><input type="checkbox" class="accent-sky-400"/><span>Add custom HTML games to GAMES_LIBRARY</span></label>
              </div>
            </div>`;

        case "Calendar":
          return `
            <div class="space-y-2">
              <div class="font-bold text-sm text-rose-400">November 2026</div>
              <div class="grid grid-cols-7 gap-1 text-center text-[11px]">
                ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => `<div class="text-white/50 font-bold">${d}</div>`).join("")}
                ${Array.from({length:30}, (_,i) => `<div class="p-1.5 rounded-lg ${i+1===17 ? 'bg-rose-500 text-white font-bold' : 'bg-white/5'}">${i+1}</div>`).join("")}
              </div>
            </div>`;

        case "Contacts":
          return `
            <div class="space-y-2">
              <div class="flex gap-1.5"><input id="contact-name" placeholder="Name" class="flex-1 bg-black/35 border border-white/15 rounded-lg px-2 py-1 outline-none"/><input id="contact-email" placeholder="Email" class="flex-1 bg-black/35 border border-white/15 rounded-lg px-2 py-1 outline-none"/><button onclick="addContact()" class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold cursor-pointer">+</button></div>
              <div id="contact-list" class="divide-y divide-white/10 bg-white/5 rounded-xl border border-white/10">
                <div class="p-2.5 flex justify-between"><span>Ada Lovelace</span><span class="text-white/60">ada@analytical.org</span></div>
                <div class="p-2.5 flex justify-between"><span>Alan Turing</span><span class="text-white/60">alan@bletchley.uk</span></div>
              </div>
            </div>`;

        case "Dictionary":
          return `
            <div class="space-y-2.5">
              <div class="flex gap-1.5">
                <input id="dict-word" value="Proxy" class="flex-1 bg-black/35 border border-white/15 rounded-lg px-2.5 py-1.5 outline-none" />
                <button onclick="lookupDictionary()" class="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-semibold cursor-pointer">Look Up</button>
              </div>
              <div id="dict-result" class="p-3 rounded-xl bg-white/5 border border-white/10 leading-relaxed text-white/85">Click <strong>Look Up</strong> to fetch live encyclopedia/dictionary info for any word.</div>
            </div>`;

        case "Weather":
          return `
            <div class="space-y-3 text-center">
              <div class="p-4 rounded-2xl bg-gradient-to-br from-sky-500/30 to-blue-700/30 border border-sky-400/30">
                <div class="text-xs text-white/75">Monroe, NC</div>
                <div class="text-4xl font-light mt-1">64°F</div>
                <div class="text-xs text-sky-300 mt-1">Partly Sunny • H: 68° L: 46°</div>
              </div>
              <div class="grid grid-cols-4 gap-2 text-[11px]">
                <div class="p-2 rounded-xl bg-white/5"><div>Wed</div><div class="font-bold mt-1">66°</div></div>
                <div class="p-2 rounded-xl bg-white/5"><div>Thu</div><div class="font-bold mt-1">61°</div></div>
                <div class="p-2 rounded-xl bg-white/5"><div>Fri</div><div class="font-bold mt-1">58°</div></div>
                <div class="p-2 rounded-xl bg-white/5"><div>Sat</div><div class="font-bold mt-1">63°</div></div>
              </div>
            </div>`;

        case "Stocks":
          return `
            <div class="divide-y divide-white/10 bg-white/5 rounded-xl border border-white/10">
              ${[
                {s:"AAPL",n:"Apple Inc.",p:"$234.80",c:"+1.42%",up:true},
                {s:"NVDA",n:"NVIDIA Corp.",p:"$148.15",c:"+2.85%",up:true},
                {s:"MSFT",n:"Microsoft",p:"$428.50",c:"-0.31%",up:false},
                {s:"GOOGL",n:"Alphabet Inc.",p:"$182.40",c:"+0.94%",up:true}
              ].map(st => `<div class="p-3 flex items-center justify-between"><div><div class="font-bold">${st.s}</div><div class="text-[10px] text-white/60">${st.n}</div></div><div class="text-right code-font"><div>${st.p}</div><div class="${st.up?'text-emerald-400':'text-rose-400'}">${st.c}</div></div></div>`).join("")}
            </div>`;

        case "Home":
          return `
            <div class="grid grid-cols-2 gap-2.5">
              ${["Desk Lamp","Studio Speakers","Thermostat (70°F)","Front Door Lock"].map(dev => `
                <button onclick="this.classList.toggle('bg-amber-500/30');this.classList.toggle('border-amber-400')" class="p-3 rounded-xl bg-white/5 border border-white/10 text-left transition cursor-pointer">
                  <div class="font-bold">${dev}</div>
                  <div class="text-[10px] text-white/60 mt-1">Click to toggle state</div>
                </button>
              `).join("")}
            </div>`;

        case "System Settings":
          return `
            <div class="space-y-3">
              <div class="font-bold">Desktop Wallpaper Theme</div>
              <div class="grid grid-cols-3 gap-2">
                <button onclick="document.getElementById('mac-body').style.background='radial-gradient(circle at 20% 20%, #3b82f6 0%, #1e1b4b 45%, #090d16 100%)'" class="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-950 border border-white/20 font-semibold cursor-pointer">Sequoia Blue</button>
                <button onclick="document.getElementById('mac-body').style.background='radial-gradient(circle at 80% 20%, #ec4899 0%, #4c1d95 50%, #0f172a 100%)'" class="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-950 border border-white/20 font-semibold cursor-pointer">Monterey Dusk</button>
                <button onclick="document.getElementById('mac-body').style.background='radial-gradient(circle at 30% 70%, #10b981 0%, #064e3b 50%, #020617 100%)'" class="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-950 border border-white/20 font-semibold cursor-pointer">Sonoma Forest</button>
              </div>
            </div>`;

        case "VoiceOver Utility":
          return `
            <div class="space-y-3">
              <p class="text-white/75">Test macOS built-in speech synthesis right in your browser:</p>
              <input id="vo-text" value="VoiceOver is on. Welcome to macOS." class="w-full bg-black/35 border border-white/15 rounded-lg px-2.5 py-2 outline-none" />
              <button onclick="speechSynthesis.speak(new SpeechSynthesisUtterance(document.getElementById('vo-text').value))" class="w-full py-2 rounded-xl bg-sky-500 text-white font-semibold cursor-pointer">🔊 Speak Text</button>
            </div>`;

        case "Activity Monitor":
          return `
            <div class="space-y-2.5">
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-white/60">CPU</div><div class="font-bold text-emerald-400 text-sm">12.4%</div></div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-white/60">RAM</div><div class="font-bold text-sky-400 text-sm">6.1 GB</div></div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-white/60">Windows</div><div class="font-bold text-amber-400 text-sm">${Object.keys(openWindows).length}</div></div>
              </div>
              <div class="bg-black/30 rounded-xl border border-white/10 divide-y divide-white/5">
                ${MAC_APPS.slice(0, 7).map((a,i) => `<div class="px-3 py-1.5 flex justify-between text-[11px]"><span>${a.name}</span><span class="code-font text-white/60">${(1.1+i*0.3).toFixed(1)}%</span></div>`).join("")}
              </div>
            </div>`;

        case "Console":
          return `<pre class="h-full bg-black/50 p-3 rounded-xl border border-white/10 code-font text-[11px] text-amber-300 overflow-auto whitespace-pre-wrap">${sysLogs.join("\n")}</pre>`;

        case "System Information":
          return `
            <div class="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10 code-font text-[11px]">
              <div><strong>Model Name:</strong> MacBook Pro (Web Emulator)</div>
              <div><strong>Chip:</strong> Apple M4 Max Virtual</div>
              <div><strong>Memory:</strong> 32 GB Unified Memory</div>
              <div><strong>System Version:</strong> macOS 16.0 (25A354)</div>
              <div><strong>Installed Apps:</strong> 69 Built-In Apps + ${GAMES_LIBRARY.length} Embedded Games</div>
            </div>`;

        case "Messages":
        case "Mail":
        case "FaceTime":
        case "Phone":
          return `
            <div class="flex flex-col h-full space-y-2">
              <div id="comm-feed" class="flex-1 bg-black/30 rounded-xl p-3 space-y-2 overflow-y-auto">
                <div class="p-2 rounded-lg bg-white/10 w-fit"><strong>System:</strong> ${appName} connected and ready.</div>
              </div>
              <div class="flex gap-1.5">
                <input id="comm-input" placeholder="Send a message via ${appName}..." class="flex-1 bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 outline-none" />
                <button onclick="sendCommMsg('${appName}')" class="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold cursor-pointer">Send</button>
              </div>
            </div>`;

        case "Music":
        case "Podcasts":
        case "TV":
        case "QuickTime Player":
        case "DVD Player":
        case "Voice Memos":
          return `
            <div class="flex flex-col items-center justify-center h-full space-y-3 text-center">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg"><i data-lucide="play" class="w-8 h-8 text-white"></i></div>
              <div class="font-bold text-sm">${appName} Media Deck</div>
              <div class="flex gap-2">
                <button onclick="playTone(329.63,0.3,'sine');setTimeout(()=>playTone(392,0.3,'sine'),250);setTimeout(()=>playTone(523.25,0.5,'sine'),500)" class="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold cursor-pointer">▶ Play Sample Chime</button>
              </div>
            </div>`;

        case "Photo Booth":
        case "Image Playground":
        case "Photos":
        case "Preview":
        case "iMovie":
        case "Image Capture":
        case "Magnifier":
        case "Screenshot":
          return `
            <div class="flex flex-col items-center space-y-2.5">
              <canvas id="art-canvas" width="420" height="210" class="w-full rounded-xl border border-white/15 bg-slate-950"></canvas>
              <div class="flex gap-2">
                <button onclick="renderGenerativeArt()" class="px-3 py-1.5 rounded-lg bg-fuchsia-500 text-white font-semibold cursor-pointer">Generate / Refresh Visual</button>
                <button onclick="downloadArtCanvas()" class="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 cursor-pointer">Save PNG</button>
              </div>
            </div>`;

        default: {
          const meta = MAC_APPS.find(a => a.name === appName) || { desc: "Built-in macOS utility.", icon: "cpu", color: "from-sky-500 to-indigo-600", cat: "Utilities" };
          return `
            <div class="space-y-3">
              <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shrink-0"><i data-lucide="${meta.icon}" class="w-6 h-6 text-white"></i></div>
                <div><div class="font-bold text-sm">${appName}</div><div class="text-[11px] text-white/70">${meta.desc}</div></div>
              </div>
              <div class="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div class="flex justify-between text-[11px]"><span>Service Status</span><span class="text-emerald-400 font-semibold">● Active & Ready</span></div>
                <button onclick="this.textContent='✓ Diagnostic & Action Completed';this.classList.add('bg-emerald-500','text-slate-950')" class="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 font-semibold cursor-pointer">Run ${appName} Action</button>
              </div>
            </div>`;
        }
      }
    }

    function initAppBehavior(appName) {
      if (appName === "Apple Games") launchBuiltInGame(GAMES_LIBRARY[0].id);
      if (appName === "Freeform") initFreeform();
      if (appName === "Grapher") plotGrapher();
      if (appName === "Chess") initChess();
      if (["Photo Booth","Image Playground","Photos","Preview","iMovie","Image Capture","Magnifier","Screenshot"].includes(appName)) renderGenerativeArt();
    }

    // One-click Game Launcher inside Apple Games
    function launchBuiltInGame(gameId) {
      const game = GAMES_LIBRARY.find(g => g.id === gameId);
      const frame = document.getElementById("game-runner-frame");
      const label = document.getElementById("active-game-title");
      if (!game || !frame) return;
      frame.srcdoc = game.html;
      if (label) label.textContent = `Playing: ${game.title}`;
      logSystem(`Apple Games: Started ${game.title}`);
    }

    function filterAppGrid(q) {
      const term = q.trim().toLowerCase();
      document.querySelectorAll("[data-app-card]").forEach(card => {
        card.style.display = card.getAttribute("data-app-card").includes(term) ? "flex" : "none";
      });
    }

    function calcPress(k) {
      const d = document.getElementById("calc-display");
      if (!d) return;
      if (k === "C") { d.value = "0"; return; }
      if (k === "=") { try { d.value = String(Function('"use strict";return (' + d.value + ')')()); } catch { d.value = "Error"; } return; }
      d.value = d.value === "0" ? k : d.value + k;
    }

    function calcFn(fn) {
      const d = document.getElementById("calc-display");
      const v = parseFloat(d.value) || 0;
      if (fn === "sin") d.value = Math.sin(v).toFixed(4);
      if (fn === "cos") d.value = Math.cos(v).toFixed(4);
      if (fn === "sqrt") d.value = Math.sqrt(v).toFixed(4);
      if (fn === "hex") d.value = "0x" + Math.floor(v).toString(16).toUpperCase();
    }

    function recalcNumbers() {
      const b1 = parseFloat(document.getElementById("num-B1")?.value) || 0;
      const b2 = parseFloat(document.getElementById("num-B2")?.value) || 0;
      const rawB3 = document.getElementById("num-B3")?.value || "0";
      let b3 = 0;
      if (rawB3.startsWith("=")) {
        const expr = rawB3.slice(1).replace(/B1/gi, b1).replace(/B2/gi, b2);
        try { b3 = Function('"use strict";return (' + expr + ')')(); } catch { b3 = 0; }
      } else { b3 = parseFloat(rawB3) || 0; }
      if (document.getElementById("num-C1")) document.getElementById("num-C1").textContent = b1;
      if (document.getElementById("num-C2")) document.getElementById("num-C2").textContent = b2;
      if (document.getElementById("num-C3")) document.getElementById("num-C3").textContent = b3;
    }

    let slideIdx = 0;
    const slides = [
      { t: "Slide 1: How HTTP & Proxies Work", b: "Clients send HTTP methods (GET, POST) to Origin Servers or Forward Proxies." },
      { t: "Slide 2: HTTPS CONNECT Tunnels", b: "Proxies establish raw TCP sockets so encrypted TLS bytes pass end-to-end." },
      { t: "Slide 3: Single-File Asset Bundling", b: "External CSS and JavaScript files are fetched and inlined into one HTML file." }
    ];
    function changeSlide(dir) {
      slideIdx = (slideIdx + dir + slides.length) % slides.length;
      const st = document.getElementById("keynote-stage");
      if (st) st.innerHTML = `<h2 class="text-xl font-bold">${slides[slideIdx].t}</h2><p class="text-white/75 mt-2">${slides[slideIdx].b}</p>`;
    }

    function initFreeform() {
      const c = document.getElementById("freeform-canvas");
      if (!c) return;
      const ctx = c.getContext("2d");
      window._ffColor = "#38bdf8";
      let drawing = false;
      c.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
      c.onmousemove = (e) => { if (!drawing) return; ctx.strokeStyle = window._ffColor; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); };
      c.onmouseup = () => drawing = false;
    }
    function clearFreeform() {
      const c = document.getElementById("freeform-canvas");
      if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height);
    }

    function plotGrapher() {
      const c = document.getElementById("grapher-canvas");
      const expr = document.getElementById("grapher-fn")?.value || "Math.sin(x)";
      if (!c) return;
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath(); ctx.moveTo(0, c.height/2); ctx.lineTo(c.width, c.height/2); ctx.moveTo(c.width/2, 0); ctx.lineTo(c.width/2, c.height); ctx.stroke();
      ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let px = 0; px < c.width; px++) {
        const x = (px - c.width / 2) / 30;
        let y = 0;
        try { y = Function("x", "return " + expr)(x); } catch {}
        const py = c.height / 2 - y * 30;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    let chessState = [], selectedSq = null;
    function initChess() {
      chessState = [
        ["♜","♞","♝","♛","♚","♝","♞","♜"],
        ["♟","♟","♟","♟","♟","♟","♟","♟"],
        ["","","","","","","",""],["","","","","","","",""],
        ["","","","","","","",""],["","","","","","","",""],
        ["♙","♙","♙","♙","♙","♙","♙","♙"],
        ["♖","♘","♗","♕","♔","♗","♘","♖"]
      ];
      selectedSq = null;
      drawChess();
    }
    function drawChess() {
      const b = document.getElementById("chess-board");
      if (!b) return;
      b.innerHTML = "";
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const sq = document.createElement("button");
          const isSel = selectedSq && selectedSq[0] === r && selectedSq[1] === c;
          sq.className = `flex items-center justify-center text-2xl cursor-pointer ${(r+c)%2===0 ? 'bg-amber-200/85 text-slate-900' : 'bg-amber-800/85 text-white'} ${isSel ? 'ring-2 ring-sky-400' : ''}`;
          sq.textContent = chessState[r][c];
          sq.onclick = () => {
            if (!selectedSq && chessState[r][c]) { selectedSq = [r, c]; drawChess(); }
            else if (selectedSq) {
              chessState[r][c] = chessState[selectedSq[0]][selectedSq[1]];
              chessState[selectedSq[0]][selectedSq[1]] = "";
              selectedSq = null;
              drawChess();
            }
          };
          b.appendChild(sq);
        }
      }
    }

    function runTermCmd(inp) {
      const cmd = inp.value.trim();
      inp.value = "";
      const out = document.getElementById("term-out");
      out.textContent += `\nuser@macbook ~ % ${cmd}\n`;
      if (cmd === "help") out.textContent += "Available commands: help, ls, date, whoami, neofetch, open <AppName>, clear";
      else if (cmd === "clear") out.textContent = "";
      else if (cmd === "date") out.textContent += new Date().toString();
      else if (cmd === "whoami") out.textContent += "mac-user";
      else if (cmd === "ls") out.textContent += "Applications/  Desktop/  Documents/  Downloads/  http-visualizer.html";
      else if (cmd === "neofetch") out.textContent += `OS: macOS 16.0 Emulator\nKernel: Darwin 25.0\nApps: 69 Interactive Apps + ${GAMES_LIBRARY.length} Games`;
      else if (cmd.startsWith("open ")) {
        const target = cmd.slice(5).trim();
        const found = MAC_APPS.find(a => a.name.toLowerCase() === target.toLowerCase());
        if (found) { openApp(found.name); out.textContent += `Launching ${found.name}...`; }
        else out.textContent += `App not found: ${target}`;
      } else out.textContent += `zsh: command executed: ${cmd}`;
      out.scrollTop = out.scrollHeight;
    }

    function runScriptEditor() {
      const code = document.getElementById("script-code").value;
      const out = document.getElementById("script-out");
      try { out.textContent = String(Function(code)()); }
      catch (e) { out.textContent = "Error: " + e.message; }
    }

    function updateColorMeter(hex) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      document.getElementById("color-readout").innerHTML = `<div>HEX: <span class="text-sky-300">${hex.toUpperCase()}</span></div><div>RGB: <span class="text-emerald-300">rgb(${r}, ${g}, ${b})</span></div><div>Profile: <span class="text-amber-300">Display P3 / sRGB IEC61966-2.1</span></div>`;
    }

    function genMacPassword() {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
      let pass = "";
      for (let i = 0; i < 16; i++) pass += chars[Math.floor(Math.random() * chars.length)];
      document.getElementById("gen-pass-box").value = pass;
    }

    let swTimer = null, swTenths = 0;
    function startStopwatch() { if (swTimer) return; swTimer = setInterval(() => { swTenths++; const el = document.getElementById("sw-display"); if (el) el.textContent = (swTenths/10).toFixed(1) + "s"; }, 100); }
    function stopStopwatch() { clearInterval(swTimer); swTimer = null; }
    function resetStopwatch() { stopStopwatch(); swTenths = 0; const el = document.getElementById("sw-display"); if (el) el.textContent = "0.0s"; }

    function addReminder() {
      const inp = document.getElementById("rem-input");
      if (!inp.value.trim()) return;
      document.getElementById("rem-list").insertAdjacentHTML("beforeend", `<label class="flex items-center gap-2 p-2 rounded-lg bg-white/5"><input type="checkbox" class="accent-sky-400"/><span>${inp.value}</span></label>`);
      inp.value = "";
    }
    function addContact() {
      const n = document.getElementById("contact-name"), e = document.getElementById("contact-email");
      if (!n.value.trim()) return;
      document.getElementById("contact-list").insertAdjacentHTML("beforeend", `<div class="p-2.5 flex justify-between"><span>${n.value}</span><span class="text-white/60">${e.value || "no-email"}</span></div>`);
      n.value = ""; e.value = "";
    }

    async function lookupDictionary() {
      const w = document.getElementById("dict-word").value.trim();
      const box = document.getElementById("dict-result");
      box.textContent = "Looking up...";
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(w)}&format=json&origin=*`);
        const data = await res.json();
        const pages = data.query.pages;
        const first = pages[Object.keys(pages)[0]];
        box.textContent = first.extract || "No definition found.";
      } catch {
        box.textContent = `${w}: A term or concept used in computing and everyday language.`;
      }
    }

    function sendCommMsg(app) {
      const inp = document.getElementById("comm-input");
      if (!inp.value.trim()) return;
      document.getElementById("comm-feed").insertAdjacentHTML("beforeend", `<div class="p-2 rounded-lg bg-sky-500/30 ml-auto w-fit"><strong>You (${app}):</strong> ${inp.value}</div>`);
      inp.value = "";
    }

    function renderGenerativeArt() {
      const c = document.getElementById("art-canvas");
      if (!c) return;
      const ctx = c.getContext("2d");
      const g = ctx.createLinearGradient(0, 0, c.width, c.height);
      g.addColorStop(0, `hsl(${Math.random()*360},75%,45%)`);
      g.addColorStop(1, `hsl(${Math.random()*360},75%,25%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = `hsla(${Math.random()*360},85%,65%,0.35)`;
        ctx.beginPath();
        ctx.arc(Math.random()*c.width, Math.random()*c.height, 15 + Math.random()*45, 0, Math.PI*2);
        ctx.fill();
      }
    }
    function downloadArtCanvas() {
      const c = document.getElementById("art-canvas");
      if (!c) return;
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "macos-studio-capture.png";
      a.click();
    }

    function applyEditedSafariSource() {
      const srcBox = document.getElementById("safari-source");
      const frame = document.getElementById("safari-frame");
      if (!srcBox || !frame) return;
      bundledOutputCache = srcBox.value;
      frame.srcdoc = bundledOutputCache;
      frame.classList.remove("hidden");
      srcBox.classList.add("hidden");
    }

    async function runSafariBundler() {
      const urlInput = document.getElementById("safari-url");
      const stats = document.getElementById("safari-stats");
      const frame = document.getElementById("safari-frame");
      const srcBox = document.getElementById("safari-source");
      if (!urlInput) return;

      const targetUrl = urlInput.value.trim();
      stats.textContent = "Fetching & Bundling...";

      try {
        const res = await fetch(targetUrl);
        let html = await res.text();
        if (targetUrl.includes("wikipedia.org") && targetUrl.includes("action=parse")) {
          const data = JSON.parse(html);
          if (data.parse && data.parse.text) {
            html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data.parse.title}</title><link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles&skin=vector"></head><body class="mediawiki" style="padding:1.5rem;background:#fff;"><h1>${data.parse.title}</h1>${data.parse.text["*"]}</body></html>`;
          }
        }
        const doc = new DOMParser().parseFromString(html, "text/html");
        let cssCount = 0, jsCount = 0;
        for (const link of Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]'))) {
          try {
            const cssRes = await fetch(new URL(link.getAttribute("href"), targetUrl).href);
            if (cssRes.ok) {
              const style = doc.createElement("style");
              style.textContent = await cssRes.text();
              link.replaceWith(style);
              cssCount++;
            }
          } catch {}
        }
        for (const s of Array.from(doc.querySelectorAll("script[src]"))) {
          try {
            const jsRes = await fetch(new URL(s.getAttribute("src"), targetUrl).href);
            if (jsRes.ok) {
              const inlineS = doc.createElement("script");
              inlineS.textContent = (await jsRes.text()).replace(/<\/script>/gi, "<\\/script>");
              s.replaceWith(inlineS);
              jsCount++;
            }
          } catch {}
        }
        bundledOutputCache = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
        frame.srcdoc = bundledOutputCache;
        srcBox.value = bundledOutputCache;
        stats.textContent = `${bundledOutputCache.length.toLocaleString()} chars (${cssCount} CSS, ${jsCount} JS)`;
      } catch {
        bundledOutputCache = `<!DOCTYPE html><html><head><style>body{font-family:-apple-system,sans-serif;padding:2rem;background:#f8fafc;color:#0f172a}.card{background:#fff;padding:1.5rem;border-radius:12px;border:1px solid #cbd5e1}</style></head><body><div class="card"><h2>Bundled Simulation: ${targetUrl}</h2><p>Browser CORS blocked direct fetch to this host, so Safari generated a self-contained HTML + CSS + JS bundle.</p><button onclick="alert('Inlined JS works!')">Test Bundled JS</button></div></body></html>`;
        frame.srcdoc = bundledOutputCache;
        srcBox.value = bundledOutputCache;
        stats.textContent = "Simulated Bundle (CORS Protected)";
      }
    }

    function downloadBundledFromSafari() {
      if (!bundledOutputCache) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([bundledOutputCache], { type: "text/html" }));
      a.download = "macos-safari-bundle.html";
      a.click();
    }
  </script>
</body>
</html>
`);
document.close();