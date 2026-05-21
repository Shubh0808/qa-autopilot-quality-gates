export function quarantineFlakyTests(history, options = {}) {
  const windowSize = options.windowSize ?? 5;
  const threshold = options.threshold ?? 0.4;
  const quarantined = [];

  for (const [testName, outcomes] of Object.entries(history)) {
    const window = outcomes.slice(-windowSize);
    const transitions = window.slice(1).filter((outcome, index) => outcome !== window[index]).length;
    const instability = window.length <= 1 ? 0 : transitions / (window.length - 1);
    if (instability >= threshold) {
      quarantined.push({ testName, instability: Number(instability.toFixed(2)), recent: window });
    }
  }

  return quarantined.sort((left, right) => right.instability - left.instability);
}
