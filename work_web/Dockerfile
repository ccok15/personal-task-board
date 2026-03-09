ARG NODE_IMAGE=node:20-alpine
FROM ${NODE_IMAGE}

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED="1"

ARG DATABASE_URL="postgresql://postgres:postgres@db:5432/personal_task_board?schema=public"
ARG NEXTAUTH_URL="http://localhost:3000"
ARG NEXTAUTH_SECRET="build-only-secret"

ENV DATABASE_URL="$DATABASE_URL"
ENV NEXTAUTH_URL="$NEXTAUTH_URL"
ENV NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma:generate
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
