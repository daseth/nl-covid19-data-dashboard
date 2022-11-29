# Layer that always gets executed
FROM ${REGISTRY_NAME}/baseimages/node:lts-alpine

# Map arguments to environment variables
ARG ARG_NEXT_PUBLIC_SANITY_DATASET
ARG ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ARG ARG_NEXT_PUBLIC_COMMIT_ID
ARG ARG_NEXT_PUBLIC_PHASE="production"
ARG ARG_NEXT_PUBLIC_HOT_RELOAD_LOKALIZE=0
ARG ARG_API_URL

ENV NEXT_PUBLIC_SANITY_DATASET=$ARG_NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_COMMIT_ID=$ARG_NEXT_PUBLIC_COMMIT_ID
ENV NEXT_PUBLIC_PHASE=$ARG_NEXT_PUBLIC_PHASE
ENV NEXT_PUBLIC_HOT_RELOAD_LOKALIZE=ARG_NEXT_PUBLIC_HOT_RELOAD_LOKALIZE
ENV API_URL=$ARG_API_URL

# Yarn download uses the API_URL env variable to download the zip with JSONs from the provided URL.
RUN yarn download \
&& yarn workspace @corona-dashboard/cli validate-json-all \
&& yarn workspace @corona-dashboard/cli validate-last-values --fail-early \
&& yarn workspace @corona-dashboard/cms lokalize:import --dataset=$NEXT_PUBLIC_SANITY_DATASET \
&& yarn workspace @corona-dashboard/app build \
&& mkdir -p /app/packages/app/public/images/choropleth \
&& addgroup -g 1001 -S nodejs \
&& adduser -S nextjs -u 1001 \
&& chown -R nextjs:nodejs /app/packages/app/.next \
&& chown -R nextjs:nodejs /app/packages/app/public/images/choropleth

USER nextjs

CMD ["yarn", "start"]
