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

### Get Wildcard SSL Certificates for *.opencommons.net

Use `certbot` to obtain wildcard SSL certificates for `*.opencommons.net`.
A person with account access on the DNS provider should run the below command.
LetsEncrypt will direct the user to add DNS TXT records to verify ownership of the domain.

```bash
certbot certonly \
  --agree-tos \
  --manual \
  --preferred-challenge=dns \
  --server https://acme-v02.api.letsencrypt.org/directory \
  -d opencommons.net \
  -d "*.opencommons.net"
```

Create a root document directory for `*.opencommons.net`:

```bash
sudo mkdir -p /var/www/wildcard/opencommons.net
```

Update the Apache configuration file (`/etc/httpd/conf/httpd.conf`) to include the following:

```xml
<VirtualHost *:80>
    DocumentRoot "/var/www/wildcard/opencommons.net"
    ServerName opencommons.net
    ServerAlias *.opencommons.net
    <Directory "/var/www/wildcard/opencommons.net">
        Options None
        Require all granted
    </Directory>
    RewriteEngine on
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
<VirtualHost *:443>
    DocumentRoot "/var/www/wildcard/opencommons.net"
    ServerName opencommons.net
    ServerAlias *.opencommons.net
    <Directory "/var/www/wildcard/opencommons.net">
        Options None
        Require all granted
    </Directory>
    SSLCertificateFile /etc/letsencrypt/live/opencommons.net/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/opencommons.net/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateChainFile /etc/letsencrypt/live/opencommons.net/fullchain.pem
    #    The following was pulled from the instructions for running Solid behind Apache:
    #    https://github.com/nodeSolidServer/node-solid-server/wiki/Running-Solid-behind-a-reverse-proxy/79ed3e5807e50fde8d31ad22d5db5e56176e445a#solution-3-apache
    SSLProxyEngine on
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    ProxyPreserveHost on
    ProxyPass / https://localhost:9443/
    ProxyPassReverse / https://localhost:9443/
</VirtualHost>
```

Reload the Apache configuration file:

```bash
sudo systemctl reload httpd
```

### Run the Solid Server

Create the data directories for the Solid server:

```bash
mkdir -p /home/kevin/solid-multiuser/{.db,config,data}
```

Set permissions on these directories so the Solid server is able to read from and write to them:

```bash
chmod 777 /home/kevin/solid-multiuser/{.db,config,data}
```

Create a Docker Compose file to manage running the Solid server:

```bash
cd /home/kevin/solid-multiuser
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
      - 9443:8443

    volumes:
      # mount local directories to the container
      # (!) the host directories have to exist and be owned by UID 1000
      - /home/kevin/solid-multiuser/data:/opt/solid/data
      - /home/kevin/solid-multiuser/.db:/opt/solid/.db
      - /home/kevin/solid-multiuser/config:/opt/solid/config

      # (!) mount existing TLS certificates, e.g. from letsencrypt
      # (!) ensure that the key and fullchain files are readable by UID 1000
      - /etc/letsencrypt:/opt/solid/certs

    environment:
      # Enable multi-user mode
      - "SOLID_MULTIUSER=true"
      # (!) use your actual SOLID_SERVER_URI
      - "SOLID_SERVER_URI=https://opencommons.net"
      - "SOLID_SSL_KEY=/opt/solid/certs/live/opencommons.net/privkey.pem"
      - "SOLID_SSL_CERT=/opt/solid/certs/live/opencommons.net/fullchain.pem"
```

Run the Solid server:

```bash
docker-compose -f docker-compose.simple.yml up -d
```

<!-- Reference links -->
[nss-gh]: https://github.com/nodeSolidServer/node-solid-server
