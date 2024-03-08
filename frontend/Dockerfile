FROM nginx:alpine

RUN apk add --no-cache openssl

RUN mkdir -p /etc/nginx/certs

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/nginx-selfsigned.key \
    -out /etc/nginx/certs/nginx-selfsigned.crt \
    -subj "/C=KR/ST=Seoul/L=Gangnam-gu/O=42Seoul/OU=Education/CN=localhost"

COPY ./default.conf /etc/nginx/conf.d/default.conf