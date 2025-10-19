# 🧠 GitTales — Automated AI-Powered Release Documentation

## Description

GitTales automates release note generation by analyzing Git changes and creating detailed, AI-generated Markdown
summaries for every release.

Whenever a Pull Request is merged, a **GitHub Action** automatically triggers and sends repository and branch data to
the **GitTales backend**.  
The backend then uses **SimpleGit** to extract the Git diff between branches and sends it to an **OpenAI agent**, which
translates raw code changes into clear, human-readable technical summaries.  
These summaries are formatted as Markdown documents, stored in the database, and can be viewed, downloaded, or shared
directly.

Developers can:

- Log in with GitHub to browse repositories and generated documentation.
- Access the same experience through the **web app** or the **VS Code extension**.
- Keep release documentation consistent, effortless, and AI-driven — all in just a few clicks.

## Project setup

```bash
$ pnpm install --frozen-lock
```

```bash
$ docker-compose up
```

```bash
$ cp .env.example .env
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```