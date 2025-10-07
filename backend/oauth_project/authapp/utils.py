# authapp/utils.py
import requests
import os
from dotenv import load_dotenv
from .models import OAuthToken

load_dotenv()  # Solo para client_id, client_secret y URL

def refresh_token_cron():
    """
    Refresca el access token usando el refresh token de la DB
    y guarda el nuevo token en la DB.
    """
    print("🔄 Intentando refrescar el token...")

    # Obtén el token actual de la DB
    token_obj = OAuthToken.objects.first()  # solo hay 1
    if not token_obj:
        print("❌ No hay token en la DB para refrescar")
        return

    url = os.getenv("GHL_TOKEN_URL")
    data = {
        "client_id": os.getenv("GHL_CLIENT_ID"),
        "client_secret": os.getenv("GHL_CLIENT_SECRET"),
        "grant_type": "refresh_token",
        "refresh_token": token_obj.refresh_token,  # usa DB, no .env
    }

    response = requests.post(url, data=data)

    if response.status_code == 200:
        json_data = response.json()
        token_obj.access_token = json_data.get("access_token")
        if json_data.get("refresh_token"):
            token_obj.refresh_token = json_data.get("refresh_token")
        token_obj.save()
        print("✅ Tokens actualizados correctamente en la DB")
        print("🕒 Última actualización:", token_obj.updated_at)
    else:
        print("❌ Error al refrescar token:", response.text)
