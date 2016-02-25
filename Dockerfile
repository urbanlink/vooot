FROM node:0.10.40-wheezy

RUN apt-get install -y node node-legacy

COPY . /code
WORKDIR /code

RUN echo "{\"version\": \"`git describe`\", \"deploydate\": \"`date +\"%Y-%m-%dT%H:%M:%SZ\"`\"}" > app/public/VERSION && \
    cd app && \
    npm install

EXPOSE 1337
CMD ["pm2", "app/bundle/main.js"]
