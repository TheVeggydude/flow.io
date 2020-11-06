FROM node:latest

# Create app directory
WORKDIR backend

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4003

CMD ["node", "server/index.js"]
