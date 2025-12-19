# Use official Node.js 22 LTS image from Docker Hub
FROM node:22

# Default port (Cloud Run will override this via PORT env)
ENV PORT=3000

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application
CMD exec npm start --port $PORT
