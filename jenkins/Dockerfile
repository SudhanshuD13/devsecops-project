FROM jenkins/jenkins:lts

USER root

# Install Docker + docker-compose
RUN apt-get update && \
    apt-get install -y docker.io docker-compose && \
    apt-get clean

# Match docker group GID with host
ARG DOCKER_GID=137
RUN groupmod -g ${DOCKER_GID} docker && \
    usermod -aG docker jenkins

USER jenkins

