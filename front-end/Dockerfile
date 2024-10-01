FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install -g react-scripts
RUN npm install -g typescript --save
RUN npm install --global --save --prefer-online
COPY . .
EXPOSE 3000
ENV NODE_PATH=/app/node_modules

CMD ["npm", "start"]