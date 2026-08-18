from django.urls import path

from inventory.applications_view import ApplicationListView
from inventory.devices_view import DeviceListView
from inventory.users_view import UserListView

urlpatterns = [
    path('applications/', ApplicationListView.as_view(), name='applications-list'),
    path('devices/', DeviceListView.as_view(), name='devices-list'),
    path('users/', UserListView.as_view(), name='users-list'),
]
