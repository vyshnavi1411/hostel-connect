# Use Node.js 20 alpine for a small image size
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the API port
EXPOSE 5000

# Set default environment variables
ENV PORT=5000
ENV MONGO_URI=mongodb://mongo:27017/hostelconnect

# Command to run the application
CMD ["node", "server.js"]
