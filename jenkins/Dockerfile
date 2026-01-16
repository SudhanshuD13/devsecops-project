FROM jenkins/jenkins:lts

USER root

# Install docker cli
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Add jenkins to docker group (IMPORTANT)
ARG DOCKER_GID=137

RUN groupmod -g ${DOCKER_GID} docker && \
    usermod -aG docker jenkins

# Install gitleaks
RUN curl -sSL https://github.com/gitleaks/gitleaks/releases/download/v8.18.2/gitleaks_8.18.2_linux_x64.tar.gz \
    | tar -xz -C /usr/local/bin gitleaks

USER jenkins

