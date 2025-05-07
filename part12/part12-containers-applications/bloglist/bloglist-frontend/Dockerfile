FROM node:20 AS build-stage

WORKDIR /usr/src/app
COPY . .

RUN npm ci

RUN npm run build

FROM build-stage AS serve-stage

WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/dist ./dist

RUN npm install -g serve

#force port 3000. Not sure if this is mandatory but before running npm run build on host once was having issues that based on logss made me think I wasn't serving 3000 for some reason.. Since it works, Im not touching it
#Those were entirely caused by the dist content missing on host for copy though... The error was entirely silent too...
CMD ["serve", "dist", "-s", "-l", "3000"]
