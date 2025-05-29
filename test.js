// Minimal test usage for gitdb
const { createDriver, fetchFile, saveFile } = require('./index');

// Please provide your own credentials and repo info for real tests
const driver = createDriver({
  username: 'your-github-username',
  repository: 'your-repo-name',
  token: 'your-github-personal-access-token',
  path: 'test.json',
});

async function run() {
  // Write
  const saveResult = await saveFile(driver, { hello: 'world', time: Date.now() });
  console.log('Save:', saveResult);

  // Read
  const fetchResult = await fetchFile(driver);
  console.log('Fetch:', fetchResult);
}

// Uncomment to run test
// run();
