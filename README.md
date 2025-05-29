# GitDB

A simple Node.js library to read/write JSON files on GitHub and serve as a lightweight GitDB.

## Features
- Read JSON file from a GitHub repository
- Write (create/update) JSON file to a GitHub repository

## Installation

```bash
npm install gitdb

  or

npm install git+https://github.com/manishkumar1601/gitdb.git
```

## Usage

### CommonJS (Node.js)
```js
const { createDriver, fetchFile, saveFile } = require('gitdb');

const driver = createDriver({
  username: 'your-github-username',
  repository: 'your-repo-name',
  token: 'your-github-personal-access-token',
  path: 'data.json', // path in repo
});

fetchFile(driver).then(console.log);
saveFile(driver, { foo: 'bar' }).then(console.log);
```

### ESModule (Node.js ESM or modern bundlers)
```js
import { createDriver, fetchFile, saveFile } from 'gitdb';

const driver = createDriver({
  username: 'your-github-username',
  repository: 'your-repo-name',
  token: 'your-github-personal-access-token',
  path: 'data.json',
});

fetchFile(driver).then(console.log);
saveFile(driver, { foo: 'bar' }).then(console.log);
```

### TypeScript
```ts
import { createDriver, fetchFile, saveFile } from 'gitdb';

const driver = createDriver({
  username: 'your-github-username',
  repository: 'your-repo-name',
  token: 'your-github-personal-access-token',
  path: 'data.json',
});

fetchFile(driver).then(console.log);
saveFile(driver, { foo: 'bar' }).then(console.log);
```

## API

### createDriver(options)
- `username` (string): GitHub username
- `repository` (string): Repository name
- `token` (string): GitHub personal access token
- `path` (string): File path in the repository (default: `file.json`)
- `message` (string): Commit message (optional)

### fetchFile(driver)
Fetch the JSON file from the repository.

### saveFile(driver, data, extraOptions)
Save (create/update) the JSON file in the repository.

## License
MIT
