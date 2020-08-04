FROM node:10.15.3
WORKDIR /release
COPY package.json /release
RUN npm install

COPY . /release
RUN ls
RUN npm run build
