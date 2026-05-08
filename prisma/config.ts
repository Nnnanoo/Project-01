import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "postgresql://afloatter:afloatter123@localhost:5432/afloatter",
  },
});
