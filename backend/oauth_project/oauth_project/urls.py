from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authapp/', include('authapp.urls')),  # <- esto es clave
]
