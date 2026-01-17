import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Linkboard API",
      version: "1.0.0",
      description:
        "API documentation for Linkboard - A personal link management application",
      contact: {
        name: "Linkboard Support",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API Server",
      },
    ],
    components: {
      schemas: {
        NormalLink: {
          type: "object",
          required: ["id", "title", "url"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the link",
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Title of the link",
            },
            url: {
              type: "string",
              format: "uri",
              maxLength: 2048,
              description: "URL of the link",
            },
            order: {
              type: "integer",
              description: "Display order of the link",
            },
            linkGroupId: {
              type: "string",
              nullable: true,
              description: "ID of the group this link belongs to",
            },
            icon: {
              type: "string",
              nullable: true,
              description: "Bootstrap icon name",
            },
          },
        },
        LinkGroup: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the group",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Name of the group",
            },
            order: {
              type: "integer",
              description: "Display order of the group",
            },
            icon: {
              type: "string",
              nullable: true,
              description: "Bootstrap icon name",
            },
            links: {
              type: "array",
              items: {
                $ref: "#/components/schemas/NormalLink",
              },
              description: "Links within this group",
            },
          },
        },
        TopLink: {
          type: "object",
          required: ["id", "url", "icon"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the top link",
            },
            url: {
              type: "string",
              format: "uri",
              maxLength: 2048,
              description: "URL of the link",
            },
            order: {
              type: "integer",
              description: "Display order of the link",
            },
            icon: {
              type: "string",
              description: "Bootstrap icon name (required)",
            },
          },
        },
        Profile: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the profile",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Display name",
            },
            bio: {
              type: "string",
              maxLength: 1024,
              nullable: true,
              description: "Profile bio/description",
            },
            avatar: {
              type: "string",
              nullable: true,
              description: "Path to avatar image",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
        Settings: {
          type: "object",
          required: ["id", "shareBar", "source", "density", "theme"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for settings",
            },
            shareBar: {
              type: "boolean",
              description: "Whether to show the share bar",
            },
            source: {
              type: "boolean",
              description: "Whether to show source link",
            },
            density: {
              type: "string",
              enum: ["COMPACT", "COMFORTABLE", "SPACIOUS"],
              description: "UI density setting",
            },
            theme: {
              type: "string",
              enum: ["DEFAULT", "LIGHT", "DARK", "NEO_BRUTALISM"],
              description: "Theme setting",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
            details: {
              type: "object",
              description: "Additional error details",
            },
          },
        },
      },
    },
  },
  apis: ["./app/api/**/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
