FROM node:14.16.1-alpine3.13

RUN yarn set version berry

WORKDIR /usr/src/api

ARG DND_NPM_TOKEN

ENV DND_NPM_TOKEN=$DND_NPM_TOKEN

ENV NODE_ENV=[production]

COPY .yarn ./.yarn/

COPY .yarnrc.yml package.json yarn.lock ./

COPY server ./server/

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]