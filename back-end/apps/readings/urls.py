from django.urls import path, include
from apps.readings.views import actuation, get_readings, get_actuation

from django.urls import path


urlpatterns = [
    path("actuation/", actuation, name="actuation"),
    path("actuation/<int:id>/", get_actuation, name="get_actuation"), #get de atuações 
    path("<int:id>/", get_readings, name="get_readings"),  # get de readings
]
