from django.urls import path, include
from apps.devices.views import preregister_device, register_device

from django.urls import path



urlpatterns = [
    path("preregister/", preregister_device, name="preregister"),
    path("register/", register_device, name="register"),

]
