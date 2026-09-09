#!/usr/bin/env node
/*
 * Runs the schematic specs (projects/canopy-ui/schematics/**\/*.spec.ts) on Node with the
 * schematic test runner. The Karma target only covers the browser library, and the schematics are
 * plain Node code, so they are compiled with tsconfig.schematics.spec.json and run with jasmine-core
 * directly (no extra runner dependency, DEPENDENCY_POLICY s2).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const schematics = path.join(root, 'projects', 'canopy-ui', 'schematics');

execSync(`npx tsc -p ${path.join(schematics, 'tsconfig.schematics.spec.json')}`, { cwd: root, stdio: 'inherit' });

const jasmineCore = require('jasmine-core');
const jasmine = jasmineCore.boot(jasmineCore);
const env = jasmine.getEnv();

let failures = 0;
env.addReporter({
  specDone(result) {
    const mark = result.status === 'passed' ? 'PASS' : result.status.toUpperCase();
    console.log(`${mark} ${result.fullName}`);
    for (const failed of result.failedExpectations) {
      console.log(`     ${failed.message}`);
    }
    if (result.status === 'failed') {
      failures++;
    }
  },
  jasmineDone(result) {
    console.log(`\nschematic specs: ${result.overallStatus}${failures ? ` (${failures} failed)` : ''}`);
    process.exitCode = result.overallStatus === 'passed' ? 0 : 1;
  }
});

function specs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'node_modules' ? [] : specs(full);
    }
    return entry.name.endsWith('.spec.js') ? [full] : [];
  });
}

for (const spec of specs(schematics)) {
  require(spec);
}
env.execute();
