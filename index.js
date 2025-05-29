const { Octokit } = require("@octokit/rest");
const base64 = require("nodejs-base64-converter");

/**
 * Generate a random string of given length
 */
function makeId(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format bytes to human-readable size
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(1) + " MB";
  if (bytes < 1024 ** 4) return (bytes / 1024 ** 3).toFixed(1) + " GB";
  return (bytes / 1024 ** 4).toFixed(1) + " TB";
}

/**
 * Check if input is valid JSON
 */
function isJson(data) {
  if (!data || typeof data !== "string") return false;
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a GitHub driver instance (functional config)
 */
function createDriver(options = {}) {
  const opts = {
    owner: options.username,
    repo: options.repository,
    path: options.path || "file.json",
    message: options.message || makeId(10),
    ...options,
  };

  const baseUrl = `https://api.github.com/repos/${opts.owner}/${opts.repo}/contents/${opts.path}`;
  const octokit = new Octokit({ auth: opts.token });

  return { opts, baseUrl, octokit };
}

/**
 * Fetch file from GitHub
 */
async function fetchFile(driver) {
  const { baseUrl, octokit } = driver;
  try {
    const { data } = await octokit.request("GET " + baseUrl);
    return {
      status: true,
      size: formatSize(data.size),
      sha: data.sha,
      content: JSON.parse(base64.decode(data.content)),
    };
  } catch (err) {
    return { status: false, msg: err.message };
  }
}

/**
 * Save JSON file to GitHub
 */
async function saveFile(driver, data, extraOptions = {}) {
  const { baseUrl, octokit, opts } = driver;

  const jsonData =
    typeof data === "object" || Array.isArray(data)
      ? JSON.stringify(data)
      : data;

  if (!isJson(jsonData)) {
    return {
      status: false,
      msg: "data type is invalid, make sure the data is in json format",
    };
  }

  const existing = await fetchFile(driver);

  try {
    const { data: response } = await octokit.request("PUT " + baseUrl, {
      sha: existing.status ? existing.sha : undefined,
      ...opts,
      content: base64.encode(jsonData),
      ...extraOptions,
    });

    return {
      status: true,
      filename: response.content.name,
      path: response.content.path,
      size: formatSize(response.content.size),
      commit: response.commit.message,
    };
  } catch (err) {
    return { status: false, msg: err.message };
  }
}

module.exports = {
  createDriver,
  fetchFile,
  saveFile,
  formatSize,
  isJson,
  makeId,
};
