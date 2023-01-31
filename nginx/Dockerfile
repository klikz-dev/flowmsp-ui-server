# Base on offical NGINX Alpine image
FROM nginx:alpine

ARG UI_VERSION

# these variables used by nginx config to determine config to serve
ENV UI_VERSION=${UI_VERSION}

LABEL UI_VERSION=${UI_VERSION}

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80 443

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]