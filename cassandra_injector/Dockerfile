FROM node:latest

# Create app directory
WORKDIR dbinterface

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4004

CMD ["node", "server/index.js"]
