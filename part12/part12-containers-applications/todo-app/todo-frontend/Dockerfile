FROM node:20 AS build-stage

WORKDIR /usr/src/app
COPY . .

RUN npm ci

RUN npm run build

FROM node:20 AS test-stage

WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/ /usr/src/app/

RUN npm ci

RUN npm install --save-dev @testing-library/react @testing-library/jest-dom

RUN npm test


FROM test-stage AS serve-stage

WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/dist ./dist

RUN npm install -g serve

CMD ["serve", "dist"]
