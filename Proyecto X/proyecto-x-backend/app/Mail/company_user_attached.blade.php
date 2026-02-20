<!doctype html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.5;">

<h2>Hola {{ $name }} 👋</h2>

<p>Has sido agregado(a) a la empresa <strong>{{ $companyName }}</strong>.</p>

<h3>Información de tu acceso</h3>
<ul>
    <li><strong>Correo:</strong> {{ $email }}</li>
    <li><strong>Rol asignado:</strong> {{ $role }}</li>
</ul>

<p>
Puedes ingresar aquí:
<br>
<a href="{{ $loginUrl }}">{{ $loginUrl }}</a>
</p>

<p style="font-size: 12px; color: #666;">
Si no reconoces esta acción, contacta con el administrador.
</p>

</body>
</html>