export function buildReleaseReport(results) {
  const blockingFailures = results.filter((result) => result.blocking && !result.pass);
  const warnings = results.filter((result) => !result.blocking && !result.pass);
  return {
    pass: blockingFailures.length === 0,
    blockingFailures,
    warnings,
    generatedAt: new Date().toISOString(),
    results
  };
}
