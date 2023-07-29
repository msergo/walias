FROM node:18-alpine as dev
RUN apk add netcat-openbsd

RUN npm config set update-notifier false
WORKDIR /app

COPY . /app
COPY src ./

RUN npm ci --silent
RUN npm run compile

ENTRYPOINT npm run start

FROM node:18-alpine AS prod
RUN npm config set update-notifier false
WORKDIR /app

COPY --from=dev  /app/package.json /app/package-lock.json /app/
COPY  config /app/config
COPY --from=dev  /app/lib /app/lib

RUN npm ci --only=production --silent

CMD ["npm", "start"]