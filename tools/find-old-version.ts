import fs from "fs";
import path from "path";
import https from "https";
import util from "util";

// Convert callbacks to promises
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

// Function to get latest version from npm registry
async function getLatestVersion(packageName: string) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "registry.npmjs.org",
      path: `/${packageName}`,
      headers: { Accept: "application/vnd.npm.install-v1+json" },
    };

    https
      .get(options, (res: any) => {
        let data = "";
        res.on("data", (chunk: any) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed["dist-tags"]?.latest);
          } catch (e) {
            resolve(null);
          }
        });
      })
      .on("error", reject);
  });
}

// Function to compare versions
function isMajorBehind(current: string, latest: string) {
  if (!current || !latest) return false;
  const [currentMajor] = current.replace(/^\^|~/, "").split(".");
  const [latestMajor] = latest.split(".");
  return parseInt(currentMajor) < parseInt(latestMajor);
}

// Main function to check package.json files
async function checkDependencies(directory: string) {
  try {
    // Get all files in directory recursively
    const files = await getAllFiles(directory);
    const packageJsonFiles = files.filter(
      (file) => path.basename(file) === "package.json"
    );

    console.log(`Found ${packageJsonFiles.length} package.json files\n`);

    for (const file of packageJsonFiles) {
      const content = await readFile(file, "utf8");
      const pkg = JSON.parse(content);
      const relativePath = path.relative(directory, file);

      console.log(`\nChecking ${relativePath}:`);

      // Check both dependencies and devDependencies
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };

      let outdatedFound = false;

      for (const [dep, version] of Object.entries(allDeps)) {
        const latest = await getLatestVersion(dep);

        if (isMajorBehind(version as string, latest as string)) {
          outdatedFound = true;
          console.log(
            `  ${dep}: ${version} → ${latest} (major version behind)`
          );
        }
      }

      if (!outdatedFound) {
        console.log("  All dependencies are up to date!");
      }
    }
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

// Helper function to get all files recursively
async function getAllFiles(dir: string) {
  const files = await readdir(dir, { withFileTypes: true });
  const paths: string[] = [];

  for (const file of files) {
    if (file.name === "node_modules") continue;

    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      paths.push(...(await getAllFiles(fullPath)));
    } else {
      paths.push(fullPath);
    }
  }

  return paths;
}

// Check if directory argument is provided
const directory = process.argv[2] || ".";
checkDependencies(directory);
