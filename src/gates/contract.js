export function validateContract(contract, response) {
  const route = contract.paths?.[response.path]?.[response.method.toLowerCase()];
  if (!route) {
    return { pass: false, failures: ["No contract found for " + response.method + " " + response.path] };
  }

  const schema = route.responses?.[String(response.status)]?.schema ?? {};
  const failures = [];
  for (const [field, expectedType] of Object.entries(schema.required ?? {})) {
    const value = response.body?.[field];
    if (typeof value !== expectedType) {
      failures.push("Expected " + field + " to be " + expectedType + ", received " + typeof value);
    }
  }

  return { pass: failures.length === 0, failures };
}
