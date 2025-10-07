# authapp/scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django.db import connection
from .utils import refresh_token_cron

def tables_exist():
    """Verifica que las tablas de django_apscheduler existan antes de iniciar."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
    return (
        "django_apscheduler_djangojob" in tables and
        "django_apscheduler_djangojobexecution" in tables
    )

def start():
    if not tables_exist():
        print("⚠️ Tablas de django_apscheduler aún no existen. Ejecuta 'python manage.py migrate' primero.")
        return

    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")

    # Job que refresca el token cada 23 horas
    scheduler.add_job(
        refresh_token_cron,
        "interval",
        hours=23,
        id="refresh_token_job",
        replace_existing=True,
    )

    scheduler.start()
    print("✅ Scheduler iniciado correctamente")
