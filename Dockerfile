FROM node:12
WORKDIR /app
COPY ./ ./
RUN npm install
WORKDIR /app/frontend
RUN npm install
RUN npm run build:stage
RUN cp -r ./build ./../spaBuild
WORKDIR /app
EXPOSE 5060
CMD [ "node", "run", "start" ]