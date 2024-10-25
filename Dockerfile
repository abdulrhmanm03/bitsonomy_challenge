# Use an official Node.js image
FROM node:alpine

# Set the working directory
WORKDIR usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Install TypeScript globally and build the TypeScript project
RUN npm install -g typescript
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

