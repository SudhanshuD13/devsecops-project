FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install only production deps
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]

