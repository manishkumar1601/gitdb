import { Octokit } from '@octokit/rest';
import * as base64 from 'nodejs-base64-converter';

export function makeId(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(1) + ' MB';
  if (bytes < 1024 ** 4) return (bytes / 1024 ** 3).toFixed(1) + ' GB';
  return (bytes / 1024 ** 4).toFixed(1) + ' TB';
}

export function isJson(data) {
  if (!data || typeof data !== 'string') return false;
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function createDriver(options = {}) {
  const opts = {
    owner: options.username,
    repo: options.repository,
    path: options.path || 'file.json',
    message: options.message || makeId(10),
    ...options,
  };
  const baseUrl = `https://api.github.com/repos/${opts.owner}/${opts.repo}/contents/${opts.path}`;
  const octokit = new Octokit({ auth: opts.token });
  return { opts, baseUrl, octokit };
}

export async function fetchFile(driver) {
  const { baseUrl, octokit } = driver;
  try {
    const { data } = await octokit.request('GET ' + baseUrl);
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

export async function saveFile(driver, data, extraOptions = {}) {
  const { baseUrl, octokit, opts } = driver;
  const jsonData =
    typeof data === 'object' || Array.isArray(data)
      ? JSON.stringify(data)
      : data;
  if (!isJson(jsonData)) {
    return {
      status: false,
      msg: 'data type is invalid, make sure the data is in json format',
    };
  }
  const existing = await fetchFile(driver);
  try {
    const { data: response } = await octokit.request('PUT ' + baseUrl, {
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
