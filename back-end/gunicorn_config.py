bind = "0.0.0.0:8000"
module = "plant_manager.wsgi:application"

workers = 4  # Adjust based on your server's resources
worker_connections = 1000
threads = 4