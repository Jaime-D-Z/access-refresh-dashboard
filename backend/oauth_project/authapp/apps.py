# authapp/apps.py
from django.apps import AppConfig
from django.db.utils import OperationalError, ProgrammingError

class AuthappConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "authapp"

    def ready(self):
        try:
            from . import scheduler
            scheduler.start()
        except (OperationalError, ProgrammingError):
            # Evita error si las tablas no existen aún
            print("⚠️ Scheduler no iniciado todavía (probablemente migraciones pendientes).")
        except Exception as e:
            print(f"⚠️ Error al iniciar el scheduler: {e}")
