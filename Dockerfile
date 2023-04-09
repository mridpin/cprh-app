FROM node:14.16.0

# Create app directory
WORKDIR /usr/cprh/api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --production

# Bundle app source
COPY . .

EXPOSE 10000

CMD [ "npm", "start" ]