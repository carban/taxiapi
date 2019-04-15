# taxiapi
Backend program created with JS technologies

Para correr las aplicaciones desde docker, usando docker compose:
descargar docker-compose.yml
ubicarse en la carpeta donde se descargo y escribir en la terminal: 
    docker-compose up -d
a continuación comenzará a bajar las imágenes de las aplicaciones del docker hub (esto puede tardar un poco). Al finalizar mostrará algo como esto:


Sin embargo la “construcción” de las imágenes aún no ha finalizado, con el comando
    docker-compose logs
se puede ver lo que imprimen cada imagen mientras se monta el contenedor


Notará que los contenedores de las aplicaciones del cliente y conductor son los primeros en crear dado que su construcción es rápida y por eso puede verlas escribiendo en su navegador (recomendamos usar firefox) lo siguiente:
    localhost:8080 para el cliente
localhost:8081 para el conductor
Pero como el contenedor de la api es un poco más lento en terminar de hacerse, tendrá que esperar a que finalice su elaboración para poder usar las aplicaciones en conjunto con la api y la base de datos.

Aquí se puede ver como el contenedor de la api terminó y está a la escucha en el puerto 8000, lo que significa que todo funcionara bien




Ahora tiene los tres contenedores ejecutándose correctamente 
cliente y conductor se comunican con la api y esta última contiene la bd con la que atiende las peticiones de los dos primeros


para detener todos los contenedores basta con escribir en la terminal que está usando
    docker-compose down

