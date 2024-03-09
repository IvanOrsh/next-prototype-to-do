**Rapid Prototyping with Next.js, Shadcn UI, Next-Auth, and Drizzle ORM**

Table of contents:

- [1. Initial Setup](#1-initial-setup)
- [2. Authentication](#2-authentication)
  - [2.0 Drizzle-kit \& some tips](#20-drizzle-kit--some-tips)
  - [2.1 Schema](#21-schema)
  - [2.2 Drizzle DB Instance](#22-drizzle-db-instance)
  - [2.3 Auth.js Configuration](#23-authjs-configuration)
    - [2.3.1 References](#231-references)
    - [2.3.2 `auth.ts` with credential provider:](#232-authts-with-credential-provider)
    - [2.3.3 auth routes for next auth (sing in, sign up, sign out, etc.):](#233-auth-routes-for-next-auth-sing-in-sign-up-sign-out-etc)
    - [2.3.4 next auth types](#234-next-auth-types)
  - [2.4 Sign in Button](#24-sign-in-button)
  - [2.5 Session Provider Wrapper](#25-session-provider-wrapper)
  - [2.6 Private Layout](#26-private-layout)
  - [2.7 Auth Secret](#27-auth-secret)
  - [2.8 Env Local](#28-env-local)
  - [2.11 Drizzle Configuration For Drizzle Kit](#211-drizzle-configuration-for-drizzle-kit)
  - [2.12 Drizzle Push Command](#212-drizzle-push-command)
  - [2.13 Add `*.sqlite` to `.gitignore`](#213-add-sqlite-to-gitignore)
- [3. Responsive App Shell](#3-responsive-app-shell)
  - [3.0 Tips](#30-tips)
  - [3.1 Create Page Stubs](#31-create-page-stubs)
  - [3.2 Add Auth Check to Private Layout](#32-add-auth-check-to-private-layout)
  - [3.3 Create App Shell Component](#33-create-app-shell-component)
  - [2.4 CSS Grid Layout](#24-css-grid-layout)
  - [2.5 Create Header Component](#25-create-header-component)
  - [2.6 Avatar Dropdown Menu](#26-avatar-dropdown-menu)
  - [2.7 Sign Out Button](#27-sign-out-button)
  - [2.8 Sidebar And Animation](#28-sidebar-and-animation)
  - [2.9 Add Accent Colors to Tailwind Theme](#29-add-accent-colors-to-tailwind-theme)
- [4. Tasks Page](#4-tasks-page)
  - [4.0 Tips](#40-tips)
  - [4.1 Add Tasks Schema](#41-add-tasks-schema)
  - [4.2 Query For Tasks](#42-query-for-tasks)
  - [4.3 Task List](#43-task-list)
  - [4.4 Completed Task List](#44-completed-task-list)
  - [4.5 "Add Task" Button and Input](#45-add-task-button-and-input)
  - [4.6 Filter For Incomplete and Completed Tasks](#46-filter-for-incomplete-and-completed-tasks)
  - [4.7 Drawer Component](#47-drawer-component)
  - [4.8 Add and Remove from My Day Button](#48-add-and-remove-from-my-day-button)

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
  
8. Environment variables using `@next/env`:

```tsx
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;
```

9. Useful tips:
   1. Keep a checklist of common boilerplate steps
   2. Dark mode in the beginning
   3. Central configuration file for environment variables

## 2. Authentication

### 2.0 Drizzle-kit & some tips

**Drizzle-kit**:

- Push - takes our schema and pushes it (any changes) to the database - **best for prototyping**:
  - schema -push-> DB

- Generate - generates sql file (any changes) to the database - **best for production**: 
  - schema -compare-> DB
  - sql -migrate-> DB (so we can run migrate script)

---

**Tips**:

1. Use OAuth or Email Provider for production app.
2. If using Credential Provider, use a more robust sign up flow with email verification and password reset.
3. Do not put the Session Provider at the root layout. Instead, put it in a route **group** layout.
4. Use drizzle-kit push for rapid prototyping.
5. Use drizzle-kit generate migrations for production.

### 2.1 Schema

https://authjs.dev/reference/adapter/drizzle

### 2.2 Drizzle DB Instance

db.ts:

```ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import config from "./config";
import * as schema from "./schema";

const sqlite = new Database(config.DATABASE_URL);

export const db = drizzle(sqlite, {
  schema,
  logger: true,
});
```

### 2.3 Auth.js Configuration

#### 2.3.1 References

https://authjs.dev/guides/upgrade-to-v5
https://authjs.dev/guides/providers/credentials


#### 2.3.2 `auth.ts` with credential provider:

1. We are using Credential Provider for rapid prototyping (not suitable for production).
2. We hash the password before storing it in the database using `bcrypt`.

auth config example (for rapid prototyping):

```ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "./db";
import { users } from "./schema";

function passwordToSalt(password: string): string {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
}

async function getUserFromDb(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.name, username),
  });
  return user;
}

async function addUserToDb(username: string, passwordHash: string) {
  const user = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      email: username,
      passwordHash,
    })
    .returning();
  return user.pop();
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let user = null;
        const username = credentials.username as string;
        const password = credentials.password as string;
        if (!username || !password) {
          return null;
        }

        user = await getUserFromDb(username);
        if (user) {
          if (!user.passwordHash) {
            return null;
          }

          const isAuthenticated = await bcrypt.compare(
            password,
            user.passwordHash
          );
          if (!isAuthenticated) {
            return null;
          }
          return user;
        }

        if (!user) {
          // !user -> create user
          const saltedPassword = passwordToSalt(password);
          user = await addUserToDb(username, saltedPassword);
        }

        if (!user) {
          throw new Error("User was not found and could not be created");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
});

```

#### 2.3.3 auth routes for next auth (sing in, sign up, sign out, etc.):

https://authjs.dev/guides/upgrade-to-v5#configuration

`app/api/auth/[...nextauth]/route.ts` (from docs):

```ts
export { GET, POST } from "./auth"
export const runtime = "edge" // optional
```

#### 2.3.4 next auth types

`src/types/next-auth.d.ts`:

```ts
import NextAuth, { DefaultSession } from "next-auth";

// module augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    } & DefaultSession["user"];
  }
}

```

### 2.4 Sign in Button

```tsx
"use client";

import { signIn } from "next-auth/react";

import { Button } from "./ui/button";

export default function SignInButton() {
  return <Button onClick={() => signIn(undefined)}>Sign in</Button>;
}

```

### 2.5 Session Provider Wrapper

Wrapper over `next-auth/react`'s `SessionProvider` so we can add `"use client"` directive.

```tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default SessionProvider;
```

### 2.6 Private Layout

`app/(private)/layout.tsx` - to create a shared layout for all private pages.

```tsx
import { ReactNode } from "react";

import { auth } from "@/lib/auth";
import SessionProvider from "@/components/providers/session-provider";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
```

### 2.7 Auth Secret

```sh
$ pnpx auth secret
```

### 2.8 Env Local

for example:

```txt
DATABASE_URL=db.sqlite
AUTH_SECRET=generate_secret
```

### 2.11 Drizzle Configuration For Drizzle Kit

drizzle.config.ts:

```ts
import { defineConfig } from "drizzle-kit";

import config from "@/lib/config";

export default defineConfig({
  schema: "./src/lib/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: config.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});

```

### 2.12 Drizzle Push Command

`npx drizzle-kit push:sqlite`

### 2.13 Add `*.sqlite` to `.gitignore`

## 3. Responsive App Shell

### 3.0 Tips

1. Use grid for 2d layouts
2. Use flex for 1d layouts
3. Use CSS variables

### 3.1 Create Page Stubs

### 3.2 Add Auth Check to Private Layout

### 3.3 Create App Shell Component

### 2.4 CSS Grid Layout

### 2.5 Create Header Component

### 2.6 Avatar Dropdown Menu

### 2.7 Sign Out Button

### 2.8 Sidebar And Animation

### 2.9 Add Accent Colors to Tailwind Theme

## 4. Tasks Page

### 4.0 Tips

1. Don't forget to add `"use server"` directive to server actions.
2. Don't forget to add `"use client"` directive to client components.
3. Don't forget to call `revalidatePath` to refresh any pages that need to be refreshed after a call to a server action.

### 4.1 Add Tasks Schema

Something like that:

```tsx
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  title: text("title"),
  note: text("note"),
  isComplete: integer("is_complete", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_DATE`),
  addedToMyDayAt: text("added_to_my_day_at"),
  isImportant: integer("is_important", { mode: "boolean" }).default(false),
});
```

### 4.2 Query For Tasks

```tsx
export default async function TasksPage() {
  const res = await db.query.tasks.findMany();
  
  // rest
}
```

### 4.3 Task List

### 4.4 Completed Task List

### 4.5 "Add Task" Button and Input

src/actions/create-task.ts:

```ts
"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";

export async function createTask(title: string) {
  const session = await auth();

  if (!session) {
    return {
      message: "unauthenticated",
    };
  }

  await db.insert(tasks).values({
    userId: session.user.id,
    title,
  });

  // important!
  revalidatePath("/tasks");
}
```

src/actions/complete-tasks.ts:

```ts

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";

export default async function completeTask(id: number, isComplete: boolean) {
  const session = await auth();

  if (!session) {
    return {
      message: "unauthenticated",
    };
  }

  await db
    .update(tasks)
    .set({
      isComplete,
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

  // don't forget!
  revalidatePath("/tasks");
}
```

src/actions/update-task.ts:

```ts
"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function updateTask(id: number, data: any) {
  const session = await auth();

  if (!session) {
    return {
      message: "unauthenticated",
    };
  }

  const update = {
    title: data.title,
    note: data.note,
    isImportant: data.isImportant,
    addedToMyDayAt: data.addToMyDayAt,
  };

  await db
    .update(tasks)
    .set(update)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

  revalidatePath("/tasks");
}

```

### 4.6 Filter For Incomplete and Completed Tasks

### 4.7 Drawer Component

### 4.8 Add and Remove from My Day Button