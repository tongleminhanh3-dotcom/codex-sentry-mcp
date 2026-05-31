import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";

// Tải cấu hình từ file .env
dotenv.config();

const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
const SENTRY_ORG = process.env.SENTRY_ORG;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT;

// Khởi tạo MCP Server
const server = new Server(
  {
    name: "codex-sentry-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Khai báo công cụ (Tools) cho OpenAI Codex sử dụng
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_latest_sentry_errors",
        description: "Fetch the latest unresolved error logs and issues from Sentry",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Number of errors to retrieve (default is 5)",
              default: 5,
            },
          },
        },
      },
    ],
  };
});

// Xử lý logic khi OpenAI Codex gọi công cụ
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_latest_sentry_errors") {
    const limit = args?.limit || 5;

    if (!SENTRY_AUTH_TOKEN || !SENTRY_ORG || !SENTRY_PROJECT) {
      return {
        content: [
          {
            type: "text",
            text: "Error: Missing Sentry configuration in environment variables.",
          },
        ],
        isError: true,
      };
    }

    try {
      // Gọi API Sentry để lấy danh sách lỗi mới nhất
      const response = await axios.get(
        `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/`,
        {
          headers: {
            Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
          },
          params: {
            query: "is:unresolved",
            limit: limit,
          },
        }
      );

      const errors = response.data.map((issue) => ({
        id: issue.id,
        title: issue.title,
        culprit: issue.culprit,
        permalink: issue.permalink,
        metadata: issue.metadata,
        lastSeen: issue.lastSeen,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(errors, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch errors from Sentry: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Tool not found: ${name}`);
});

// Chạy server bằng phương thức kết nối Stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Codex-Sentry-MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
