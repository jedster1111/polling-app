FROM node:10.12.0-alpine
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn
COPY . .
EXPOSE 8000
CMD ["yarn", "start"]