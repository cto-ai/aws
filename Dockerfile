FROM registry.cto.ai/official_images/node:latest
ENV DEBIAN_FRONTEND noninteractive
ADD package.json .
RUN npm install
RUN sed -i'' -e '/^path-exclude \/usr\/share\/groff\/\*/d' /etc/dpkg/dpkg.cfg.d/docker
RUN apt-get update && apt-get install -y --no-install-recommends \
  python \
  groff \
  less \
  grep \
  bsdmainutils \
  python-pip \
  python-setuptools \
  python-wheel \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists

RUN pip install awscli

WORKDIR /ops
COPY . .
