# --------------> The build image
FROM node:alpine AS build
RUN apk add git
WORKDIR /usr/src/app
COPY . .
RUN yarn install

# --------------> The production image
FROM node:alpine
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
CMD ["yarn", "start"]