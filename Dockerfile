FROM ubuntu:latest

ENV USER b4s
ENV GROUP b4s





WORKDIR /app

RUN groupadd -r ${GROUP} && \
    useradd -r -g ${GROUP} ${USER} -d /app && \
    mkdir -p /app && \
    chown -R ${USER}:${GROUP} /app

COPY . /app

EXPOSE  5000
RUN cd /app
RUN node --version
RUN npm -v
RUN npm install

# Install puppeteer so it's available in the container.
RUN npm i puppeteer


RUN chown -R ${USER}:${GROUP} /app
RUN chmod +x /app/test.sh

USER ${USER}

RUN /app/test.sh