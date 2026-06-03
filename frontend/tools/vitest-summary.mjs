import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vitestBin = path.join(rootDir, 'node_modules', 'vitest', 'vitest.mjs');
const startedAt = Date.now();

let stdout = '';
let stderr = '';

const child = spawn(process.execPath, [vitestBin, 'run', '--reporter=json'], {
  cwd: rootDir,
  env: {
    ...process.env,
    FORCE_COLOR: '0',
    NO_COLOR: '1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

child.stdout.setEncoding('utf8');
child.stderr.setEncoding('utf8');
child.stdout.on('data', (chunk) => {
  stdout += chunk;
});
child.stderr.on('data', (chunk) => {
  stderr += chunk;
});

child.on('error', (error) => {
  printFallback(error.message, 1);
  process.exitCode = 1;
});

child.on('close', (code) => {
  const exitCode = code ?? 1;

  try {
    const report = JSON.parse(stdout);
    printSummary(report, exitCode, Date.now() - startedAt);
  } catch (error) {
    printFallback(`Could not parse Vitest JSON output: ${error.message}`, exitCode);
  }

  process.exitCode = exitCode;
});

function printSummary(report, exitCode, elapsedMs) {
  const fileResults = Array.isArray(report.testResults) ? report.testResults : [];
  const failedFiles = fileResults.filter((file) => file.status === 'failed');
  const passedFiles = fileResults.filter((file) => file.status === 'passed');
  const failedTests = fileResults.flatMap((file) =>
    getAssertions(file)
      .filter((test) => test.status === 'failed')
      .map((test) => ({
        file: relativeFile(file.name),
        name: test.fullName || [...(test.ancestorTitles ?? []), test.title].filter(Boolean).join(' > '),
      })),
  );

  const passedTests =
    typeof report.numPassedTests === 'number'
      ? report.numPassedTests
      : fileResults.flatMap(getAssertions).filter((test) => test.status === 'passed').length;
  const totalTests =
    typeof report.numTotalTests === 'number' ? report.numTotalTests : passedTests + failedTests.length;
  const failedTestCount =
    typeof report.numFailedTests === 'number' ? report.numFailedTests : failedTests.length;

  console.log('Vitest summary');
  console.log(`Files: ${passedFiles.length} passed, ${failedFiles.length} failed`);
  console.log(`Tests: ${passedTests} passed, ${failedTestCount} failed`);

  if (failedTests.length > 0) {
    console.log('Failed tests:');
    for (const test of failedTests) {
      console.log(`- ${test.file}: ${test.name}`);
    }
  }

  const duration = getDuration(report, elapsedMs);
  console.log(`Duration: ${duration}`);
  console.log(`Exit code: ${exitCode}`);

  if (exitCode !== 0) {
    console.log('Run npm run test:full for detailed Vitest logs.');
  }

  if (totalTests === 0 && fileResults.length === 0 && stderr.trim()) {
    console.log('Vitest produced no parsed test results.');
  }
}

function printFallback(reason, exitCode) {
  console.log('Vitest summary');
  console.log('Files: 0 passed, 0 failed');
  console.log('Tests: 0 passed, 0 failed');
  console.log(`Duration: ${formatMs(Date.now() - startedAt)}`);
  console.log(`Exit code: ${exitCode}`);
  console.log(reason);
  console.log('Run npm run test:full for detailed Vitest logs.');
}

function getAssertions(file) {
  return Array.isArray(file.assertionResults) ? file.assertionResults : [];
}

function relativeFile(fileName) {
  return path.relative(rootDir, fileName).replaceAll(path.sep, '/');
}

function getDuration(report, elapsedMs) {
  if (typeof report.startTime === 'number') {
    const endTime = Math.max(
      ...((report.testResults ?? []).map((file) => file.endTime).filter((time) => typeof time === 'number')),
      report.startTime,
    );

    if (endTime > report.startTime) {
      return formatMs(endTime - report.startTime);
    }
  }

  return formatMs(elapsedMs);
}

function formatMs(value) {
  if (value < 1000) {
    return `${Math.round(value)}ms`;
  }

  return `${(value / 1000).toFixed(2)}s`;
}
