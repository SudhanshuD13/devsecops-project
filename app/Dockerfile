FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install only production deps
RUN npm ci --only=production

# 🔐 Trivy filesystem scan during build
# (this fails build if HIGH/CRITICAL found)
RUN apk add --no-cache curl && \
    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
    | sh -s -- -b /usr/local/bin && \
    trivy fs . --severity HIGH,CRITICAL --exit-code 1

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]

