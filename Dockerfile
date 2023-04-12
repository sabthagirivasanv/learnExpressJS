FROM node:19-alpine3.16

#environmental variables:
ENV MONGO_DB_USERNAME=admin \
    MONG_DB_WD_PWD=admin

RUN mkdir -p /home/app
# install node modules
WORKDIR  /home/app
COPY     package.json package.json
RUN      npm install

# install application
COPY     . .

CMD ["node", "server.js"]