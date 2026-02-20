<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Hola {{ $name }} 👋</h2>

    <p>Fuiste agregado(a) a la empresa <strong>{{ $companyName }}</strong>.</p>

    <h3>Datos de acceso</h3>
    <ul>
      <li><strong>Correo:</strong> {{ $email }}</li>
      <li><strong>Contraseña:</strong> {{ $password }}</li>
      <li><strong>Cargo/Rol:</strong> {{ $role }}</li>
    </ul>

    <p>
      Ingresa aquí:
      <a href="{{ $loginUrl }}">{{ $loginUrl }}</a>
    </p>

    <p style="color:#666;font-size:12px;">
      Recomendación: cambia tu contraseña al ingresar.
    </p>
  </body>
</html>