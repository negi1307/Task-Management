FROM node:16
WORKDIR /app
RUN echo "Copying files...."
COPY . .
WORKDIR app/sales
RUN npm install
CMD ["npm","run","build"]
EXPOSE 6003
