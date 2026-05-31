# Codex-Sentry-MCP 🚀

An MCP (Model Context Protocol) Server that bridges OpenAI Codex directly with the Sentry error tracking system. 

This tool empowers AI development assistants (like Codex) to automatically fetch, read, and analyze the latest error logs from Sentry, pinpoint the root causes, and propose or apply bug fixes directly within the code editor.

---

## 🔥 Key Features

* **Automated Log Retrieval:** Instantly fetches the latest error events, stack traces, and issue contexts from Sentry.
* **Smart Bug Analysis:** Provides structured error context directly to OpenAI Codex for deep diagnostic analysis.
* **Contextual Code Fixes:** Enhances the AI's situational awareness to suggest accurate, automated bug resolutions in your workspace.
* **MCP Compliant:** Fully compatible with any Model Context Protocol host or client environment.

---

## 🛠️ Installation & Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* A Sentry Account & Auth Token
* An MCP-compatible client environment

### Instructions
1. Clone the repository:
   ```bash
   git clone [https://github.com/tongleminhanh3-dotcom/codex.git](https://github.com/tongleminhanh3-dotcom/codex.git)
   cd codex-sentry-mcp
   Install dependencies:

Bash
npm install
Configure your environment variables in a .env file:

SENTRY_AUTH_TOKEN=your_sentry_token_here
SENTRY_ORG=your_organization_slug
SENTRY_PROJECT=your_project_slug
Run the server:
Bash
npm start
