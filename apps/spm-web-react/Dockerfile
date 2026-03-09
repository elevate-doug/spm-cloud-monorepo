# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# VITE_API_BASE_URL defaults to empty so the app uses relative paths through the YARP proxy
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve with a lightweight web server (Nginx)
FROM nginx:alpine
# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the build output from the first stage
# Note: For Vite, the folder is usually 'dist'; for Create React App, it's 'build'
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for Azure Container Apps
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]