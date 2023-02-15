DROP TABLE IF EXISTS SIGNOSVITALES;
DROP TABLE IF EXISTS DIAGNOSTICO;
DROP TABLE IF EXISTS AGENDARCITAS;
DROP TABLE IF EXISTS USUARIOS;

CREATE TABLE IF NOT EXISTS USUARIOS(
    Cedula CHAR(10) NOT NULL,
    Apellidos VARCHAR(250) NOT NULL,
    Nombres VARCHAR(250) NOT NULL,
    Contrasena VARCHAR(250) NOT NULL,
    Correo VARCHAR(250) DEFAULT 'Vacío' NOT NULL,
    Nacimiento DATE DEFAULT '2000-01-01' NOT NULL,
    Sexo ENUM('M', 'F', 'U') DEFAULT 'U' NOT NULL,
    Telefono VARCHAR(20) DEFAULT 'Vacío',
    EstadoCivil ENUM('S','C','D','V','U') DEFAULT 'U' NOT NULL,
    TipoUsuario ENUM('P', 'M', 'S', 'PM', 'PS', 'MS', 'PMS', 'U') DEFAULT 'U' NOT NULL,
    UsuarioActivo BOOLEAN DEFAULT True NOT NULL,
    Discapacidad BOOLEAN DEFAULT False NOT NULL,
    DescripcionDiscapacidad VARCHAR(500) DEFAULT 'Describir discapacidad en caso de tenerla.',
    PRIMARY KEY(Cedula)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS SIGNOSVITALES(
    Cedula CHAR(10) NOT NULL,
    PresionArtSistolica INT(6) DEFAULT 0 NOT NULL,
    PresionArtDiastolica INT(6) DEFAULT 0 NOT NULL,
    Temperatura DOUBLE DEFAULT 0.0 NOT NULL,
    Estatura DOUBLE DEFAULT 0.0 NOT NULL,
    Peso DOUBLE DEFAULT 0.0 NOT NULL,
    PRIMARY KEY(Cedula),
    CONSTRAINT fk_Cedula_SignosVitales FOREIGN KEY(Cedula) REFERENCES USUARIOS(Cedula) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS AGENDARCITAS(
    Id INT(10) PRIMARY KEY AUTO_INCREMENT,
    Cedula CHAR(10) NOT NULL,
    NombresMedico VARCHAR(250) NOT NULL,
    MotivoCita VARCHAR(250) DEFAULT 'No hay asunto.' NOT NULL,
    FechaAgendada DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FechaCita DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    EstadoCita ENUM('Atendido', 'Pendiente', 'No atendido') DEFAULT 'Pendiente' NOT NULL,
    CONSTRAINT fk_Cedula_AgendarCitas FOREIGN KEY(Cedula) REFERENCES USUARIOS(Cedula) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS DIAGNOSTICO(
    Id INT(10) PRIMARY KEY AUTO_INCREMENT,
    Cedula CHAR(10) NOT NULL,
    Antecedentes VARCHAR(1000) DEFAULT '',
    Descripcion VARCHAR(1000) DEFAULT '' NOT NULL,
    Prescripcion VARCHAR(1000) DEFAULT '' NOT NULL,
    FechaDiagnostico DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_Cedula_Diagnostico FOREIGN KEY(Cedula) REFERENCES AGENDARCITAS(Cedula) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB;

INSERT INTO USUARIOS VALUES
('1350611057', 'Bravo Párraga', 'Adonys Ricardo', 'ado0606', 'abravo1057@utm.edu.ec', '1997-06-06', 'M', '+593 968903661', 'S', 'P', True, False, 'No tengo'),
('1350611058', 'Bravo', 'Adonys', 'ado0606', 'adobravo02@gmail.com', '1997-06-06', 'M', '+593 959401604', 'S', 'P', True, False, 'No tengo discapacidad.');

INSERT INTO USUARIOS(Cedula, Apellidos, Nombres, Contrasena, TipoUsuario) VALUES
('0000000000', 'Brown', 'Layla Sief', '123456', 'S'),
('9090909090', 'Alcivar', 'George Michael', '123456', 'P'),
('1111111111', 'Osler', 'Sir William', '123456', 'M'),
('2222222222', 'Sr. M.', 'Médico', '123456', 'M'),
('3333333333', 'Torner', 'Kal', '123456', 'M'),
('4444444444', 'Cedeño Zamora', 'Kevin Stefano', '123456', 'P'),
('5555555555', 'Paciente 2', 'PCT', '123456', 'P'),
('6666666666', 'Paciente 3', 'PCT', '123456', 'P'),
('7777777777', 'Paciente 4', 'PCT', '123456', 'P'),
('8888888888', 'Paciente 5', 'PCT', '123456', 'P'),
('9999999999', 'Paciente 6', 'PCT', '123456', 'P'),
('1234123456', 'Alcivar Briones', 'George Michael', '123456', 'P'),
('1234567845', 'Romero Velez', 'Jeison Arnaldo', '123456', 'P'),
('2345634567', 'Arteaga Sornoza', 'Stefany Nicole', '123456', 'P');

INSERT INTO SIGNOSVITALES(Cedula) VALUES
('1350611057'),
('1350611058'),
('0000000000'),
('9090909090'),
('1111111111'),
('2222222222'),
('3333333333'),
('4444444444'),
('5555555555'),
('6666666666'),
('7777777777'),
('8888888888'),
('9999999999'),
('1234123456'),
('1234567845'),
('2345634567');

INSERT INTO AGENDARCITAS(Cedula, NombresMedico, MotivoCita, FechaAgendada, FechaCita, EstadoCita) VALUES
('1350611057', 'Osler Sir William', 'Oftalmología.', '2023-01-29', '2023-01-30', 'Pendiente'),
('1350611057', 'Osler Sir William', 'Tengo sueño.', '2023-01-29', '2023-01-30', 'No atendido'),
('1350611057', 'Osler Sir William', 'Tengo gripe.', '2023-01-29', '2023-01-30', 'Atendido');

INSERT INTO AGENDARCITAS(Cedula, NombresMedico, MotivoCita) VALUES
('1350611058', 'Osler Sir William', 'Falta la respiración'),
('1350611058', 'Sr. M. Médico', 'Fiebre'),
('1350611058', 'Sr. M. Médico', 'Fiebre de nuevo');

INSERT INTO DIAGNOSTICO(Cedula, Antecedentes, Descripcion, Prescripcion) VALUES
('1350611057', 'No hay antecedentes', 'Falta de vitamina C', 'Tome Redoxón una vez por día, durante el día.');
