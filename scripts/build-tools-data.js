const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const toolsDir = path.join(__dirname, "..", "src", "tools", "items");
const outDir = path.join(__dirname, "..", "netlify", "functions", "_data");
const outFile = path.join(outDir, "tools.json");

fs.mkdirSync(outDir, { recursive: true });

const files = fs.existsSync(toolsDir)
  ? fs.readdirSync(toolsDir).filter((f) => f.endsWith(".md"))
  : [];

const tools = {};
for (const file of files) {
  const raw = fs.readFileSync(path.join(toolsDir, file), "utf8");
  const { data } = matter(raw);
  if (data.slug && data.embedUrl) {
    tools[data.slug] = { embedUrl: data.embedUrl, name: data.name || data.slug };
  }
}

fs.writeFileSync(outFile, JSON.stringify(tools, null, 2));
console.log(`[build-tools-data] wrote ${Object.keys(tools).length} tool(s) to ${outFile}`);
