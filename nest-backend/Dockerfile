FROM node:16.18

WORKDIR /usr/src/app

COPY . .

RUN yarn install --prod
RUN yarn build

EXPOSE 3001
CMD ["node","dist/main"]