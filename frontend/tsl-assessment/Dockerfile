FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy code and execute production build
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner
ENV NODE_ENV=production

# Copy static artifacts from build to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
