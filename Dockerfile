FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY examples ./examples
COPY tests ./tests
RUN npm test
CMD ["node", "src/cli.js", "examples/run.json"]
