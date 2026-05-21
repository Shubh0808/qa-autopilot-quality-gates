export function evaluateAccessibility(html) {
  const failures = [];
  const imageTags = String(html).match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imageTags) {
    if (!/\balt=["'][^"']*["']/i.test(tag)) {
      failures.push("Image is missing alt text");
    }
  }

  const inputs = String(html).match(/<input\b[^>]*>/gi) ?? [];
  const labels = String(html).match(/<label\b/gi) ?? [];
  if (inputs.length > labels.length) {
    failures.push("Inputs should have associated labels");
  }

  return {
    pass: failures.length === 0,
    failures,
    checked: { images: imageTags.length, inputs: inputs.length }
  };
}
