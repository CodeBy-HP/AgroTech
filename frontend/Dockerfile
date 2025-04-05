FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

# Build the application for production
RUN npm run build

# Run the application
CMD ["npm", "run", "dev"]

# For production, use:
# CMD ["npm", "start"] 