# Step 1: Build process
FROM node:8.11.3-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

# Step 2: Production Env
FROM node:8.11.3-alpine
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package.json yarn.lock ./
COPY --from=build-deps /usr/src/app/dist /usr/src/app/dist
RUN yarn
EXPOSE 8000
CMD [ "yarn", "start:prod"]