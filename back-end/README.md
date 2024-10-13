docker compose up
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver

ao iniciar o projeto export $(cat .env | xargs)

sudo systemctl disable postgresql
sudo systemctl stop postgresql
docker compose up -d


docker compose up --build

TODOS: 
1 - trocar as rotas de get dentro de back-end/apps/readings/views.py para um serializers (back-end/apps/readings/serializers.py)
2 - como seria possível verificar quanto tempo o LED passou ligado durante o dia 
3 - mensagem de erro quando o cadastro de usuário falhar (FRONT)
4 - verificar porque o cadastro não está centralizado na tela
5 - rota de atualizar dispositivo
6 - useefect em todas as rotas do historico