# Token Refresh Manager
Un sistema completo de gestión automática de tokens OAuth con frontend React y backend Django, diseñado para mantener tokens de acceso actualizados mediante refresh tokens automáticos.

## 🎯 Descripción del Proyecto
Este proyecto consiste en una aplicación full-stack que automatiza la renovación de tokens OAuth. El sistema refresca automáticamente el access token cada 23 horas usando el refresh token, garantizando que siempre tengas credenciales válidas disponibles.

### Características principales:
- ⚡ **Actualización automática**: Scheduler que refresca tokens cada 23 horas
- 🔄 **Generación manual**: Botón para forzar la actualización inmediata
- ⏱️ **Contador en tiempo real**: Visualización dinámica del tiempo restante hasta la expiración
- 📊 **Barra de progreso**: Indicador visual que muestra el ciclo de vida del token
- 🌓 **Modo oscuro/claro**: Interfaz adaptable con toggle de tema
- 📱 **Diseño responsivo**: Interfaz moderna usando React y CSS
- 🔐 **API REST**: Backend Django con endpoints seguros
- 💾 **Persistencia**: Almacenamiento de tokens en base de datos SQLite

## 🏗️ Arquitectura

### Backend (Django)
```
backend/oauth_project/authapp/
├── models.py          # Modelo OAuthToken para almacenar tokens
├── utils.py           # Lógica de refresh de tokens
├── scheduler.py       # APScheduler para tareas automáticas
├── views.py           # Endpoints de API
└── urls.py            # Rutas de la aplicación
```

### Frontend (React)
```
frontend/src/
├── components/
│   ├── Header.jsx       # Barra superior con botón y toggle
│   └── TokenCard.jsx    # Tarjeta para mostrar tokens
├── api.js              # Cliente HTTP para backend
└── App.jsx             # Componente principal
```

## 🚀 ¿Cómo funciona?

### Flujo de Actualización Automática
1. **Inicio del sistema**: Al arrancar el servidor Django, el scheduler se inicializa automáticamente
2. **Verificación de tablas**: El sistema verifica que la base de datos esté correctamente migrada
3. **Programación de tareas**: Se programa un job que se ejecutará cada 23 horas
4. **Ejecución automática**: Cada 23 horas, el sistema:
   - Toma el refresh token actual de la base de datos
   - Hace una petición al proveedor OAuth para obtener un nuevo access token
   - Guarda el nuevo access token en la base de datos
   - Actualiza la fecha y hora de la última renovación

### Flujo de Actualización Manual
1. **Usuario hace clic**: El usuario presiona el botón "Generar Nuevo Token"
2. **Petición al backend**: El frontend envía una petición POST al endpoint `/tokens/new/`
3. **Renovación inmediata**: El backend ejecuta el proceso de refresh de forma inmediata
4. **Respuesta al frontend**: Se devuelven los nuevos tokens y la fecha de actualización
5. **Actualización de UI**: La interfaz muestra los nuevos tokens y confirma la actualización

### Visualización en el Frontend
- **Carga inicial**: Al abrir la aplicación, se solicitan los tokens actuales al backend
- **Visualización de tokens**: Se muestran dos tarjetas:
  - Una para el Access Token
  - Una para el Refresh Token
- **Contador en tiempo real**: El sistema incluye un temporizador dinámico que muestra:
  - Tiempo restante hasta la expiración del access token (24 horas)
  - Formato legible: horas, minutos y segundos (ej: 23h 45m 30s)
  - Barra de progreso visual que disminuye conforme pasa el tiempo
  - Actualización automática cada segundo sin necesidad de recargar
- **Indicador de tiempo**: Se muestra la última fecha y hora de actualización
- **Estados visuales**:
  - Indicador de carga mientras se procesan las peticiones
  - Feedback visual cuando se completa una actualización
  - El contador se reinicia automáticamente al generar nuevos tokens

## 📋 Requisitos

### Backend
- Django >= 4.0
- djangorestframework
- django-cors-headers
- APScheduler
- django-apscheduler

### Frontend
- React >= 18
- Vite (build tool)

## ⚙️ Configuración

### 1. Backend
```bash
cd backend/oauth_project
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Configuración Inicial de Tokens en la Base de Datos

**⚠️ IMPORTANTE**: Antes de que el sistema pueda funcionar, necesitas ingresar manualmente el **refresh token** inicial en la base de datos. Este es el paso más crítico para el funcionamiento del sistema.

#### Opción 1: Usando Django Shell (Recomendado)
```bash
cd backend/oauth_project
python manage.py shell
```

Luego ejecuta el siguiente código:
```python
from authapp.models import OAuthToken

# Crear o actualizar el token
token, created = OAuthToken.objects.get_or_create(id=1)
token.access_token = "tu_access_token_inicial_aqui"
token.refresh_token = "tu_refresh_token_aqui"  # ¡Este es el MÁS IMPORTANTE!
token.save()

print("✅ Tokens guardados correctamente")
```

#### Opción 2: Usando el Admin de Django
1. Crea un superusuario:
   ```bash
   python manage.py createsuperuser
   ```
2. Accede a `http://localhost:8000/admin/`
3. Ve a la sección "OAuth Tokens"
4. Crea un nuevo registro o edita el existente
5. Ingresa tu `refresh_token` (obligatorio) y opcionalmente el `access_token`

#### Opción 3: Script de Inicialización
Puedes crear un archivo `init_tokens.py` en la carpeta del proyecto:
```python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oauth_project.settings')
django.setup()

from authapp.models import OAuthToken

# Reemplaza estos valores con tus tokens reales
ACCESS_TOKEN = "tu_access_token_inicial"
REFRESH_TOKEN = "tu_refresh_token_aqui"  # ¡CRÍTICO!

token, created = OAuthToken.objects.get_or_create(id=1)
token.access_token = ACCESS_TOKEN
token.refresh_token = REFRESH_TOKEN
token.save()

if created:
    print("✅ Tokens creados exitosamente")
else:
    print("✅ Tokens actualizados exitosamente")
```

Ejecuta el script:
```bash
python init_tokens.py
```

> **Nota**: El **refresh token** es el más importante ya que es el que permite al sistema generar nuevos access tokens automáticamente. Sin un refresh token válido, el sistema no podrá funcionar.

## 🔧 Variables de entorno
Configura en tu backend (settings.py o .env):

```python
OAUTH_CLIENT_ID = "tu_client_id"
OAUTH_CLIENT_SECRET = "tu_client_secret"
OAUTH_REFRESH_URL = "https://oauth.provider.com/token"
```

## 📡 Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tokens/` | Obtiene los tokens actuales almacenados y su fecha de actualización |
| POST | `/tokens/new/` | Fuerza una renovación inmediata de los tokens |

### Respuesta de ejemplo:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "def502003d8b7c4e...",
  "updated_at": "2025-10-07T14:30:00Z"
}
```

## 🔄 Ciclo de Vida de los Tokens

### Estado Normal
- El access token es válido y puede usarse para autenticar peticiones
- El refresh token permanece constante
- El sistema espera hasta que pasen 23 horas

### Antes de la Expiración (23 horas)
- El scheduler detecta que es momento de renovar
- Automáticamente inicia el proceso de refresh
- No requiere intervención del usuario

### Durante la Renovación
- Se solicita un nuevo access token usando el refresh token
- El proveedor OAuth valida y genera nuevas credenciales
- Los tokens se actualizan en la base de datos

### Después de la Renovación
- El nuevo access token está listo para usarse
- Se registra la fecha y hora de actualización
- El ciclo vuelve a comenzar

## 🎨 Características de la Interfaz

### Modo Oscuro/Claro
- Toggle ubicado en el header para cambiar entre temas
- El cambio se aplica instantáneamente a toda la aplicación
- Preferencia visual almacenada durante la sesión

### Visualización de Tokens
- Tarjetas con diseño moderno tipo glassmorphism
- Texto monoespaciado para mejor legibilidad de tokens
- Posibilidad de copiar tokens al portapapeles (funcionalidad del componente)

### Contador de Tiempo Restante
- **Temporizador en vivo**: Muestra exactamente cuánto tiempo queda antes de que expire el access token
- **Formato intuitivo**: Desplegado en horas, minutos y segundos (23h 45m 30s)
- **Barra de progreso visual**: Representación gráfica que se reduce gradualmente
- **Actualización continua**: El contador disminuye cada segundo de forma automática
- **Reinicio automático**: Al generar nuevos tokens, el contador vuelve a 24 horas
- **Sincronización precisa**: Calcula el tiempo basándose en la fecha de última actualización del backend

### Feedback Visual
- Animaciones suaves al generar nuevos tokens
- Indicador de "Cargando..." mientras se procesan peticiones
- Actualización inmediata de la fecha tras renovación exitosa

## 🔒 Seguridad

### Protección de Credenciales
- Los tokens nunca se exponen en el código del frontend
- Las credenciales OAuth están en el backend, no en el navegador
- El refresh token se mantiene seguro en la base de datos

### Comunicación Segura
- CORS configurado para permitir solo orígenes autorizados
- API REST con validación de peticiones
- Tokens transmitidos mediante HTTPS en producción (recomendado)

### Almacenamiento
- Base de datos SQLite para desarrollo
- Un solo registro activo de tokens por seguridad
- Histórico de actualizaciones mediante timestamp

## 🎯 Casos de Uso

### Desarrollo de APIs
Mantén tus tokens de desarrollo siempre actualizados sin tener que renovarlos manualmente cada vez que expiran.

### Integración con Servicios Externos
Automatiza la autenticación con servicios de terceros que requieren OAuth, evitando interrupciones por tokens expirados.

### Aplicaciones de Larga Duración
Ideal para aplicaciones que deben mantener conexiones activas por períodos extendidos sin intervención manual.

### Testing y QA
Facilita las pruebas al garantizar que siempre haya tokens válidos disponibles para el equipo de testing.

## 🛠️ Mantenimiento

### Monitoreo
- Revisa los logs del servidor para verificar que el scheduler se ejecuta correctamente
- Comprueba la fecha de última actualización en el frontend
- Valida que los tokens se renueven cada 23 horas

### Resolución de Problemas
- Si los tokens no se actualizan, verifica las credenciales OAuth
- Confirma que el scheduler esté activo revisando los logs de Django
- Asegúrate de que la base de datos esté correctamente migrada
- **Verifica que el refresh token inicial esté correctamente guardado en la base de datos**

## 📊 Beneficios del Sistema

✅ **Sin intervención manual**: Una vez configurado, funciona completamente automático.

✅ **Alta disponibilidad**: Los tokens siempre están actualizados y disponibles.

✅ **Visibilidad total**: Interfaz clara para monitorear el estado de los tokens en tiempo real.

✅ **Control de expiración**: Nunca pierdas la noción de cuándo expirará tu Access Token.

✅ **Flexibilidad**: Opción de renovación manual cuando sea necesario.

✅ **Experiencia de usuario mejorada**: Contador visual intuitivo con barra de progreso.

✅ **Escalable**: Fácil de adaptar para múltiples proveedores OAuth.

## 🚀 Próximas Mejoras

- [ ] Soporte para múltiples proveedores OAuth simultáneos
- [ ] Notificaciones por email cuando falle una renovación
- [ ] Dashboard con estadísticas de uso y renovaciones
- [ ] Historial de renovaciones exitosas y fallidas
- [ ] Exportación de tokens para uso en otras herramientas
- [ ] API para integración con CI/CD pipelines

## 📄 Licencia
Este proyecto está bajo licencia MIT.

---

Desarrollado con ❤️ usando React + Django
