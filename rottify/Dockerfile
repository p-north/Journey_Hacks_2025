# Use the official Node.js image
FROM node:18-alpine AS builder

# Working Directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json

# Install dependencies 
RUN npm install

# Copy the rest of code
COPY . .

# Build the Next app
RUN npm run build

# Smaller image for production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json* /app/yarn.lock* ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

# Install production dependencies 
RUN npm install --omit=dev

# Port
EXPOSE 3001

# Start the next app
CMD [ "npm", "run", "start" ]

