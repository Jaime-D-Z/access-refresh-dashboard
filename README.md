# Token Refresh Manager

Un sistema completo de gestión automática de tokens OAuth con frontend React y backend Django, diseñado para mantener tokens de acceso actualizados mediante refresh tokens automáticos.

## 🎯 Descripción del Proyecto

Este proyecto consiste en una aplicación full-stack que automatiza la renovación de tokens OAuth. El sistema refresca automáticamente el access token cada 23 horas usando el refresh token, garantizando que siempre tengas credenciales válidas disponibles.

### Características principales:

- ⚡ **Actualización automática**: Scheduler que refresca tokens cada 23 horas
- 🔄 **Generación manual**: Botón para forzar la actualización inmediata
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

1. **Carga inicial**: Al abrir la aplicación, se solicitan los tokens actuales al backend
2. **Visualización de tokens**: Se muestran dos tarjetas:
   - Una para el Access Token
   - Una para el Refresh Token
3. **Indicador de tiempo**: Se muestra la última fecha y hora de actualización
4. **Estados visuales**: 
   - Indicador de carga mientras se procesan las peticiones
   - Feedback visual cuando se completa una actualización

## 📋 Requisitos

### Backend
```
Django >= 4.0
djangorestframework
django-cors-headers
APScheduler
django-apscheduler
```

### Frontend
```
React >= 18
Vite (build tool)
```

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

## 🔧 Variables de entorno

Configura en tu backend (`settings.py` o `.env`):

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

**Respuesta de ejemplo:**
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

## 📊 Beneficios del Sistema

✅ **Sin intervención manual**: Una vez configurado, funciona completamente automático
✅ **Alta disponibilidad**: Los tokens siempre están actualizados y disponibles
✅ **Visibilidad**: Interface clara para monitorear el estado de los tokens
✅ **Flexibilidad**: Opción de renovación manual cuando sea necesario
✅ **Escalable**: Fácil de adaptar para múltiples proveedores OAuth

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

**Desarrollado con ❤️ usando React + Django**
