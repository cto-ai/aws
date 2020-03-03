############################
# Build container
############################
# FROM alpine:latest AS dep

# WORKDIR /ops

# ADD package.json .
# RUN apk add --no-cache \
#   bash \
#   gawk \
#   sed \
#   grep \
#   bc \
#   coreutils \
#   --update npm \
#   && npm install


############################
# Final container
############################
FROM registry.cto.ai/official_images/node:latest
ENV DEBIAN_FRONTEND noninteractive
ADD package.json .
# RUN  apt update && apt-get install -y \
#   bash \
#   gawk \
#   sed \
#   grep \
#   bc \
#   coreutils \
#   --update npm \
RUN npm install
RUN sed -i'' -e '/^path-exclude \/usr\/share\/groff\/\*/d' /etc/dpkg/dpkg.cfg.d/docker
RUN apt update && apt-get install -y \
  python \
  groff \
  less \
  grep \
  bsdmainutils \
  python-pip

RUN pip install awscli

WORKDIR /ops
COPY . .

# COPY --from=dep /ops .