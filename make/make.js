const fetchJson = require('node-fetch-json');

async function stage(stageName) {
  console.log(`Executing stage ${stageName}`)
  const response = await fetchJson(
    `http://${stageName}`,
    { method: 'POST', body: ''}
  );
  console.log('STDOUT:');
  console.log(response.stdout);
  console.log('STDERR:')
  console.log(response.stderr);
  if (response.errorCode !== 0) {
    throw new Error(`Command status code was ${response.errorCode}`);
  }
}

async function main() {
  await stage('make-pull');
  await stage('make-build');
  await stage('make-publish');
}

main().catch(e => console.error(e));

