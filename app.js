const fields = {
  mode: document.querySelector("#mode"),
  confidence: document.querySelector("#confidence"),
  title: document.querySelector("#title"),
  source: document.querySelector("#source"),
  summary: document.querySelector("#summary"),
  evidence: document.querySelector("#evidence"),
  risks: document.querySelector("#risks"),
  next: document.querySelector("#next")
};

const preview = {
  card: document.querySelector("#cardPreview"),
  mode: document.querySelector("#cardMode"),
  confidence: document.querySelector("#cardConfidence"),
  title: document.querySelector("#cardTitle"),
  source: document.querySelector("#cardSource"),
  summary: document.querySelector("#cardSummary"),
  evidence: document.querySelector("#cardEvidence"),
  risks: document.querySelector("#cardRisks"),
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

function render() {
  const data = cardData();
  const theme = data.mode.toLowerCase();

  preview.card.className = `research-card theme-${theme}`;
  preview.mode.textContent = data.mode;
  preview.confidence.textContent = data.confidence;
  preview.title.textContent = data.title;
  preview.source.textContent = data.source;
  preview.summary.textContent = data.summary;
  preview.next.textContent = data.next;
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
  const evidence = data.evidence.map((item) => `- ${item}`).join("\n");
  const risks = data.risks.map((item) => `- ${item}`).join("\n");

  return `# ${data.title}

Mode: ${data.mode}
Source: ${data.source}
Confidence: ${data.confidence}

## Conclusion

${data.summary}

## Evidence

${evidence}

## Risks

${risks}

## Next Step

${data.next}
`;
}

async function copyMarkdown() {
  await navigator.clipboard.writeText(markdown());
  const toast = document.querySelector("#toast");
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 1200);
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", render);
});

document.querySelectorAll("[data-sample]").forEach((button) => {
  button.addEventListener("click", () => loadSample(button.dataset.sample));
});

document.querySelector("#copyMarkdown").addEventListener("click", copyMarkdown);

render();
