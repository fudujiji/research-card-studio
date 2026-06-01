const fields = {
  mode: document.querySelector("#mode"),
  confidence: document.querySelector("#confidence"),
  title: document.querySelector("#title"),
  source: document.querySelector("#source"),
  summaryLabel: document.querySelector("#summaryLabel"),
  summary: document.querySelector("#summary"),
  evidenceLabel: document.querySelector("#evidenceLabel"),
  evidence: document.querySelector("#evidence"),
  risksLabel: document.querySelector("#risksLabel"),
  risks: document.querySelector("#risks"),
  nextLabel: document.querySelector("#nextLabel"),
  next: document.querySelector("#next")
};

const preview = {
  card: document.querySelector("#cardPreview"),
  mode: document.querySelector("#cardMode"),
  confidence: document.querySelector("#cardConfidence"),
  title: document.querySelector("#cardTitle"),
  source: document.querySelector("#cardSource"),
  summary: document.querySelector("#cardSummary"),
  evidenceHeading: document.querySelector("#cardEvidenceHeading"),
  evidence: document.querySelector("#cardEvidence"),
  risksHeading: document.querySelector("#cardRisksHeading"),
  risks: document.querySelector("#cardRisks"),
  nextHeading: document.querySelector("#cardNextHeading"),
  next: document.querySelector("#cardNext")
};

const samples = {
  research: {
    mode: "Research",
    title: "Codex repo onboarding workflow",
    source: "Local repo triage",
    confidence: "Medium",
    summary:
      "A compact PROJECT_BRIEF.md can reduce repeated repo orientation work before asking Codex to make changes.",
    evidence: [
      "Most repos scatter setup instructions across README, package files, tests, and local docs.",
      "A fixed brief helps Codex find commands, risks, and boundaries faster.",
      "The output can be reviewed by a human before any code edit."
    ],
    risks: [
      "Generated briefs can become stale.",
      "A scanner may miss project-specific conventions hidden in docs.",
      "Over-formatting can make the brief harder to maintain."
    ],
    next:
      "Build a minimal scanner that reads README, package manifests, test config, and AGENTS.md."
  },
  trading: {
    mode: "Trading",
    title: "BTC prediction market note",
    source: "Manual market review",
    confidence: "Low",
    summary:
      "The market is liquid enough to monitor, but the entry should wait for a clear catalyst and invalidation level.",
    evidence: [
      "Recent volume is concentrated around a small number of price-threshold markets.",
      "Resolution depends on a specific external price source.",
      "Spread and liquidity are more important than headline probability."
    ],
    risks: [
      "Thin books can make the displayed price misleading.",
      "Resolution wording may differ from the intuitive trade thesis.",
      "Short-term volatility can erase a small perceived edge."
    ],
    next:
      "Write the exact entry trigger, maximum size, and invalidation condition before taking risk."
  },
  onchain: {
    mode: "Onchain",
    title: "Early token dossier",
    source: "Manual onchain checklist",
    confidence: "Watchlist only",
    summary:
      "The token has an interesting narrative, but it remains a watchlist candidate until holder concentration and liquidity depth are verified.",
    evidence: [
      "Narrative is visible but still early.",
      "Liquidity pool needs depth and lock verification.",
      "Developer and top holder behavior must be reviewed before any action."
    ],
    risks: [
      "Contract or owner controls may be unsafe.",
      "Early social activity can be artificial.",
      "Liquidity can disappear faster than the research cycle."
    ],
    next:
      "Check holder distribution, LP state, deployer history, and recent buy/sell flow."
  },
  codex: {
    mode: "Codex",
    title: "Repository onboarding brief",
    source: "GitHub repo before Codex changes",
    confidence: "Ready for triage",
    summary:
      "Prepare a compact brief before asking Codex to modify a repository, so setup, tests, risky areas, and the next task are explicit.",
    evidence: [
      "Setup: open the README and package manifests, then identify install and run commands.",
      "Setup: check AGENTS.md or project docs for local rules and forbidden actions.",
      "Test: list the lightest command that verifies the target change.",
      "Test: note any tests that require credentials, network access, or external services."
    ],
    risks: [
      "Hidden project conventions may live outside the README.",
      "Generated setup commands can be stale if lockfiles changed.",
      "Codex should not edit broad areas before the next task is scoped."
    ],
    next:
      "Create PROJECT_BRIEF.md with repo purpose, setup commands, test commands, risky areas, and the first safe task."
  }
};

function listFromText(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function setList(target, items) {
  target.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function cardData() {
  return {
    mode: fields.mode.value.trim() || "Research",
    confidence: fields.confidence.value.trim() || "Unknown",
    title: fields.title.value.trim() || "Untitled research card",
    source: fields.source.value.trim() || "No source provided",
    summary: fields.summary.value.trim() || "No conclusion written yet.",
    evidence: listFromText(fields.evidence.value),
    risks: listFromText(fields.risks.value),
    next: fields.next.value.trim() || "Define the next action."
  };
}

function sectionLabels(mode) {
  if (mode === "Codex") {
    return {
      summary: "Repo Purpose",
      evidence: "Setup / Test Commands",
      risks: "Risky Areas",
      next: "Next Task"
    };
  }

  return {
    summary: "Conclusion",
    evidence: "Evidence",
    risks: "Risks",
    next: "Next Step"
  };
}

function render() {
  const data = cardData();
  const theme = data.mode.toLowerCase();
  const labels = sectionLabels(data.mode);

  preview.card.className = `research-card theme-${theme}`;
  preview.mode.textContent = data.mode;
  preview.confidence.textContent = data.confidence;
  preview.title.textContent = data.title;
  preview.source.textContent = data.source;
  preview.summary.textContent = data.summary;
  preview.next.textContent = data.next;
  fields.summaryLabel.textContent = labels.summary;
  fields.evidenceLabel.textContent = labels.evidence;
  fields.risksLabel.textContent = labels.risks;
  fields.nextLabel.textContent = labels.next;
  preview.evidenceHeading.textContent = labels.evidence;
  preview.risksHeading.textContent = labels.risks;
  preview.nextHeading.textContent = data.mode === "Codex" ? "Next Task" : "Next";
  setList(preview.evidence, data.evidence);
  setList(preview.risks, data.risks);
}

function loadSample(name) {
  const sample = samples[name];
  if (!sample) return;

  fields.mode.value = sample.mode;
  fields.confidence.value = sample.confidence;
  fields.title.value = sample.title;
  fields.source.value = sample.source;
  fields.summary.value = sample.summary;
  fields.evidence.value = sample.evidence.join("\n");
  fields.risks.value = sample.risks.join("\n");
  fields.next.value = sample.next;
  render();
}

function markdown() {
  const data = cardData();
  const labels = sectionLabels(data.mode);
  const evidence = data.evidence.map((item) => `- ${item}`).join("\n");
  const risks = data.risks.map((item) => `- ${item}`).join("\n");

  return `# ${data.title}

Mode: ${data.mode}
Source: ${data.source}
Confidence: ${data.confidence}

## ${labels.summary}

${data.summary}

## ${labels.evidence}

${evidence}

## ${labels.risks}

${risks}

## ${labels.next}

${data.next}
`;
}

async function copyMarkdown() {
  await navigator.clipboard.writeText(markdown());
  showToast("Copied");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 1200);
}

function wrapLines(context, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const lines = wrapLines(context, text, maxWidth);
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function drawRoundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function drawPill(context, text, x, y, background, color) {
  context.font = "700 22px Inter, Arial, sans-serif";
  const width = context.measureText(text).width + 40;
  context.fillStyle = background;
  drawRoundRect(context, x, y, width, 46, 23);
  context.fillStyle = color;
  context.fillText(text, x + 20, y + 31);
}

function drawBulletList(context, items, x, y, maxWidth, accent) {
  items.forEach((item) => {
    context.font = "400 30px Inter, Arial, sans-serif";
    const lines = wrapLines(context, item, maxWidth - 72);
    const boxHeight = Math.max(74, lines.length * 38 + 34);

    context.fillStyle = "rgba(255,255,255,0.68)";
    drawRoundRect(context, x, y, maxWidth, boxHeight, 16);

    context.fillStyle = accent;
    context.beginPath();
    context.arc(x + 32, y + 38, 7, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#17211c";
    lines.forEach((line, index) => {
      context.fillText(line, x + 62, y + 42 + index * 38);
    });

    y += boxHeight + 18;
  });

  return y;
}

function themeColors(mode) {
  if (mode === "Codex") {
    return { accent: "#6b5fd6", background: "#f6f4ff" };
  }
  if (mode === "Trading") {
    return { accent: "#d2673f", background: "#fff7f1" };
  }
  if (mode === "Onchain") {
    return { accent: "#2e5fa8", background: "#f2f7ff" };
  }
  return { accent: "#1f7a5a", background: "#f6faf7" };
}

function renderPngCanvas(data) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1800;
  const context = canvas.getContext("2d");
  const colors = themeColors(data.mode);
  const margin = 96;
  const contentWidth = canvas.width - margin * 2;

  context.fillStyle = colors.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(23,33,28,0.06)";
  context.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 64) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let y = 0; y < canvas.height; y += 64) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  context.fillStyle = `${colors.accent}33`;
  context.beginPath();
  context.arc(canvas.width - 80, 70, 260, 0, Math.PI * 2);
  context.fill();

  drawPill(context, data.mode.toUpperCase(), margin, 92, "#17211c", "#ffffff");
  drawPill(context, data.confidence.toUpperCase(), canvas.width - margin - 260, 92, "#ffffff", "#66736d");

  let y = 238;
  context.fillStyle = "#17211c";
  context.font = "800 82px Inter, Arial, sans-serif";
  y = drawWrappedText(context, data.title, margin, y, contentWidth, 90) + 24;

  context.fillStyle = "#66736d";
  context.font = "700 30px Inter, Arial, sans-serif";
  context.fillText(data.source, margin, y);
  y += 78;

  context.fillStyle = "#17211c";
  context.font = "400 39px Inter, Arial, sans-serif";
  y = drawWrappedText(context, data.summary, margin, y, contentWidth, 52) + 72;

  context.fillStyle = "#66736d";
  context.font = "800 24px Inter, Arial, sans-serif";
  context.fillText("EVIDENCE", margin, y);
  y += 34;
  y = drawBulletList(context, data.evidence, margin, y, contentWidth, colors.accent) + 52;

  context.fillStyle = "#66736d";
  context.font = "800 24px Inter, Arial, sans-serif";
  context.fillText("RISKS", margin, y);
  y += 34;
  y = drawBulletList(context, data.risks, margin, y, contentWidth, colors.accent) + 52;

  context.fillStyle = "#17211c";
  drawRoundRect(context, margin, y, contentWidth, 190, 18);
  context.fillStyle = "rgba(255,255,255,0.66)";
  context.font = "800 22px Inter, Arial, sans-serif";
  context.fillText("NEXT", margin + 30, y + 48);
  context.fillStyle = "#ffffff";
  context.font = "700 32px Inter, Arial, sans-serif";
  drawWrappedText(context, data.next, margin + 30, y + 96, contentWidth - 60, 42);

  return canvas;
}

async function exportPng() {
  const data = cardData();
  const canvas = renderPngCanvas(data);
  const link = document.createElement("a");
  link.download = `${data.mode.toLowerCase()}-research-card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("PNG exported");
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", render);
});

document.querySelectorAll("[data-sample]").forEach((button) => {
  button.addEventListener("click", () => loadSample(button.dataset.sample));
});

document.querySelector("#copyMarkdown").addEventListener("click", copyMarkdown);
document.querySelector("#exportPng").addEventListener("click", exportPng);

render();
