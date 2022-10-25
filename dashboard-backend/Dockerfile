FROM node:18
   
WORKDIR '/home/node/app'
 
COPY . .
 
RUN npm install
 
EXPOSE 3002
CMD [ "npm", "start" ]