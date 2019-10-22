############################
# Build container
############################
FROM alpine:latest AS dep

WORKDIR /ops

ADD package.json .
RUN apk add --no-cache \
  bash \
  gawk \
  sed \
  grep \
  bc \
  coreutils \
  --update npm \
  && npm install


############################
# Final container
############################
FROM dep

RUN apk add --no-cache \
  tar \
  python \
  groff \
  less \
  util-linux \
  && apk add --no-cache \
  --virtual build-dependencies \
  py-pip \
  && pip install --upgrade \
  awscli \
  && apk del build-dependencies

WORKDIR /ops
COPY . .

COPY --from=dep /ops .