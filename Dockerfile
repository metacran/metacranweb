FROM node:20-alpine

WORKDIR /src
COPY package*.json /

RUN npm install -g nodemon && npm install
COPY . .
RUN npm install

EXPOSE 80
ENV PORT=80

CMD ["npm", "start"]
