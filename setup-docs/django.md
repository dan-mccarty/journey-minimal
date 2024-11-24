
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install pm2 -g


python manage.py collectstatic

DEBUG = False

ALLOWED_HOSTS = [ 
    'svr.solarboxaustralia.au', 
    '172.236.35.226', 
    'localhost', 
    '127.0.0.1' 
]

ALLOWED_HOSTS = ['*']


# You can install Gunicorn and Nginx as follows:

# Install Gunicorn
pip install gunicorn

# Install Nginx (on Ubuntu/Debian)
sudo apt update
sudo apt install nginx


gunicorn --workers 3 django_backend.wsgi:application