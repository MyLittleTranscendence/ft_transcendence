# yourapp/apps.py
from django.apps import AppConfig


class BackendAppConfig(AppConfig):
    name = 'backend'

    def ready(self):
        from . import signals
