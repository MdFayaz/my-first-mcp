export function successResponse(
  data: any
) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          data,
          null,
          2
        ),
      },
    ],
  };
}

export function errorResponse(
  error: any
) {
  return {
    content: [
      {
        type: "text",
        text: `Error: ${error.message}`,
      },
    ],
  };
}