FROM node:14.15.3-alpine3.12

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY package.json /usr/src/api

COPY package-lock.json /usr/src/api

COPY .npmrc /usr/src/api

ARG DND_NPM_TOKEN

ENV DND_NPM_TOKEN=$DND_NPM_TOKEN

RUN npm install --production

COPY . /usr/src/api

ENV NODE_ENV=[production]

CMD ["npm", "start"]