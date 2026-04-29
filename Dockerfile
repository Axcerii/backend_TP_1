FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
