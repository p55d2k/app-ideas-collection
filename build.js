const fs = require("fs");
const path = require("path");

const appsDir = path.join(__dirname, "apps");
const indexPath = path.join(__dirname, "index.html");

// Read the current index.html
let indexContent = fs.readFileSync(indexPath, "utf8");

// Find the apps section
const appsStart = "<!-- APP_LINKS_START -->";
const appsEnd = "<!-- APP_LINKS_END -->";

if (!indexContent.includes(appsStart) || !indexContent.includes(appsEnd)) {
  console.log(
    "Please add <!-- APP_LINKS_START --> and <!-- APP_LINKS_END --> in index.html around the app links."
  );
  process.exit(1);
}

// Get list of apps
const apps = fs
  .readdirSync(appsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((app) => fs.existsSync(path.join(appsDir, app, "index.html")));

// Generate HTML for each app
const appLinks = apps
  .map((app) => {
    const appPath = path.join(appsDir, app);
    let title = app.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    let description = `Explore the ${title} app.`;

    // Check for meta.json
    const metaPath = path.join(appPath, "meta.json");
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
        title = meta.title || title;
        description = meta.description || description;
      } catch (e) {
        console.warn(`Error reading meta.json for ${app}: ${e.message}`);
      }
    }

    return `
        <a
          href="apps/${app}/"
          class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 class="text-2xl font-semibold mb-2">${title}</h2>
          <p class="text-gray-600">${description}</p>
        </a>`;
  })
  .join("\n");

// Replace the section
const before = indexContent.split(appsStart)[0];
const after = indexContent.split(appsEnd)[1];
const newContent =
  before + appsStart + "\n" + appLinks + "\n        " + appsEnd + after;

// Write back
fs.writeFileSync(indexPath, newContent);

console.log("Index.html updated with dynamic app links.");
