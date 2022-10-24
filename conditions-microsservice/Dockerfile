FROM node:18
   
WORKDIR '/home/node/app'
 
COPY . .
 
RUN npm install
 
EXPOSE 3100
CMD [ "npm", "start" ]