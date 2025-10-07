# authapp/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import refresh_token_cron
from .models import OAuthToken

@api_view(["GET"])
def get_tokens(request):
    token = OAuthToken.objects.first()
    return Response({
        "access_token": token.access_token,
        "refresh_token": token.refresh_token,
        "updated_at": token.updated_at
    })

@api_view(["POST"])
def generate_new_token(request):
    refresh_token_cron()  # Fuerza la actualización
    token = OAuthToken.objects.first()
    return Response({
        "access_token": token.access_token,
        "refresh_token": token.refresh_token,
        "updated_at": token.updated_at
    })
