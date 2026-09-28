// Drives headless Chrome over the DevTools Protocol using Node's built-in
// WebSocket (Node 22+). Clicks the navbar language toggle and reports what
// happened to localStorage / <html lang> / the visible nav labels.
const { spawn } = require("node:child_process")
const http = require("node:http")

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const PORT = 9333
const URL = "http://localhost:3000/"

function getJson(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port: PORT, path }, (res) => {
        let body = ""
        res.on("data", (d) => (body += d))
        res.on("end", () => {
          try {
            resolve(JSON.parse(body))
          } catch (e) {
            reject(e)
          }
        })
      })
      .on("error", reject)
  })
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=C:\\Users\\MUHAMM~1\\AppData\\Local\\Temp\\opencode\\cdp-profile",
    "--no-first-run",
    "--window-size=1440,900",
    URL,
  ])

  await sleep(4000)

  let targets
  for (let i = 0; i < 12; i++) {
    try {
      targets = await getJson("/json")
      if (targets.some((t) => t.type === "page")) break
    } catch {}
    await sleep(1000)
  }
  const page = (targets || []).find((t) => t.type === "page")
  if (!page) {
    console.log("NO PAGE TARGET")
    chrome.kill()
    process.exit(1)
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg)
      pending.delete(msg.id)
    }
  })
  await new Promise((r) => ws.addEventListener("open", r))

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const myId = ++id
      pending.set(myId, resolve)
      ws.send(JSON.stringify({ id: myId, method, params }))
    })

  const evaluate = async (expr) => {
    const r = await send("Runtime.evaluate", {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    })
    if (r.result && r.result.exceptionDetails) {
      return "EXCEPTION: " + JSON.stringify(r.result.exceptionDetails.text)
    }
    return r.result && r.result.result ? r.result.result.value : undefined
  }

  await send("Runtime.enable")
  await sleep(3500)

  const navLabels = `(()=>{const a=[...document.querySelectorAll('nav a, header a')].map(x=>x.textContent.trim()).filter(Boolean); return a.slice(0,8).join(' | ')})()`

  console.log("=== SEBELUM klik ===")
  console.log("html.lang      :", await evaluate("document.documentElement.lang"))
  console.log("localStorage   :", await evaluate("localStorage.getItem('language')"))
  console.log("nav labels     :", await evaluate(navLabels))

  console.log("\n=== buka panel settings ===")
  const opened = await evaluate(`(() => {
    const btn = document.querySelector('[data-settings-trigger]');
    if (!btn) return 'SETTINGS_TRIGGER_NOT_FOUND';
    btn.click();
    return 'OPENED';
  })()`)
  console.log("hasil          :", opened)
  await sleep(600)

  console.log("\n=== klik tombol 'Indonesia' ===")
  const clicked = await evaluate(`(() => {
    const btn = document.querySelector('button[aria-label="Indonesia"]');
    if (!btn) {
      const all = [...document.querySelectorAll('button')].map(b => b.getAttribute('aria-label')).filter(Boolean);
      return 'ID_NOT_FOUND. buttons=' + JSON.stringify(all);
    }
    btn.click();
    return 'CLICKED';
  })()`)
  console.log("hasil klik     :", clicked)

  await sleep(1800)

  console.log("\n=== SESUDAH klik ===")
  console.log("html.lang      :", await evaluate("document.documentElement.lang"))
  console.log("localStorage   :", await evaluate("localStorage.getItem('language')"))
  console.log("nav labels     :", await evaluate(navLabels))
  console.log(
    "\nseluruh teks tombol nav (detail):\n",
    await evaluate(
      `(()=>{const els=[...document.querySelectorAll('nav button, nav a')].map(x=>({t:(x.textContent||'').trim(), aria:x.getAttribute('aria-label'), title:x.getAttribute('title')})).filter(x=>x.t||x.aria); return JSON.stringify(els,null,1)})()`
    )
  )
  console.log(
    "\nteks section headings di halaman:\n",
    await evaluate(
      `(()=>{const h=[...document.querySelectorAll('h2, h3')].map(x=>x.textContent.trim()).filter(Boolean); return h.slice(0,20).join(' | ')})()`
    )
  )

  ws.close()
  chrome.kill()
  process.exit(0)
})().catch((e) => {
  console.error("ERR:", e)
  process.exit(1)
})
