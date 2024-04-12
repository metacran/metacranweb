FROM node:8-alpine AS build

RUN apk add --no-cache git python make gcc musl-dev g++

WORKDIR /src
COPY package*.json /

RUN npm install -g nodemon && npm install
COPY . .
RUN npm install

FROM node:8-alpine as final

COPY --from=build /src /src
WORKDIR /src
EXPOSE 80
ENV PORT=80

CMD ["npm", "start"]
