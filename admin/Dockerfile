FROM node:16
WORKDIR /app
RUN echo "Copying files...."
COPY . .
WORKDIR app/admin
RUN npm install
CMD ["npm","run","build"]
EXPOSE 6001
