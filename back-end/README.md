docker compose up
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver

ao iniciar o projeto export $(cat .env | xargs)

sudo systemctl disable postgresql
sudo systemctl stop postgresql
docker compose up -d