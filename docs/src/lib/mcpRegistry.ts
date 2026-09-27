/**
 * Model Context Protocol (MCP) Client & Virtual Registry Engine
 *
 * Implements the standard JSON-RPC 2.0 / MCP schema for connecting
 * multiple external resources, tools, and context servers (Google Drive, GitHub,
 * Notion, ArXiv, Postgres, Custom Microservices).
 */

export interface McpServerConfig {
  id: string;
  name: string;
  type: "google-drive" | "github" | "filesystem" | "arxiv" | "custom";
  status: "connected" | "connecting" | "disconnected" | "error";
  endpointUrl?: string;
  icon: string;
  description: string;
  resourcesCount: number;
  toolsCount: number;
  promptsCount: number;
}

export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  serverId: string;
  metadata?: Record<string, any>;
}

export interface McpTool {
  name: string;
  description: string;
  serverId: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface McpPrompt {
  name: string;
  description: string;
  serverId: string;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
}

export class McpRegistry {
  private servers: Map<string, McpServerConfig> = new Map();
  private resources: Map<string, McpResource> = new Map();
  private tools: Map<string, McpTool> = new Map();
  private prompts: Map<string, McpPrompt> = new Map();

  constructor() {
    this.seedDefaultMcpConnectors();
  }

  private seedDefaultMcpConnectors() {
    // Built-in MCP Hub Connectors
    this.registerServer({
      id: "mcp-drive-primary",
      name: "Google Drive MCP Gateway",
      type: "google-drive",
      status: "connected",
      icon: "📁",
      description: "MCP Server providing resource URIs and document streaming from connected Google Drive accounts.",
      resourcesCount: 0,
      toolsCount: 3,
      promptsCount: 2,
    });

    this.registerServer({
      id: "mcp-electrobun-runtime",
      name: "Electrobun Desktop Host MCP",
      type: "filesystem",
      status: "connected",
      icon: "⚡",
      description: "Direct RPC bridge for native windowing, Cottontail micro-runtime bundles, and cross-platform desktop integration.",
      resourcesCount: 14,
      toolsCount: 8,
      promptsCount: 4,
    });

    this.registerServer({
      id: "mcp-arxiv-openaccess",
      name: "ArXiv Systems Science MCP",
      type: "arxiv",
      status: "connected",
      icon: "📚",
      description: "Queries open-access systems theory papers, cybernetic preprints, and complex systems literature.",
      resourcesCount: 3500,
      toolsCount: 2,
      promptsCount: 3,
    });

    this.registerServer({
      id: "mcp-github-integration",
      name: "GitHub Metasystem Bridge",
      type: "github",
      status: "connected",
      icon: "🐙",
      description: "Bi-directional repository sync, commit logs, release artifacts, and automated workflow triggers.",
      resourcesCount: 24,
      toolsCount: 4,
      promptsCount: 2,
    });

    // Register primary tools
    this.registerTool({
      serverId: "mcp-drive-primary",
      name: "drive_read_resource",
      description: "Fetch and normalize content from any authenticated Google Drive URI (drive://<account>/<fileId>)",
      inputSchema: {
        type: "object",
        properties: {
          uri: { type: "string", description: "The canonical MCP resource URI" },
        },
        required: ["uri"],
      },
    });

    this.registerTool({
      serverId: "mcp-electrobun-runtime",
      name: "package_frictionless_bundle",
      description: "Compiles active systems models and drive research into an autonomous zero-CLI desktop/web package",
      inputSchema: {
        type: "object",
        properties: {
          target: { type: "string", enum: ["html-single", "electrobun-macos", "electrobun-windows", "electrobun-linux"] },
          modelPayload: { type: "object" },
        },
        required: ["target"],
      },
    });

    this.registerTool({
      serverId: "mcp-arxiv-openaccess",
      name: "query_systems_papers",
      description: "Semantic search across systems theory, Ashby's Law, cybernetics, and causal loop models",
      inputSchema: {
        type: "object",
        properties: {
          topic: { type: "string" },
        },
        required: ["topic"],
      },
    });
  }

  public registerServer(config: McpServerConfig) {
    this.servers.set(config.id, config);
  }

  public registerResource(resource: McpResource) {
    this.resources.set(resource.uri, resource);
    const server = this.servers.get(resource.serverId);
    if (server) server.resourcesCount = this.getResourcesByServer(resource.serverId).length;
  }

  public registerTool(tool: McpTool) {
    this.tools.set(`${tool.serverId}:${tool.name}`, tool);
    const server = this.servers.get(tool.serverId);
    if (server) server.toolsCount = this.getToolsByServer(tool.serverId).length;
  }

  public getServers(): McpServerConfig[] {
    return Array.from(this.servers.values());
  }

  public getResources(): McpResource[] {
    return Array.from(this.resources.values());
  }

  public getResourcesByServer(serverId: string): McpResource[] {
    return Array.from(this.resources.values()).filter((r) => r.serverId === serverId);
  }

  public getTools(): McpTool[] {
    return Array.from(this.tools.values());
  }

  public getToolsByServer(serverId: string): McpTool[] {
    return Array.from(this.tools.values()).filter((t) => t.serverId === serverId);
  }

  /**
   * Translates Google Drive files into universal MCP standard resource representations
   */
  public syncDriveFilesToMcp(files: any[], accountLabel: string, accountId: string) {
    files.forEach((f) => {
      const uri = `mcp://google-drive/${encodeURIComponent(accountId)}/${f.id}`;
      this.registerResource({
        uri,
        name: f.name,
        description: `Ingested from ${accountLabel} (${f.sourceAccountEmail || "Google Drive"})`,
        mimeType: f.mimeType,
        serverId: "mcp-drive-primary",
        metadata: {
          fileId: f.id,
          webViewLink: f.webViewLink,
          modifiedTime: f.modifiedTime,
          sourceAccountLabel: accountLabel,
        },
      });
    });
  }
}

export const mcpRegistry = new McpRegistry();
