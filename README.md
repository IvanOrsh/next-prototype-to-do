**Rapid Prototyping with Next.js, Shadcn UI, Next-Auth, and Drizzle ORM**

Table of contents:

- [1. Initial Setup](#1-initial-setup)
- [Useful tips:](#useful-tips)

## 1. Initial Setup

1. Next.js setup (`create-next-app@latest`)
2. Clean up home page & css
3. shadcn/ui setup
   1. `pnpx shadcn-ui@latest init`
4. Next Themes
   1. `pnpm add next-themes`
   2. https://ui.shadcn.com/docs/dark-mode/next
   3. add button -> `pnpx shadcn-ui@latest add button`
5. Dropdown menu
   1. `pnpm dlx shadcn-ui@latest add dropdown-menu`

6. Dark mode
   1. https://ui.shadcn.com/docs/dark-mode/next
7. Install dependencies
   1. `pnpm add next-auth@beta drizzle-orm @auth/drizzle-adapter better-sqlite3 bcrypt`
  
8. Environment variables using `@next/env`

## Useful tips:

1. Keep a checklist of common boilerplate steps
2. Dark mode in the beginning
3. Central configuration file for environment variables