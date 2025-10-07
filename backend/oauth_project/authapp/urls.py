# authapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("tokens/", views.get_tokens),
    path("tokens/new/", views.generate_new_token),
]
