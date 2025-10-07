from django.db import models

class OAuthToken(models.Model):
    access_token = models.TextField()
    refresh_token = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Token actualizado: {self.updated_at.strftime('%Y-%m-%d %H:%M:%S')}"
