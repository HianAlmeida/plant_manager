from django.urls import path, include
from apps.devices.views import preregister_device, register_device, get_devices, get_device, get_device_esp

from django.urls import path



urlpatterns = [
    path("preregister/", preregister_device, name="preregister"),
    path("register/", register_device, name="register"),
    path("", get_devices, name="get_devices"),
    path("<int:id>/", get_device, name="get_device"),
    path("info/<int:id>/", get_device_esp, name="get_device_esp")
]
