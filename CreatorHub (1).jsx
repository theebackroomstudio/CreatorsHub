import { useState, useRef, useEffect } from "react";

const API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

async function callAI(prompt, onChunk) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        try {
          const json = JSON.parse(line.slice(6));
          if (json.type === "content_block_delta" && json.delta?.text) {
            full += json.delta.text;
            onChunk(full);
          }
        } catch {}
      }
    }
    return full;
  } catch (e) {
    const msg = "Error reaching AI. Please try again.";
    onChunk(msg);
    return msg;
  }
}

const TOOLS = [
  { id: "email", icon: "✉", label: "Email Builder", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "ig", icon: "◈", label: "IG Planner", color: "#DB2777", bg: "#FCE7F3" },
  { id: "carousel", icon: "⧉", label: "Carousel", color: "#0891B2", bg: "#CFFAFE" },
  { id: "content", icon: "◷", label: "Content Plan", color: "#059669", bg: "#D1FAE5" },
  { id: "video", icon: "▶", label: "Video Editor", color: "#D97706", bg: "#FEF3C7" },
  { id: "edu", icon: "◎", label: "Education", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "sales", icon: "◆", label: "Sales Tools", color: "#DC2626", bg: "#FEE2E2" },
  { id: "biz", icon: "⬡", label: "Business", color: "#374151", bg: "#F3F4F6" },
];

// ── Shared components ──────────────────────────────────────────────────────────

function OutputBox({ text, loading, placeholder }) {
  return (
    <div style={{
      background: "#0f0f0f", borderRadius: 12, padding: "16px 18px",
      minHeight: 160, fontFamily: "'DM Mono', monospace", fontSize: 13,
      color: loading ? "#6b7280" : "#e5e7eb", lineHeight: 1.7,
      whiteSpace: "pre-wrap", border: "1px solid #1f1f1f", position: "relative",
    }}>
      {loading && (
        <span style={{
          display: "inline-block", width: 8, height: 8, borderRadius: "50%",
          background: "#7C3AED", marginRight: 8, animation: "pulse 1s infinite",
        }} />
      )}
      {text || <span style={{ color: "#374151" }}>{placeholder}</span>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, style }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "9px 12px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 13, color: "#e5e7eb", fontFamily: "inherit", outline: "none", boxSizing: "border-box", ...style }}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", padding: "9px 12px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 13, color: "#e5e7eb", fontFamily: "inherit", outline: "none" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", padding: "9px 12px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 13, color: "#e5e7eb", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
    />
  );
}

function Chips({ options, multi, value, onChange }) {
  const toggle = (o) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(o) ? arr.filter(x => x !== o) : [...arr, o]);
    } else {
      onChange(o);
    }
  };
  const isSelected = (o) => multi ? (Array.isArray(value) && value.includes(o)) : value === o;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map(o => (
        <button key={o} onClick={() => toggle(o)} style={{
          padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
          fontFamily: "inherit", transition: "all 0.15s",
          background: isSelected(o) ? "#7C3AED" : "#1a1a1a",
          border: `1px solid ${isSelected(o) ? "#7C3AED" : "#2a2a2a"}`,
          color: isSelected(o) ? "#fff" : "#9ca3af",
        }}>{o}</button>
      ))}
    </div>
  );
}

function GenBtn({ onClick, loading, label = "✦ Generate", color = "#7C3AED" }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      padding: "10px 20px", background: loading ? "#1f1f1f" : color,
      border: "none", borderRadius: 8, color: loading ? "#4b5563" : "#fff",
      fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
      fontFamily: "inherit", letterSpacing: "0.02em", transition: "all 0.2s",
    }}>
      {loading ? "Generating…" : label}
    </button>
  );
}

function Panel({ children, style }) {
  return (
    <div style={{ background: "#161616", border: "1px solid #1f1f1f", borderRadius: 14, padding: "20px 22px", ...style }}>
      {children}
    </div>
  );
}

function PanelTitle({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{children}</div>;
}

// ── Tool pages ─────────────────────────────────────────────────────────────────

function EmailTool() {
  const [name, setName] = useState("Summer Drop");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Bold");
  const [cta, setCta] = useState("Shop Now");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("hero");

  const sections = [
    { id: "header", label: "Header / Nav" },
    { id: "hero", label: "Hero Section" },
    { id: "body", label: "Body Copy" },
    { id: "cta", label: "Call to Action" },
    { id: "footer", label: "Footer" },
  ];

  const generate = async () => {
    setLoading(true);
    await callAI(
      `Write a complete ${selected} section for a marketing email. Campaign: "${name}". Tone: ${tone}. CTA text: "${cta}". Subject line context: "${subject}". Make it punchy and conversion-focused. Return only the copy, no labels.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  const fullEmail = async () => {
    setLoading(true);
    await callAI(
      `Write a full marketing email for campaign "${name}". Subject: "${subject || name}". Tone: ${tone}. CTA: "${cta}". Include: header, hero headline + subhead, 2-paragraph body, feature list, strong CTA section, footer. Label each section clearly.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Campaign Settings</PanelTitle>
          <Field label="Campaign Name"><Input value={name} onChange={setName} placeholder="Summer Drop" /></Field>
          <Field label="Subject Line"><Input value={subject} onChange={setSubject} placeholder="🔥 You don't want to miss this..." /></Field>
          <Field label="Tone"><Chips options={["Professional", "Bold", "Friendly", "Luxe", "Minimal"]} value={tone} onChange={setTone} /></Field>
          <Field label="CTA Text"><Input value={cta} onChange={setCta} placeholder="Shop Now" /></Field>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <GenBtn onClick={fullEmail} loading={loading} label="✦ Full Email" />
            <button onClick={generate} disabled={loading} style={{ padding: "10px 16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Section only
            </button>
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Build by Section</PanelTitle>
          {sections.map(s => (
            <div key={s.id} onClick={() => setSelected(s.id)} style={{
              padding: "10px 14px", borderRadius: 8, marginBottom: 6, cursor: "pointer",
              background: selected === s.id ? "#1e1433" : "#111",
              border: `1px solid ${selected === s.id ? "#7C3AED" : "#1f1f1f"}`,
              color: selected === s.id ? "#c4b5fd" : "#6b7280", fontSize: 13,
              transition: "all 0.15s",
            }}>
              {s.label}
            </div>
          ))}
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Output</PanelTitle>
        <OutputBox text={output} loading={loading} placeholder="Your email copy will stream here…" />
        {output && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => navigator.clipboard.writeText(output)} style={{ padding: "7px 14px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Copy</button>
            <button onClick={() => { setOutput(""); }} style={{ padding: "7px 14px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
          </div>
        )}
      </Panel>
    </div>
  );
}

function IGTool() {
  const [niche, setNiche] = useState("Lifestyle");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Engaging");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [gridLabels, setGridLabels] = useState(["Product", "Quote", "Lifestyle", "Tutorial", "BTS", "Collab", "Promo", "Personal", "Tip"]);
  const [editCell, setEditCell] = useState(null);

  const colors = ["#1e1433", "#1a2e1e", "#1a2535", "#2a1a1a", "#1e1a2e", "#1a2520", "#2a2215", "#1e1e1e", "#1a1a2a"];

  const generate = async () => {
    setLoading(true);
    await callAI(
      `Write an Instagram caption for a ${niche} creator about: "${topic || "daily life"}". Style: ${style}. Include a hook, 2-3 sentences of body, a CTA, line break, then 15 relevant hashtags. Format the hashtags on their own line.`,
      (t) => setCaption(t)
    );
    setLoading(false);
  };

  const bulk = async () => {
    setLoading(true);
    await callAI(
      `Generate 9 Instagram captions for a ${niche} creator — one for each content type: Product, Quote, Lifestyle, Tutorial, BTS, Collab, Promo, Personal, Tip. Each caption: hook + 2 sentences + CTA + 5 hashtags. Label each clearly.`,
      (t) => setCaption(t)
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Grid Preview</PanelTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
            {gridLabels.map((label, i) => (
              <div key={i} onClick={() => setEditCell(i)} style={{
                aspectRatio: "1", background: colors[i], borderRadius: 6,
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", cursor: "pointer", position: "relative",
                border: editCell === i ? "1px solid #7C3AED" : "1px solid #1f1f1f",
                transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 10, color: "#4b5563", position: "absolute", top: 5, left: 6 }}>{9 - i}</div>
                {editCell === i ? (
                  <input autoFocus value={label} onChange={e => { const l = [...gridLabels]; l[i] = e.target.value; setGridLabels(l); }}
                    onBlur={() => setEditCell(null)}
                    style={{ width: "80%", background: "transparent", border: "none", textAlign: "center", fontSize: 11, color: "#c4b5fd", fontFamily: "inherit", outline: "none" }} />
                ) : (
                  <div style={{ fontSize: 11, color: "#6b7280", textAlign: "center", padding: "0 4px" }}>{label}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: "#4b5563" }}>Click any cell to edit the label</div>
        </Panel>

        <Panel>
          <PanelTitle>Caption Generator</PanelTitle>
          <Field label="Niche"><Select value={niche} onChange={setNiche} options={["Lifestyle", "Fashion", "Fitness", "Food", "Business", "Travel", "Beauty", "Tech", "Finance"]} /></Field>
          <Field label="Post Topic"><Textarea value={topic} onChange={setTopic} placeholder="Describe what this post is about…" rows={3} /></Field>
          <Field label="Style"><Chips options={["Engaging", "Storytelling", "Minimal", "CTA-driven", "Educational"]} value={style} onChange={setStyle} /></Field>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <GenBtn onClick={generate} loading={loading} label="✦ Write Caption" />
            <button onClick={bulk} disabled={loading} style={{ padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>All 9 captions</button>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Caption Output</PanelTitle>
        <OutputBox text={caption} loading={loading} placeholder="Your AI-written caption + hashtags will appear here…" />
        {caption && (
          <button onClick={() => navigator.clipboard.writeText(caption)} style={{ marginTop: 10, padding: "7px 14px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Copy</button>
        )}
      </Panel>
    </div>
  );
}

function CarouselTool() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [count, setCount] = useState(6);
  const [style, setStyle] = useState("Educational");
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editH, setEditH] = useState("");
  const [editB, setEditB] = useState("");

  const generate = async () => {
    setLoading(true);
    let raw = "";
    await callAI(
      `Create a ${count}-slide ${style} carousel about "${topic || "content creation tips"}" for ${platform}. For each slide respond EXACTLY in this format with no extra text:\n\nSLIDE 1\nHeadline: [5-8 word headline]\nBody: [1-2 sentence body max]\n\nRepeat for all ${count} slides.`,
      (t) => { raw = t; }
    );
    const parsed = [];
    const blocks = raw.split(/SLIDE \d+/i).filter(Boolean);
    for (const block of blocks) {
      const hMatch = block.match(/Headline:\s*(.+)/i);
      const bMatch = block.match(/Body:\s*([\s\S]+?)(?=Headline:|$)/i);
      if (hMatch) parsed.push({ headline: hMatch[1].trim(), body: bMatch ? bMatch[1].trim() : "" });
    }
    if (parsed.length > 0) {
      setSlides(parsed);
      setCurrent(0);
      setEditH(parsed[0].headline);
      setEditB(parsed[0].body);
    }
    setLoading(false);
  };

  const goTo = (i) => {
    if (slides.length === 0) return;
    const updated = [...slides];
    updated[current] = { headline: editH, body: editB };
    setSlides(updated);
    setCurrent(i);
    setEditH(updated[i].headline);
    setEditB(updated[i].body);
  };

  const applyEdit = () => {
    const updated = [...slides];
    updated[current] = { headline: editH, body: editB };
    setSlides(updated);
  };

  const rewrite = async () => {
    if (!slides[current]) return;
    setLoading(true);
    await callAI(
      `Rewrite this carousel slide to be more compelling:\nHeadline: ${slides[current].headline}\nBody: ${slides[current].body}\nReturn ONLY:\nHeadline: [new]\nBody: [new]`,
      (t) => {
        const hMatch = t.match(/Headline:\s*(.+)/i);
        const bMatch = t.match(/Body:\s*([\s\S]+)/i);
        if (hMatch) setEditH(hMatch[1].trim());
        if (bMatch) setEditB(bMatch[1].trim());
      }
    );
    setLoading(false);
  };

  const slide = slides[current];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Carousel Settings</PanelTitle>
          <Field label="Topic"><Input value={topic} onChange={setTopic} placeholder="e.g. 5 habits of top creators" /></Field>
          <Field label="Platform"><Chips options={["Instagram", "LinkedIn", "Pinterest", "Twitter/X"]} value={platform} onChange={setPlatform} /></Field>
          <Field label={`Slides: ${count}`}>
            <input type="range" min={3} max={10} value={count} onChange={e => setCount(+e.target.value)}
              style={{ width: "100%", accentColor: "#7C3AED" }} />
          </Field>
          <Field label="Style"><Chips options={["Educational", "Listicle", "Story", "Tutorial", "Motivational"]} value={style} onChange={setStyle} /></Field>
          <GenBtn onClick={generate} loading={loading} label="✦ Generate Slides" />
        </Panel>

        {slides.length > 0 && (
          <Panel>
            <PanelTitle>Edit Slide {current + 1}</PanelTitle>
            <Field label="Headline"><Input value={editH} onChange={setEditH} placeholder="Slide headline" /></Field>
            <Field label="Body"><Textarea value={editB} onChange={setEditB} placeholder="Body copy…" rows={3} /></Field>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={applyEdit} style={{ padding: "8px 14px", background: "#7C3AED", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Apply</button>
              <button onClick={rewrite} disabled={loading} style={{ padding: "8px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>✦ AI Rewrite</button>
            </div>
          </Panel>
        )}
      </div>

      <Panel>
        <PanelTitle>Preview</PanelTitle>
        <div style={{
          background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: 12,
          minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "32px 24px", textAlign: "center", marginBottom: 14,
        }}>
          {slides.length === 0 ? (
            <div style={{ color: "#374151", fontSize: 13 }}>Generate slides to preview here</div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 12, letterSpacing: "0.1em" }}>SLIDE {current + 1} / {slides.length}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb", marginBottom: 12, lineHeight: 1.3 }}>{slide?.headline}</div>
              <div style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.6 }}>{slide?.body}</div>
            </>
          )}
        </div>

        {slides.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
              {slides.map((_, i) => (
                <div key={i} onClick={() => goTo(i)} style={{
                  width: i === current ? 20 : 7, height: 7, borderRadius: 4,
                  background: i === current ? "#7C3AED" : "#2a2a2a",
                  cursor: "pointer", transition: "all 0.2s",
                }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => goTo(Math.max(0, current - 1))} style={{ padding: "8px 16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>← Prev</button>
              <button onClick={() => goTo(Math.min(slides.length - 1, current + 1))} style={{ padding: "8px 16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

function ContentTool() {
  const [niche, setNiche] = useState("");
  const [platforms, setPlatforms] = useState(["Instagram", "TikTok"]);
  const [timeframe, setTimeframe] = useState("1 month");
  const [pillars, setPillars] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    await callAI(
      `Create a detailed content calendar for a ${niche || "creator"} posting on: ${platforms.join(", ")}. Timeframe: ${timeframe}. Content pillars: ${pillars || "Education, Entertainment, Promotion, Personal"}. For each week, provide 5 specific post ideas with: Platform | Format | Topic | Day to post | Hook idea. Make ideas specific and creative, not generic.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Calendar Settings</PanelTitle>
          <Field label="Your Niche / Brand"><Input value={niche} onChange={setNiche} placeholder="e.g. Fitness coach, Food blogger" /></Field>
          <Field label="Platforms">
            <Chips multi options={["Instagram", "TikTok", "YouTube", "LinkedIn", "Twitter/X", "Newsletter", "Pinterest"]} value={platforms} onChange={setPlatforms} />
          </Field>
          <Field label="Timeframe"><Chips options={["1 week", "2 weeks", "1 month", "3 months"]} value={timeframe} onChange={setTimeframe} /></Field>
          <Field label="Content Pillars"><Input value={pillars} onChange={setPillars} placeholder="e.g. Education, BTS, Motivation, Promos" /></Field>
          <GenBtn onClick={generate} loading={loading} label="✦ Build Calendar" color="#059669" />
        </Panel>
      </div>
      <Panel>
        <PanelTitle>Content Calendar</PanelTitle>
        <OutputBox text={output} loading={loading} placeholder="Your full content calendar with post ideas, formats, and posting schedule will stream here…" />
      </Panel>
    </div>
  );
}

function VideoTool() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("Short-form Reel");
  const [hook, setHook] = useState("Bold claim");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const clips = [
    { label: "Hook", pct: 12, color: "#7C3AED" },
    { label: "Intro", pct: 10, color: "#0891B2" },
    { label: "Main", pct: 45, color: "#059669" },
    { label: "Proof", pct: 23, color: "#D97706" },
    { label: "CTA", pct: 10, color: "#DC2626" },
  ];

  const generate = async () => {
    setLoading(true);
    await callAI(
      `Write a complete video script for: "${topic || "content creation tips"}". Type: ${type}. Hook style: ${hook}.\n\nStructure:\n[HOOK] First 3-5 seconds\n[INTRO] Brief setup\n[POINT 1], [POINT 2], [POINT 3] Main value\n[PROOF] Story or example\n[CTA] Strong close\n\nUse [B-ROLL: description] markers for visual cues. Keep it punchy and conversational. Include estimated timestamps.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  const scriptOnly = async () => {
    setLoading(true);
    await callAI(
      `Write just the hook (first 5 seconds) for a ${type} about "${topic || "content tips"}". Hook style: ${hook}. Write 3 different hook options.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Script Generator</PanelTitle>
          <Field label="Video Topic"><Input value={topic} onChange={setTopic} placeholder="e.g. How I grew to 100k in 90 days" /></Field>
          <Field label="Video Type"><Select value={type} onChange={setType} options={["Short-form Reel", "TikTok", "YouTube (5-10 min)", "YouTube long-form", "Talking head", "Tutorial", "Vlog"]} /></Field>
          <Field label="Hook Style"><Chips options={["Bold claim", "Question", "Story", "Shocking stat", "Controversy"]} value={hook} onChange={setHook} /></Field>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <GenBtn onClick={generate} loading={loading} label="✦ Full Script" color="#D97706" />
            <button onClick={scriptOnly} disabled={loading} style={{ padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>3 Hooks</button>
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Timeline</PanelTitle>
          <div style={{ background: "#0f0f0f", borderRadius: 8, padding: 12, overflow: "hidden" }}>
            <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>VIDEO TRACK</div>
            <div style={{ display: "flex", height: 32, borderRadius: 6, overflow: "hidden", gap: 2 }}>
              {clips.map((c, i) => (
                <div key={i} style={{ width: `${c.pct}%`, background: c.color + "33", border: `1px solid ${c.color}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, color: c.color, fontWeight: 600 }}>{c.label}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#4b5563", marginTop: 8, marginBottom: 4 }}>AUDIO</div>
            <div style={{ height: 20, borderRadius: 4, background: "#1f1f2e", display: "flex", alignItems: "center", paddingLeft: 8 }}>
              <span style={{ fontSize: 10, color: "#4b5563" }}>Background music (full)</span>
            </div>
          </div>
          {output && <div style={{ marginTop: 10, fontSize: 11, color: "#4b5563" }}>{output.split(" ").length} words · ~{Math.round(output.split(" ").length / 130)} min read</div>}
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Script Output</PanelTitle>
        <OutputBox text={output} loading={loading} placeholder="Your full video script will stream here with section labels, B-roll markers, and timing guides…" />
        {output && (
          <button onClick={() => navigator.clipboard.writeText(output)} style={{ marginTop: 10, padding: "7px 14px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Copy Script</button>
        )}
      </Panel>
    </div>
  );
}

function EduTool() {
  const [mode, setMode] = useState("course");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("Online video course");
  const [modules, setModules] = useState(6);
  const [diff, setDiff] = useState("Beginner");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCourse = async () => {
    setLoading(true);
    await callAI(
      `Create a ${modules}-module ${format} curriculum for: "${topic}". Audience: ${audience || "general learners"}. For each module include: Module title, 3 learning objectives, 4-5 lesson topics, one practical assignment. Make it actionable.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  const generateQuiz = async () => {
    setLoading(true);
    await callAI(
      `Create a 10-question multiple choice quiz on "${topic}" at ${diff} level. Format:\nQ1. [Question]\nA) [option] B) [option] C) [option] D) [option]\nAnswer: [letter] — [brief explanation]\n\nNumber 1-10.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  const generateLesson = async () => {
    setLoading(true);
    await callAI(
      `Write a detailed lesson plan on "${topic}" for ${audience || "general learners"}. Include: Learning objectives, Materials needed, Introduction hook (5 min), Main content (20 min with activities), Practice exercise, Summary, Homework.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Mode</PanelTitle>
          {[["course", "Course Outline"], ["quiz", "Quiz Builder"], ["lesson", "Lesson Plan"]].map(([id, label]) => (
            <div key={id} onClick={() => setMode(id)} style={{
              padding: "10px 14px", borderRadius: 8, marginBottom: 6, cursor: "pointer",
              background: mode === id ? "#1e1433" : "#111",
              border: `1px solid ${mode === id ? "#7C3AED" : "#1f1f1f"}`,
              color: mode === id ? "#c4b5fd" : "#6b7280", fontSize: 13, transition: "all 0.15s",
            }}>{label}</div>
          ))}
        </Panel>

        <Panel>
          <PanelTitle>Settings</PanelTitle>
          <Field label="Topic"><Input value={topic} onChange={setTopic} placeholder="e.g. Social media marketing" /></Field>
          {mode !== "quiz" && <Field label="Target Audience"><Input value={audience} onChange={setAudience} placeholder="e.g. Small business owners" /></Field>}
          {mode === "course" && (
            <>
              <Field label="Format"><Select value={format} onChange={setFormat} options={["Online video course", "Workshop", "eBook", "Email course", "Webinar series"]} /></Field>
              <Field label={`Modules: ${modules}`}>
                <input type="range" min={3} max={12} value={modules} onChange={e => setModules(+e.target.value)} style={{ width: "100%", accentColor: "#7C3AED" }} />
              </Field>
            </>
          )}
          {mode === "quiz" && <Field label="Difficulty"><Chips options={["Beginner", "Intermediate", "Advanced"]} value={diff} onChange={setDiff} /></Field>}
          <GenBtn onClick={mode === "course" ? generateCourse : mode === "quiz" ? generateQuiz : generateLesson} loading={loading}
            label={mode === "course" ? "✦ Build Outline" : mode === "quiz" ? "✦ Generate Quiz" : "✦ Create Lesson"} />
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Output</PanelTitle>
        <OutputBox text={output} loading={loading} placeholder="Your course outline, quiz, or lesson plan will stream here…" />
      </Panel>
    </div>
  );
}

function SalesTool() {
  const [mode, setMode] = useState("salespage");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [target, setTarget] = useState("");
  const [outcome, setOutcome] = useState("");
  const [section, setSection] = useState("Full sales page");
  const [dmType, setDmType] = useState("Cold DM intro");
  const [offer, setOffer] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSales = async () => {
    setLoading(true);
    await callAI(
      `Write ${section} for: "${product || "coaching program"}" priced at ${price || "$997"}. Audience: ${target || "entrepreneurs"}. Transformation: "${outcome || "scale their business"}". Use AIDA/PAS frameworks. Make it compelling and conversion-focused.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  const generateDM = async () => {
    setLoading(true);
    await callAI(
      `Write a ${dmType} message for someone who ${offer || "helps creators grow online"}. Under 120 words. Sound genuine, not salesy. Soft CTA at end. Include 2 variations.`,
      (t) => setOutput(t)
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Mode</PanelTitle>
          {[["salespage", "Sales Page"], ["dm", "DM / Pitch Scripts"], ["objection", "Objection Handlers"]].map(([id, label]) => (
            <div key={id} onClick={() => setMode(id)} style={{
              padding: "10px 14px", borderRadius: 8, marginBottom: 6, cursor: "pointer",
              background: mode === id ? "#2a1a1a" : "#111",
              border: `1px solid ${mode === id ? "#DC2626" : "#1f1f1f"}`,
              color: mode === id ? "#fca5a5" : "#6b7280", fontSize: 13, transition: "all 0.15s",
            }}>{label}</div>
          ))}
        </Panel>

        <Panel>
          <PanelTitle>Settings</PanelTitle>
          {mode === "salespage" && (
            <>
              <Field label="Product / Offer"><Input value={product} onChange={setProduct} placeholder="e.g. 1:1 Coaching Program" /></Field>
              <Field label="Price"><Input value={price} onChange={setPrice} placeholder="e.g. $997 or $97/mo" /></Field>
              <Field label="Target Customer"><Input value={target} onChange={setTarget} placeholder="e.g. Aspiring coaches" /></Field>
              <Field label="Outcome / Transformation"><Input value={outcome} onChange={setOutcome} placeholder="e.g. 10k followers in 60 days" /></Field>
              <Field label="Section">
                <Select value={section} onChange={setSection} options={["Full sales page", "Headline only", "Hero section", "Benefits", "FAQ", "Pricing + CTA"]} />
              </Field>
              <GenBtn onClick={generateSales} loading={loading} label="✦ Write Copy" color="#DC2626" />
            </>
          )}
          {mode === "dm" && (
            <>
              <Field label="Script Type"><Select value={dmType} onChange={setDmType} options={["Cold DM intro", "Follow-up", "Discovery call invite", "Partnership pitch", "Collaboration ask"]} /></Field>
              <Field label="Your Offer in One Line"><Input value={offer} onChange={setOffer} placeholder="e.g. I help coaches get clients from IG" /></Field>
              <GenBtn onClick={generateDM} loading={loading} label="✦ Write Script" color="#DC2626" />
            </>
          )}
          {mode === "objection" && (
            <>
              <Field label="Your Offer"><Input value={product} onChange={setProduct} placeholder="e.g. $1,500 brand deal package" /></Field>
              <Field label="Common Objection"><Input value={target} onChange={setTarget} placeholder="e.g. 'I don't have the budget'" /></Field>
              <GenBtn onClick={async () => { setLoading(true); await callAI(`Write 3 professional objection handler responses for the objection: "${target || "I don't have the budget"}" for offer: "${product || "coaching program"}". Each response should acknowledge, reframe, and ask a closing question.`, t => setOutput(t)); setLoading(false); }} loading={loading} label="✦ Handle Objection" color="#DC2626" />
            </>
          )}
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Copy Output</PanelTitle>
        <OutputBox text={output} loading={loading} placeholder="Your sales copy, DM script, or objection handlers will stream here…" />
        {output && (
          <button onClick={() => navigator.clipboard.writeText(output)} style={{ marginTop: 10, padding: "7px 14px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Copy</button>
        )}
      </Panel>
    </div>
  );
}

function BizTool() {
  const [mode, setMode] = useState("bio");
  const [f, setF] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setF(prev => ({ ...prev, [key]: val }));

  const prompts = {
    bio: () => `Write a creator bio for: name/handle "${f.name || "@creator"}", niche "${f.niche || "content creation"}", platforms "${f.platforms || "IG, TikTok"}". Tone: ${f.tone || "Professional"}. Provide: 1-line bio, 3-line bio, full About section, and 3 headline variations.`,
    strategy: () => `Create a 90-day growth strategy for a ${f.niche || "content"} creator currently at ${f.followers || "1,000"} followers wanting to reach ${f.goal || "10,000"} on ${f.platform || "Instagram"}. Include: content strategy, posting schedule, engagement tactics, monetization roadmap, 30/60/90 day milestones.`,
    invoice: () => `Generate a professional freelance invoice. Client: ${f.client || "Client Name"}. Service: ${f.service || "Content creation"}. Amount: ${f.amount || "$500"}. Due: ${f.due || "Net 30"}. Include all standard invoice fields formatted professionally.`,
    contract: () => `Write a ${f.type || "Brand deal"} freelance contract template. Your name: ${f.yourname || "[Your Name]"}. Deliverables: ${f.deliverables || "3 Reels + stories"}. Include: scope, deliverables, payment terms, revision policy, usage rights, IP clauses, termination clause.`,
    mediakit: () => `Write media kit copy for creator "${f.name || "[Name]"}", niche: ${f.niche || "lifestyle"}, audience size: ${f.size || "10k"}, engagement rate: ${f.eng || "5%"}. Include: about section, audience breakdown, brand partnership benefits, collaboration packages with pricing tiers.`,
    pitch: () => `Write a brand partnership pitch email from a ${f.niche || "lifestyle"} creator pitching ${f.brand || "a brand"}. Offer: ${f.offer || "2 Reels + story set"}. Include subject line, personal opening, value proposition, specific proposal, metrics/social proof hook, and CTA.`,
  };

  const forms = {
    bio: [["Name / Handle", "name", "@yourhandle"], ["Niche", "niche", "e.g. Fitness & Wellness"], ["Platforms", "platforms", "IG, TikTok, YouTube"], ["Tone", "tone", null, ["Professional", "Casual", "Bold", "Funny", "Luxe"]]],
    strategy: [["Current Followers", "followers", "e.g. 2,500"], ["Goal", "goal", "e.g. 50k in 6 months"], ["Niche", "niche", "e.g. Fitness coach"], ["Platform", "platform", null, ["Instagram", "TikTok", "YouTube", "LinkedIn"]]],
    invoice: [["Client Name", "client", ""], ["Service Description", "service", "e.g. UGC package — 5 videos"], ["Amount", "amount", "e.g. $1,500"], ["Due Date", "due", "e.g. Net 30"]],
    contract: [["Contract Type", "type", null, ["Brand deal", "UGC", "Consulting", "Coaching"]], ["Your Name / Business", "yourname", ""], ["Deliverables", "deliverables", "e.g. 3 Reels + 5 story frames"]],
    mediakit: [["Creator Name", "name", ""], ["Niche", "niche", ""], ["Audience Size", "size", "e.g. 15k IG / 30k TikTok"], ["Engagement Rate", "eng", "e.g. 6.2%"]],
    pitch: [["Your Niche", "niche", ""], ["Brand You're Pitching", "brand", ""], ["What You're Offering", "offer", "e.g. 2 Reels + IG stories"]],
  };

  const generate = async () => {
    setLoading(true);
    await callAI(prompts[mode](), t => setOutput(t));
    setLoading(false);
  };

  const modeList = [["bio", "Creator Bio"], ["strategy", "Growth Strategy"], ["invoice", "Invoice"], ["contract", "Contract"], ["mediakit", "Media Kit"], ["pitch", "Brand Pitch"]];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel>
          <PanelTitle>Document Type</PanelTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {modeList.map(([id, label]) => (
              <div key={id} onClick={() => { setMode(id); setF({}); setOutput(""); }} style={{
                padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                background: mode === id ? "#1a1f1a" : "#111",
                border: `1px solid ${mode === id ? "#059669" : "#1f1f1f"}`,
                color: mode === id ? "#6ee7b7" : "#6b7280", fontSize: 12,
                textAlign: "center", transition: "all 0.15s",
              }}>{label}</div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelTitle>{modeList.find(([id]) => id === mode)?.[1]} Details</PanelTitle>
          {(forms[mode] || []).map(([label, key, placeholder, options]) => (
            <Field key={key} label={label}>
              {options ? <Select value={f[key] || options[0]} onChange={v => set(key, v)} options={options} /> : <Input value={f[key] || ""} onChange={v => set(key, v)} placeholder={placeholder} />}
            </Field>
          ))}
          <GenBtn onClick={generate} loading={loading} label="✦ Generate Document" color="#059669" />
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Document Output</PanelTitle>
        <OutputBox text={output} loading={loading} placeholder="Your business document will stream here — bios, contracts, invoices, media kits, and more…" />
        {output && (
          <button onClick={() => navigator.clipboard.writeText(output)} style={{ marginTop: 10, padding: "7px 14px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Copy</button>
        )}
      </Panel>
    </div>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────────

function Home({ onNav }) {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "32px 0 40px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#4b5563", marginBottom: 16, textTransform: "uppercase" }}>The Creator Platform</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#f9fafb", margin: "0 0 14px", lineHeight: 1.1, fontFamily: "'Syne', sans-serif" }}>
          Every tool you need.<br /><span style={{ color: "#7C3AED" }}>All in one place.</span>
        </h1>
        <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 480, margin: "0 auto 32px" }}>
          AI-powered tools built for creators. Emails, carousels, scripts, sales pages — generate in seconds, publish anywhere.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => onNav("email")} style={{ padding: "12px 28px", background: "#7C3AED", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start creating →</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {TOOLS.map(t => (
          <div key={t.id} onClick={() => onNav(t.id)} style={{
            background: "#161616", border: "1px solid #1f1f1f", borderRadius: 12,
            padding: "18px 16px", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.background = "#1a1a1a"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.background = "#161616"; }}
          >
            <div style={{ fontSize: 22, marginBottom: 10, color: t.color }}>{t.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e5e7eb", marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>AI-powered · Free to use</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App shell ─────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("home");

  const toolMap = {
    home: <Home onNav={setActive} />,
    email: <EmailTool />,
    ig: <IGTool />,
    carousel: <CarouselTool />,
    content: <ContentTool />,
    video: <VideoTool />,
    edu: <EduTool />,
    sales: <SalesTool />,
    biz: <BizTool />,
  };

  const activeToolMeta = TOOLS.find(t => t.id === active);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#e5e7eb" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        input::placeholder,textarea::placeholder { color:#374151; }
        select option { background:#111; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#0a0a0a; } ::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:2px; }
      `}</style>

      {/* Nav */}
      <div style={{ background: "#0f0f0f", borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", gap: 4, height: 52, overflowX: "auto" }}>
        <button onClick={() => setActive("home")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", fontFamily: "inherit", fontSize: 15, fontWeight: 700, marginRight: 16, whiteSpace: "nowrap" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C3AED" }} /> CreatorHub
        </button>
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: "6px 14px", borderRadius: 8, background: active === t.id ? "#1a1a1a" : "transparent",
            border: active === t.id ? `1px solid ${t.color}44` : "1px solid transparent",
            color: active === t.id ? t.color : "#4b5563", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
        {active !== "home" && (
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20, color: activeToolMeta?.color }}>{activeToolMeta?.icon}</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f9fafb", margin: 0, fontFamily: "'Syne', sans-serif" }}>{activeToolMeta?.label}</h2>
          </div>
        )}
        {toolMap[active]}
      </div>
    </div>
  );
}
