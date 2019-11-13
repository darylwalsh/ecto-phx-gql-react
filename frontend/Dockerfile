# production environment
FROM nginx:1.17-alpine
COPY build/ /usr/share/nginx/html
# RUN rm -rf /etc/nginx/conf.d
# COPY nginx /etc/nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
# CMD ["nginx", "-g", "daemon off;"]
