FROM node:20-bullseye-slim as base

ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3 curl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

ADD package.json ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD database .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/database /app/database

# Write the start script
RUN echo "#!/bin/sh\nset -x\nnpx prisma generate\nnpx prisma migrate deploy\nnpm run start" > /app/start.sh && chmod +x /app/start.sh

ENTRYPOINT [ "./start.sh" ]