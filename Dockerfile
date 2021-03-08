FROM node:14.15.3-alpine3.12

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY package.json /usr/src/api

COPY models/ /usr/src/api/models

RUN npm install --production --silent

COPY . /usr/src/api

ENV NODE_ENV=[production]

CMD ["npm", "start"]