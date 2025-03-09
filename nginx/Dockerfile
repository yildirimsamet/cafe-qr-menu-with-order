FROM nginx:latest as production

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./certs /etc/nginx/certs
COPY ./dhparam.pem /etc/nginx/dhparam.pem

CMD ["nginx", "-g", "daemon off;"]

FROM nginx:latest AS development

COPY ./nginx.dev.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]