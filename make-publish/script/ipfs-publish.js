#!/usr/bin/env node
const ipfsApi = require('ipfs-api');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const net = require('net');
const { promisify } = require('util');

const DATA_DIR = process.env.DATA_DIR;
if (!DATA_DIR) {
  throw new Error('DATA_DIR environment variable not specified!');
}
const IPFS_HOST= process.env.IPFS_HOST || 'localhost';
const IPFS_PORT = process.env.IPFS_PORT || '5001';

function getFileObjects(dir) {
  const contents = fs.readdirSync(dir)
    .map(x => path.join(dir, x))
    .map(x => ({
      path: x,
      lstat: fs.lstatSync(x)
    }));
  const fileObjects = contents
    .filter(x => x.lstat.isFile())
    .map(x => ({
      path: x.path,
      contents: fs.createReadStream(x.path),
    }))
  const subDirectoryPaths = contents
    .filter(x => x.lstat.isDirectory())
    .map(x => x.path);
  return fileObjects.concat(
     ...subDirectoryPaths.map(x => getFileObjects(x))
  );
}

async function main() {
  const ipfsHost = net.isIP(IPFS_HOST)
    ? IPFS_HOST
    : await promisify(dns.resolve)(IPFS_HOST);
  const ipfs = ipfsApi(`/ip4/${ipfsHost}/tcp/${IPFS_PORT}`);
  const fileObjects = getFileObjects(DATA_DIR);

  // add files to IPFS
  // (will do nothing if files are already there thanks to IPFS properties)
  console.log('Adding files...')
  const hashes = await ipfs.add(fileObjects)

  // publish the directory hash
  const directoryHash = hashes.pop().hash;
  console.log(`Publishing hash ${directoryHash}...`);
  await ipfs.name.publish(directoryHash)
  console.log('Done!');
}

main().then(ret => console.log(JSON.stringify(ret, null ,2))).catch(e => {
  throw e;
});
