FROM node:13-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build

# production stage
FROM nginx:1.17-alpine as production-stage
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]