export function percentile(values, target) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.ceil((target / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

export function evaluatePerformance(samples, budget) {
  const p95 = percentile(samples.map((sample) => sample.latencyMs), 95);
  const errors = samples.filter((sample) => sample.status >= 500).length;
  const errorRate = samples.length === 0 ? 0 : errors / samples.length;
  const failures = [];
  if (p95 > budget.p95LatencyMs) {
    failures.push("p95 latency " + p95 + "ms exceeds budget " + budget.p95LatencyMs + "ms");
  }
  if (errorRate > budget.errorRate) {
    failures.push("error rate " + errorRate.toFixed(3) + " exceeds budget " + budget.errorRate);
  }
  return {
    pass: failures.length === 0,
    p95LatencyMs: p95,
    errorRate: Number(errorRate.toFixed(4)),
    failures
  };
}
