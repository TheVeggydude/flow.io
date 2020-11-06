FROM node:latest

# Create app directory
WORKDIR kafka_streaming

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4002

CMD ["node", "server/index.js"]
