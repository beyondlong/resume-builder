const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const cacheDir = path.join(process.cwd(), '.cache');
const pathsToReset = [
  cacheDir,
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'node_modules/.cache/babel-loader'),
  path.join(process.cwd(), 'node_modules/.cache/terser-webpack-plugin'),
];

pathsToReset.forEach(targetPath => {
  fs.rmSync(targetPath, { recursive: true, force: true });
});

fs.mkdirSync(cacheDir, { recursive: true });

const launcherPath = path.join(__dirname, 'gatsby-cli-safe.js');
const child = spawn(process.execPath, [launcherPath, 'develop'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});

child.on('exit', code => {
  process.exit(code ?? 0);
});
