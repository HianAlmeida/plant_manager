from django.urls import path, include
from apps.devices.views import preregister_device, register_device, get_devices

from django.urls import path



urlpatterns = [
    path("preregister/", preregister_device, name="preregister"),
    path("register/", register_device, name="register"),
    path("", get_devices, name="get_devices")
]
