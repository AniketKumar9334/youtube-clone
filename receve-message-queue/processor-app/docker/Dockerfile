FROM node:18

WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm install


RUN apt-get update && apt-get install -y ffmpeg

CMD ["node", "index.js"]
