FROM node:16.18

WORKDIR /usr/src/app

COPY . .

RUN yarn install --prod

ARG REACT_APP_API_URL

RUN sh create-env.sh REACT_APP_API_URL=$REACT_APP_API_URL

RUN yarn build
RUN yarn global add serve

EXPOSE 3000

CMD serve -s build