FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install ffmpeg early to cache this step unless base image changes
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["node", "index.js"]
