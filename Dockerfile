FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# ✅ ADD THIS LINE HERE
RUN apt-get update && apt-get install -y curl

COPY . .

EXPOSE 8080

CMD ["npm", "start"]