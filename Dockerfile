# Stage 1: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the static files we just built in the 'dist' folder 
# to the location Nginx expects them
COPY dist /usr/share/nginx/html

# Expose port 80 (internal to the container)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
