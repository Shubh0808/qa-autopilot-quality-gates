import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAccessibility } from "../src/gates/accessibility.js";
import { validateContract } from "../src/gates/contract.js";
import { quarantineFlakyTests } from "../src/gates/flake.js";
import { evaluatePerformance } from "../src/gates/performance.js";
import { buildReleaseReport } from "../src/gates/reporter.js";

test("validates response contracts", () => {
  const result = validateContract(
    { paths: { "/health": { get: { responses: { 200: { schema: { required: { ok: "boolean" } } } } } } } },
    { method: "GET", path: "/health", status: 200, body: { ok: true } }
  );
  assert.equal(result.pass, true);
});

test("blocks performance budget regressions", () => {
  const result = evaluatePerformance(
    [{ latencyMs: 100, status: 200 }, { latencyMs: 900, status: 200 }, { latencyMs: 950, status: 500 }],
    { p95LatencyMs: 400, errorRate: 0.2 }
  );
  assert.equal(result.pass, false);
  assert.match(result.failures.join(" "), /latency/);
});

test("detects accessibility warnings", () => {
  const result = evaluateAccessibility("<main><input><img src='x.png'></main>");
  assert.equal(result.pass, false);
  assert.equal(result.failures.length, 2);
});

test("quarantines unstable tests and builds release report", () => {
  const quarantined = quarantineFlakyTests({ "flaky spec": ["pass", "fail", "pass", "fail", "pass"] });
  assert.equal(quarantined.length, 1);
  const report = buildReleaseReport([{ name: "contract", blocking: true, pass: true }]);
  assert.equal(report.pass, true);
});
