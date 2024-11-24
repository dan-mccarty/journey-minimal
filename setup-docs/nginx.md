
# Gunicorn is a WSGI server that will run your Django application.
# Start Gunicorn: Navigate to your Django project’s root directory and start Gunicorn:

gunicorn --workers 3 your_project_name.wsgi:application

# You can adjust the number of workers (--workers 3) depending on the CPU cores of your server.
# Run Gunicorn in the Background: You can run Gunicorn in the background using systemd or supervisord for production environments. For example, using systemd:
# Create a service file /etc/systemd/system/gunicorn.service:

sudo nano /etc/systemd/system/gunicorn.service

# Add the following content (replace your_project_name with the actual project name and paths):


[Unit]
Description=gunicorn daemon for Django project
After=network.target

[Service]
User=your_user
Group=your_group
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/virtualenv/bin/gunicorn --workers 3 --bind unix:/path/to/your/project/gunicorn.sock your_project_name.wsgi:application

[Install]
WantedBy=multi-user.target


# Then start the service:

sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# You need to create a configuration file for your site under /etc/nginx/sites-available/.
sudo nano /etc/nginx/sites-available/your_project


# Here's a basic Nginx configuration for your Django app with Gunicorn:

server {
    listen 80;
    server_name svr.solarboxaustralia.au 172.236.35.226;  # Replace with your domain or IP

    location / {
        proxy_pass http://unix:/path/to/your/project/gunicorn.sock;  # Path to the Gunicorn 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/your/project/static/;  # The path where collectstatic put your static files
    }

    location /media/ {
        alias /path/to/your/project/media/;  # The path to your media files
    }

    error_log /var/log/nginx/your_project_error.log;
    access_log /var/log/nginx/your_project_access.log;
}



# Enable the Site in Nginx: Create a symbolic link in the sites-enabled directory:

sudo ln -s /etc/nginx/sites-available/your_project /etc/nginx/sites-enabled/

# Check Nginx Configuration: Make sure there are no syntax errors:

sudo nginx -t

# Restart Nginx: Apply the new configuration by restarting Nginx:

sudo systemctl restart nginx



# Restart Nginx: Apply the new configuration by restarting Nginx:

    sudo systemctl restart nginx

# Step 5: (Optional) Configure SSL (HTTPS)

# To secure your site, you may want to configure SSL using Let’s Encrypt.

# Install Certbot:

sudo apt install certbot python3-certbot-nginx


# Obtain SSL Certificate:

sudo certbot --nginx -d your_domain.com

# Auto-Renewal: Let’s Encrypt certificates expire after 90 days, but Certbot sets up automatic renewal by default. You can test the renewal process like this:

sudo certbot renew --dry-run
