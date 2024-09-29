from django.urls import path, include
from apps.readings.views import actuation, get_readings

from django.urls import path


urlpatterns = [
    path("actuation/", actuation, name="actuation"),
    path("<int:id>/", get_readings, name="leitura"),  # Nova rota para readings
]
