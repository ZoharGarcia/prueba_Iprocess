@component('mail::message')
# ¡Bienvenido a Proyecto X, {{ $name }}! 👋

Gracias por registrarte. Estamos emocionados de tenerte con nosotros.

Para completar tu registro y activar tu cuenta, usa este código de verificación:

@component('mail::panel')
# {{ $code }}
@endcomponent

Este código expira en **15 minutos**.

Si no solicitaste este registro, ignora este mensaje.

¡Nos vemos pronto!

Saludos,<br>
El equipo de Proyecto X
@endcomponent