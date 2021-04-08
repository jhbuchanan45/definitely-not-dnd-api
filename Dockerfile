FROM node:14.16.1-alpine3.13

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

ARG DND_NPM_TOKEN

ENV DND_NPM_TOKEN=$DND_NPM_TOKEN

COPY .npmrc /usr/src/api

COPY package.json /usr/src/api

COPY yarn.lock /usr/src/api

RUN yarn install --production

ENV NODE_ENV=[production]

COPY . /usr/src/api

CMD ["yarn", "start"]