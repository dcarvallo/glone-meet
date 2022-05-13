# Glone-meet

Proyecto clone de Google Meet para el Hackaton de Midudev https://www.twitch.tv/midudev

## Caracteristicas

- Ingreso de mediante cuenta Google.
- Tipo de usuario: Creador de sala, participante.
- Lista de participantes (búsqueda).
- Video on/off
- Audio on/off
- Compartir pantalla. 
- Chat de sala.
- Modos de visualización.
- Reacciones con emoticonos (thumb up, smile, sad, raise hand).
- Creador de sala:
	- Permisos de acceso a sala (admitir solicitud, rechazar solicitud, admitir todos solicitantes).
	- Sacar participante de la sala.
	- Silenciar participantes.
	- Finalizar reunion para todos.


##Configuración

Credenciales en .env, una vez creado cuenta en twilio dentro la carpeta serverless

    ACCOUNT_SID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    API_KEY_SID=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
    API_KEY_SECRET=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ

    TWILIO_CHAT_SERVICE_SID=XXXXXXXXXXXXXXXXXXXXXXXXX
    
Dentro de .env de react las credenciales de autenticación con Auth0, una vez creada la cuenta.

    REACT_APP_AUTH0_DOMAIN=XXXXXXXXXXXXXXXXXXXXXXXXXXX
    REACT_APP_AUTH0_CLIENT_ID=YYYYYYYYYYYYYYYYYYYYYYYYYYYY