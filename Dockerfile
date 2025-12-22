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

# Build the React application
RUN npm run build

# Install serve to serve the buildd application
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "build", "-l", "0.0.0.0:${PORT}"]
