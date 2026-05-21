#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { evaluateAccessibility } from "./gates/accessibility.js";
import { validateContract } from "./gates/contract.js";
import { quarantineFlakyTests } from "./gates/flake.js";
import { evaluatePerformance } from "./gates/performance.js";
import { buildReleaseReport } from "./gates/reporter.js";

const file = process.argv[2];
if (!file) {
  console.error("usage: node src/cli.js <run.json>");
  process.exit(2);
}

const run = JSON.parse(await readFile(file, "utf8"));
const results = [
  { name: "contract", blocking: true, ...validateContract(run.contract, run.response) },
  { name: "performance", blocking: true, ...evaluatePerformance(run.performance.samples, run.performance.budget) },
  { name: "accessibility", blocking: false, ...evaluateAccessibility(run.html) },
  {
    name: "flake-quarantine",
    blocking: false,
    pass: quarantineFlakyTests(run.testHistory).length === 0,
    quarantined: quarantineFlakyTests(run.testHistory)
  }
];

const report = buildReleaseReport(results);
console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);
