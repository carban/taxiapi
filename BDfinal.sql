/*SCRIPT SQL PARA EL PROYECTO DB1*/
/*VERSION 1,1*/

/*Integridad referencial*/

DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS favorito CASCADE;
DROP TABLE IF EXISTS conductor CASCADE;
DROP TABLE IF EXISTS taxi CASCADE;
DROP TABLE IF EXISTS infocarro CASCADE;
DROP TABLE IF EXISTS taxiConductor CASCADE;
DROP TABLE IF EXISTS variante_conduce CASCADE;
DROP TABLE IF EXISTS horario CASCADE;
DROP TABLE IF EXISTS tarifa CASCADE;
DROP TABLE IF EXISTS servicio CASCADE;

DROP SEQUENCE IF EXISTS id_favorito_seq CASCADE;
DROP SEQUENCE IF EXISTS id_carro_seq CASCADE;
DROP SEQUENCE IF EXISTS id_conduce_seq CASCADE;
DROP SEQUENCE IF EXISTS id_tarifa_seq CASCADE;

DROP EXTENSION IF EXISTS postgis CASCADE;
CREATE EXTENSION postgis;


/*Creacion de las tablas***************/
CREATE TABLE cliente(
telefonoCliente varchar(10),
nombreCliente varchar NOT NULL,
apellidoCliente varchar NOT NULL,
emailCliente varchar NOT NULL,
tarjetaCliente varchar NOT NULL,
passwordCliente varchar NOT NULL,
direccionCliente varchar NOT NULL,

PRIMARY KEY (telefonoCliente)
);

CREATE sequence id_favorito_seq MINVALUE 300 START 300;
CREATE TABLE favorito(
id_favorito int DEFAULT nextval('id_favorito_seq') NOT NULL,
telefonoCliente varchar(10),
titulo varchar NOT NULL,
direccion varchar NOT NULL,

FOREIGN KEY (telefonoCliente) REFERENCES cliente(telefonoCliente),
PRIMARY KEY(id_favorito, telefonoCliente)
);
SELECT AddGeometryColumn('favorito', 'coordenada', 4326, 'POINT', 2);


CREATE TABLE conductor(
telefonoConductor varchar(10),
nombreConductor varchar NOT NULL,
apellidoConductor varchar NOT NULL,
emailConductor varchar NOT NULL,
tarjetaConductor varchar NOT NULL,
passwordConductor varchar NOT NULL,
direccionConductor varchar NOT NULL,

PRIMARY KEY (telefonoConductor)
);


CREATE sequence id_carro_seq MINVALUE 500 START 500;
CREATE TABLE infoCarro(
id_carro int DEFAULT nextval('id_carro_seq'),
marca varchar NOT NULL,
modelo varchar NOT NULL,

PRIMARY KEY (id_carro)
);


CREATE TABLE taxi(
placa varchar(6) NOT NULL,
id_carro int NOT NULL,
soat varchar NOT NULL,
anho varchar(4) NOT NULL,
--marca varchar NOT NULL,
--modelo varchar NOT NULL,

FOREIGN KEY (id_carro) REFERENCES infoCarro(id_carro),
PRIMARY KEY (placa)
);


CREATE TABLE taxiConductor(
telefonoConductor varchar(10),
placa varchar(6),

FOREIGN KEY (telefonoConductor) REFERENCES conductor(telefonoConductor),
FOREIGN KEY (placa) REFERENCES taxi(placa),
PRIMARY KEY (telefonoConductor, placa)
);


CREATE sequence id_conduce_seq MINVALUE 700 START 700;
CREATE TABLE variante_conduce(
id_conduce int DEFAULT nextval('id_conduce_seq'),
telefonoConductor varchar(10) NOT NULL,
placa varchar(6) NOT NULL,
fecha date,
hora time,
estado varchar(10) NOT NULL, --disponible, ocupado, libre


FOREIGN KEY (telefonoConductor) REFERENCES conductor(telefonoConductor),
FOREIGN KEY (placa) REFERENCES taxi(placa),
PRIMARY KEY (id_conduce)
);
SELECT AddGeometryColumn('variante_conduce', 'coordenada', 4326, 'POINT', 2);


CREATE TABLE horario(
jornada varchar(6) NOT NULL, --manhana, tarde, noche
horaInicio time NOT NULL UNIQUE,
horaFin time NOT NULL UNIQUE,

PRIMARY KEY (jornada) 
);

CREATE sequence id_tarifa_seq MINVALUE 900 START 900;
CREATE TABLE tarifa(
id_tarifa int DEFAULT nextval('id_tarifa_seq') ,
jornada varchar(6) NOT NULL,
precioKm double precision NOT NULL,
fechaInicio date NOT NULL,
fechaFin date,

FOREIGN KEY (jornada) REFERENCES horario(jornada),
PRIMARY KEY (id_tarifa)
);


CREATE TABLE servicio(
id_servicio serial NOT NULL,
telefonoCliente varchar(10) NOT NULL, 
telefonoConductor varchar(10) NOT NULL,
placa varchar(6) NOT NULL,
id_tarifa int NOT NULL,
fecha date,
hora time,
distancia double precision,
precio double precision, 
calificacion int,

FOREIGN KEY (telefonoCliente) REFERENCES cliente(telefonoCliente),
FOREIGN KEY (telefonoConductor) REFERENCES conductor(telefonoConductor),
FOREIGN KEY (placa) REFERENCES taxi(placa),
FOREIGN KEY (id_tarifa) REFERENCES tarifa(id_tarifa),
PRIMARY KEY (id_servicio)
);
SELECT AddGeometryColumn('servicio', 'origen_coor', 4326, 'POINT', 2);
SELECT AddGeometryColumn('servicio', 'destino_coor', 4326, 'POINT', 2);


/*Insercion de datos para pruebas***************/

--Insert into cliente
INSERT INTO cliente (telefonoCliente, nombreCliente, apellidoCliente, emailCliente, tarjetaCliente, passwordCliente, direccionCliente)
VALUES ('1234','nombre','apellido','mail@mail.com','111111', '1234', 'unaDireccion');
INSERT INTO cliente VALUES('76543','charles', 'xavier','charles@xavier.com', '10021','there', 'mansion X');
INSERT INTO cliente VALUES('88991','Luka','Modric','luka@modric.com','10023','leon', 'dondeModric viva');


--Insert into favorito
/*Hacer el query con los atrib. porque el id es autoincrementado y no se pasa como parametro*/
INSERT INTO favorito (telefonoCliente, titulo, direccion, coordenada) VALUES ('1234','titulo','unaDireccion', ST_GeomFromText('POINT(3.4510 -76.5319)', 4326));

INSERT INTO favorito (telefonoCliente, titulo, direccion, coordenada) VALUES ('76543','casa','unaDireccion', ST_GeomFromText('POINT(3.4516 -76.5320)', 4326));
INSERT INTO favorito (telefonoCliente, titulo, direccion, coordenada) VALUES ('76543','Universidad','unaDireccion', ST_GeomFromText('POINT(3.3730 -76.5320)', 4326));
INSERT INTO favorito (telefonoCliente, titulo, direccion, coordenada) VALUES ('76543','La casa de ella','unaDireccion', ST_GeomFromText('POINT(3.3500 -76.5370)', 4326));

INSERT INTO favorito (telefonoCliente, titulo, direccion, coordenada) VALUES (88991,'casa','unaDireccion', ST_GeomFromText('POINT(3.4316 -76.5520)', 4326));
INSERT INTO favorito (telefonoCliente, titulo, direccion, coordenada) VALUES (88991,'Universidad','unaDireccion', ST_GeomFromText('POINT(3.3730 -76.5320)', 4326));


--Insert into conductor
INSERT INTO conductor (telefonoConductor, nombreConductor, apellidoConductor, emailConductor, tarjetaConductor, passwordConductor, direccionConductor)
VALUES ('1234','nombre','apellido','mail@mail.com','111111', '1234', 'unaDireccion');
INSERT INTO conductor VALUES ('66666','Quentin','Tarantino','quentin@tarantino.com','123456','pulp123','unaDireccion');
INSERT INTO conductor VALUES ('10101','Alejandro', 'González I.','mail@mail.com','654321','21grams','unaDireccion');
INSERT INTO conductor VALUES ('77711','Lars','Von Trier', 'von@trier.com','67890','dogville','unaDireccion');
INSERT INTO conductor VALUES ('123123','Martin','Scoces', 'martin@scoces.com','666899','123','unaDireccion');


--Insert into infoCarro
/*Hacer el query con los atrib. porque el id es autoincrementado y no se pasa como parametro*/
INSERT INTO infoCarro (marca, modelo) VALUES ('lamborghini','aventador'); --id_carro: 500
INSERT INTO infoCarro (marca, modelo) VALUES ('renault','4');		  --id_carro: 501
INSERT INTO infoCarro (marca, modelo) VALUES ('mazda','3');		  --id_carro: 502
INSERT INTO infoCarro (marca, modelo) VALUES ('mazda','2');
INSERT INTO infoCarro (marca, modelo) VALUES ('chevrolet','spark gt');
INSERT INTO infoCarro (marca, modelo) VALUES ('chevrolet','picanto');
INSERT INTO infoCarro (marca, modelo) VALUES ('chevrolet','onix');


--Insert into taxi
INSERT INTO taxi (placa, id_carro ,soat, anho) VALUES ('abc123',500,'112233','1994');
INSERT INTO taxi (placa, id_carro ,soat, anho) VALUES ('xyz123',500,'114433','1995');
INSERT INTO taxi (placa, id_carro ,soat, anho) VALUES ('maz123',501,'332233','2019');
INSERT INTO taxi (placa, id_carro ,soat, anho) VALUES ('maz234',502,'442233','2018');
INSERT INTO taxi (placa, id_carro ,soat, anho) VALUES ('che987',503,'557766','2012');
INSERT INTO taxi (placa, id_carro ,soat, anho) VALUES ('che123',503,'554455','2018');
INSERT INTO taxi (placa, id_carro ,soat, anho) VALUES ('kia123',504,'598455','2017');


--Insert into taxi_conductor
INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('1234','abc123');
INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('1234','maz123');
INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('1234','che123');
INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('1234','kia123');

INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('66666','xyz123');
INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('66666','maz123');
INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('66666','che987');

INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('10101','kia123');

INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('77711','maz234');
INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('77711','che123');

INSERT INTO taxiConductor (telefonoConductor, placa) VALUES('123123','che123');--che123 en 3 conductores


--Insert into variante_conduce
--resgistros "viejos":
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('66666','xyz123','2019/04/01','13:00:59','disponible',ST_GeomFromText('POINT(3.4456 -76.5208)', 4326));
--INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada); VALUES ('66666','maz123','2019/04/01','13:00:59','en uso',ST_GeomFromText('POINT(3.4456 -76.5208)', 4326)); No puede usar dos carros al mismo tiempo
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('10101','kia123','2019/04/01','14:00:59','disponible',ST_GeomFromText('POINT(3.4446 -76.5208)', 4326));
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('77711','maz234','2019/04/01','13:00:59','disponible',ST_GeomFromText('POINT(3.4356 -76.5208)', 4326));

--fecha y hora actual
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('1234','abc123',current_date, current_time,'disponible',ST_GeomFromText('POINT(3.4123 -76.4941)', 4326));
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('66666','xyz123',current_date, current_time,'disponible',ST_GeomFromText('POINT(3.4406 -76.5208)', 4326));
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('123123','che123',current_date, current_time,'disponible',ST_GeomFromText('POINT(3.4396 -76.5359)', 4326));
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('10101','kia123',current_date, current_time,'disponible',ST_GeomFromText('POINT(3.4491 -76.5428)', 4326));
INSERT INTO variante_conduce (telefonoConductor, placa, fecha, hora, estado, coordenada) VALUES ('77711','maz234',current_date, current_time,'disponible',ST_GeomFromText('POINT(3.4696 -76.5151)', 4326));











