SITP API
========

Usando la información actual de las rutas en la página del SITP, se puede consultar en una API RESTful amigable con web y dispositivos móviles.
La aplicación se encuentra hosteada en Heroku:

  https://sitp-api.herokuapp.com/

## Endpoints

### /buscar/:salida/:llegada?

Busca rutas por barrios. El parámetro de llegada es opcional

#### Ejemplo
```
  https://sitp-api.herokuapp.com/buscar/teusaquillo/chapinero
```


### /ruta/:id_ruta

Busca por No. de Ruta, basado en el listado de rutas del SITP.

#### Ejemplo
```
  https://sitp-api.herokuapp.com/ruta/544B
```
***

## Licencia

MIT



