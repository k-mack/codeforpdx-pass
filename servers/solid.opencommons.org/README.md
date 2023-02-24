# Set Up Guide for solid.opencommons.org

The objective of this document is to detail setting up the [Node Solid Server (NSS)][nss-gh] for <https://solid.opencommons.org>.

## Instructions

### SSH into Deployment Host

First, SSH into the host machine:

```bash
ssh -p 9122 kevin@158.69.212.29
```

*Note that the above uses the user `kevin`, but any user with `sudo` privileges can be used.*

### Install Docker and Docker Compose

Docker should already be installed, and this can be checked by running:

```bash
sudo systemctl status docker
```

If it is not, then run the following commands to install it:

```bash
# Update package database
sudo yum check-update

# Add the official Docker repository to `yum`, download latest version of Docker, and install it
curl -fsSL https://get.docker.com/ | sh

# Start Docker daemon
sudo systemctl start docker

# Verify that Docker is running
sudo systemctl status docker

# Configure the system to start Docker at boot time
sudo systemctl enable docker
```

Next, add your user to the system's `docker` group:

```bash
sudo usermod -aG docker $(whoami)
```

Docker Compose should already be installed, and this can be checked by running:

```bash
docker-compose --version
```

If it is not, then run the following commands to install it:

```bash
# Download the latest Docker Compose binary (check version)
sudo curl -L "https://github.com/docker/compose/releases/download/v2.14.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Set permissions to make the binary executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify the installation was successful
docker-compose --version
```

### Get SSL Certificates for solid.opencommons.org

Use `certbot` to obtain SSL certificates for `solid.opencommons.org`.
The deployment environment uses Apache2 (`httpd`) to host multiple services, including `solid.opencommons.org`, so use the `--apache` option to obtain the certificate via apache authorization.

```bash
sudo certbot certonly --apache -d solid.opencommons.org
```

Next, update the Apache configuration file (`/etc/httpd/conf/httpd.conf`) to include the following:

```xml
<VirtualHost *:443>
    DocumentRoot /var/www/opencommons/solid
    ServerName solid.opencommons.org
    <Directory "/var/www/opencommons/solid">
        Options None
        Require all granted
    </Directory>
    SSLCertificateFile /etc/letsencrypt/live/solid.opencommons.org/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/solid.opencommons.org/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateChainFile /etc/letsencrypt/live/solid.opencommons.org/fullchain.pem
#    The following was pulled from the instructions for running Solid behind Apache:
#    https://github.com/nodeSolidServer/node-solid-server/wiki/Running-Solid-behind-a-reverse-proxy/79ed3e5807e50fde8d31ad22d5db5e56176e445a#solution-3-apache
    SSLProxyEngine on
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    ProxyPreserveHost on
    ProxyPass / https://localhost:8443/
    ProxyPassReverse / https://localhost:8443/
</VirtualHost>
<VirtualHost *:80>
    DocumentRoot "/var/www/opencommons/solid"
    ServerName solid.opencommons.org
    <Directory "/var/www/opencommons/solid">
        Options None
        Require all granted
    </Directory>
    RewriteEngine on
    RewriteCond %{SERVER_NAME} =solid.opencommons.org
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
```

Reload the Apache configuration file:

```bash
sudo systemctl reload httpd
```

### Run the Solid Server

Create the data directories for the Solid server:

```bash
mkdir -p /home/kevin/solid/{.db,config,data}
```

Set permissions on these directories so the Solid server is able to read from and write to them:

```bash
chmod 777 /home/kevin/solid/{.db,config,data}
```

Create a Docker Compose file to manage running the Solid server:

```bash
cd /home/kevin/solid
touch docker-compose.simple.yml
```

Use the following for the content of the Docker Compose file

```yaml
# docker-compose.simple.yml
version: '3.7'
services:
  server:
    image: nodesolidserver/node-solid-server:v5.7.4

    # this ensures automatic container start, when host reboots
    restart: always

    # run as root so container can access letsencrypt certs
    user: root

    ports:
      - 8443:8443

    volumes:
      # mount local directories to the container
      - /home/kevin/solid/data:/opt/solid/data
      - /home/kevin/solid/.db:/opt/solid/.db
      - /home/kevin/solid/config:/opt/solid/config

      # mount existing TLS certificates, e.g. from letsencrypt
      - /etc/letsencrypt:/opt/solid/certs

    environment:
      - "SOLID_SERVER_URI=https://solid.opencommons.org"
      - "SOLID_SSL_KEY=/opt/solid/certs/live/solid.opencommons.org/privkey.pem"
      - "SOLID_SSL_CERT=/opt/solid/certs/live/solid.opencommons.org/fullchain.pem"
```

Run the Solid server:

```bash
docker-compose -f docker-compose.simple.yml up -d
```

<!-- Reference links -->
[nss-gh]: https://github.com/nodeSolidServer/node-solid-server
