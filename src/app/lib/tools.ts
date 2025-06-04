export interface Tool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: {
        query: {
          type: "string";
          description: string;
        };
      };
      required: string[];
    };
  };
}


export const webSearchTool: Tool = {
  type: "function",
  function: {
    name: "web_search",
    description: "Use this tool to look up information from the internet via SearxNG.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to look up.",
        },
      },
      required: ["query"],
    },
  },
}
