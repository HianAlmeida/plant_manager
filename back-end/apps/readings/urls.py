from django.urls import path, include
from apps.readings.views import actuation

from django.urls import path


urlpatterns = [
    path("actuation/", actuation, name="actuation"),
]
