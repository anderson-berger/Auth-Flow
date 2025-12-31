import dayjs from "dayjs";

export function buildUpdateExpression<T extends Record<string, any>>(
  updates: Partial<T>
): {
  updateExpression: string;
  expressionAttributeNames: Record<string, string>;
  expressionAttributeValues: Record<string, any>;
} {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value], index) => {
    const placeholder = `#attr${index}`;
    const valuePlaceholder = `:val${index}`;

    updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
    expressionAttributeNames[placeholder] = key;
    expressionAttributeValues[valuePlaceholder] = value;
  });

  // Auto-increment version
  updateExpressions.push("#version = #version + :inc");
  expressionAttributeNames["#version"] = "version";
  expressionAttributeValues[":inc"] = 1;

  // Update updatedAt
  updateExpressions.push("#updatedAt = :updatedAt");
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = dayjs().toISOString();

  return {
    updateExpression: `SET ${updateExpressions.join(", ")}`,
    expressionAttributeNames,
    expressionAttributeValues,
  };
}
