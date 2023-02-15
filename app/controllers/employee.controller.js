const connection = require("../config/connection");

var EstadoInicioSesion = 1; //Comprobar si las credenciales y tipo de privilegio seleccionado son correctas.
var datosGuardados = 0;
const IniciarSesion = async (req, res) => {
  try {
        ced = null;
        cantMedicos = 0;
        datosGuardados = 0;
        res.render("iniciarsesion", {EstadoInicioSesion:EstadoInicioSesion});
        EstadoInicioSesion = 1;
  } catch (error) {
    console.log("Error al cargar la página de inicio de sesión.", error);
  }
};
let TablaUsuarios;
var cantMedicos=0;
var ced = null;
var apellidos;
var nombres;
var tipoUsuarioActivo = null;
const ValidarUsuario = async (req, res) => {
  try {
    const usuario = req.body;
    const sql = "SELECT * FROM USUARIOS";
    await connection.query(sql, (error, data) => {
        TablaUsuarios = data;
        //console.log("TABLA USUARIOS:", TablaUsuarios);
        for(var i=0; i<TablaUsuarios.length; i++){  //Contar cuántos médicos hay en la base de datos.
            if(TablaUsuarios[i].TipoUsuario=="M" || TablaUsuarios[i].TipoUsuario == "PM" || TablaUsuarios[i].TipoUsuario == "MS" || TablaUsuarios[i].TipoUsuario == "PMS"){
                cantMedicos+=1;
            }
        }
        //console.log(data[0].Cedula);
        console.log(usuario)
        ced = usuario.Cedula;
        var c=0;
        for(var i=0; i<data.length; i++){
            if (usuario.Cedula==data[i].Cedula && usuario.Contrasena==data[i].Contrasena){
                console.log("La cédula", usuario.Cedula,"y/o la contraseña", usuario.Contrasena,"SÍ están en la base de datos!");
                //res.render("panelcitas", { data: data, dataCedula: null });
                apellidos = data[i].Apellidos;
                nombres = data[i].Nombres;
                tipoUsuarioActivo = usuario.TipoUsuario;
                EstadoInicioSesion = 1;
                if ((data[i].TipoUsuario == 'P' || data[i].TipoUsuario == 'PM' || data[i].TipoUsuario == 'PMS') && usuario.TipoUsuario=='P'){
                    res.redirect("/MisCitas");
                }else if ((data[i].TipoUsuario == 'M' || data[i].TipoUsuario == 'PM' || data[i].TipoUsuario == 'PMS') && usuario.TipoUsuario=='M'){
                    res.redirect("/PanelMedico");
                }else if ((data[i].TipoUsuario == 'S' || data[i].TipoUsuario == 'PS' || data[i].TipoUsuario == 'PMS') && usuario.TipoUsuario=='S'){
                    res.redirect("/PanelSecretaria");
                }else{
                    EstadoInicioSesion = 0;
                    res.redirect("/");
                }
                break;
            }else if ((usuario.Cedula!=data[i].Cedula || usuario.Contrasena!=data[i].Contrasena) && c+1==data.length){
                EstadoInicioSesion = 0;
                console.log("La cédula", usuario.Cedula,"y/o la contraseña", usuario.Contrasena,"NO están en la base de datos!");
                res.redirect("/");
                break;
            }
            c++;
        }
      if (error) throw error;
      //res.render("iniciarsesion", { data: data, dataCedula: null });
    });
  } catch (error) {
    console.log("Error al cargar la página de inicio de sesión.", error);
  }
};

const Registrarse = async (req, res) => {
  try {
    res.render("Registrarse");
  } catch (error) {
    console.log("Error al cargar la página de registro.", error);
  }
};

const ValidarRegistro = async (req, res) => {
  try {
      if(ced == null){
        const registro = req.body;
        const sql = "INSERT INTO USUARIOS(Cedula, Apellidos, Nombres, Contrasena, TipoUsuario) VALUES ('"+registro.Cedula+"','"+registro.Apellidos+"','"+registro.Nombres+"','"+registro.Contrasena+"','"+registro.TipoUsuario+"');";
        await connection.query(sql, (error, data) => {
            console.log("Usuario con cédula", registro.Cedula, "registrado correctamente.");
          if (error){
              throw error;
          }
          //res.redirect("/");
        });
        
        const signoVital = "INSERT INTO SIGNOSVITALES(Cedula) VALUES ('"+registro.Cedula+"');"
        await connection.query(signoVital, (error, datosSignoVital) => {
            console.log("Cédula", registro.Cedula, "registrada correctamente en signos vitales.");
          if (error){
              throw error;
          }
          res.redirect("/");
        });
      }else{
          res.redirect("/Registrarse");
      }
  } catch (error) {
    console.log("Error al registrar usuario.", error);
  }
};

const ConsultarCitas = async (req, res) => {
  try {
      if(ced != null){
        const sql = "SELECT u.Apellidos, u.Nombres, ag.Id, ag.Cedula, ag.NombresMedico, MotivoCita, FechaAgendada, DATE_FORMAT(FechaCita, '%Y-%m-%d') AS FechaCita, DATE_FORMAT(FechaCita, '%H:%i') AS HoraCita, EstadoCita FROM AGENDARCITAS AS ag INNER JOIN USUARIOS AS u ON ag.Cedula=u.Cedula WHERE ag.Cedula = '"+ced+"' ORDER BY ag.Id DESC;";
        //Obtener hora actual: DATE_FORMAT(NOW( ), "%H:%i:%S" )     Obtener hora de TIMESTAMP: DATE_FORMAT(FechaCita, '%H:%i:%S')
        await connection.query(sql, ced, (error, data) => {
            //console.log(data);
          if (error) throw error;
          res.render("panelcitas", { data: data, dataCedula: null, ced:ced, tipoUsuarioActivo:tipoUsuarioActivo, apellidos:apellidos, nombres:nombres, TablaUsuarios:TablaUsuarios, cantMedicos:cantMedicos});
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al consultar los datos de citas.", error);
  }
};

const AgendarCita = async (req, res) => {
  try {
      if(ced != null){
        const cita = req.body;
        const sql = "INSERT INTO AGENDARCITAS(Cedula, NombresMedico, MotivoCita) VALUES ('"+ced+"','"+cita.NombresMedico+"','"+cita.MotivoCita+"')";
        await connection.query(sql, (error, data) => {
          if (error) throw error;
          res.redirect("/MisCitas");
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al agendar cita médica.", error);
  }
};

const EliminarCita = async (req, res) => {
  try {
      if(ced != null){
        const citaId = req.params;
        const sql = "DELETE FROM AGENDARCITAS WHERE Id = '"+citaId.Id+"';";
        await connection.query(sql, (error, data) => {
          if (error) throw error;
          res.redirect("/MisCitas");
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al agendar cita médica.", error);
  }
};

var intervalo = 0;
const ConsultarDiagnostico = async (req, res) => {
  try {
      if(ced != null){
        var datosdTemp = [];
        const diagnostico = "SELECT DISTINCT ag.MotivoCita, d.Antecedentes, d.Descripcion, d.Prescripcion, ag.NombresMedico FROM AGENDARCITAS AS ag, DIAGNOSTICO AS d WHERE ag.EstadoCita='Atendido' AND ag.Cedula=d.Cedula AND ag.Cedula = '"+ced+"';";
        await connection.query(diagnostico, (error, datosd) => {
            console.log(datosd);
            intervalo = Math.sqrt(datosd.length);
            //console.log(intervalo)
            for(var i=0; i<datosd.length; i+=intervalo+1){
                datosdTemp.push(datosd[i]);
            }
            //console.log("DATOS FILTRADOS:", datosdTemp);
          if (error) throw error;
          res.render("diagnosticopaciente", { datosd: datosdTemp, ced:ced, tipoUsuarioActivo:tipoUsuarioActivo, apellidos:apellidos, nombres:nombres, TablaUsuarios:TablaUsuarios, cantMedicos:cantMedicos});
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al consultar los datos de diagnóstico.", error);
  }
};

const Perfil = async (req, res) => {
  try {
      if(ced != null){
        const datosperfil = "SELECT u.Cedula, Apellidos, Nombres, Contrasena, Correo, DATE_FORMAT(Nacimiento, '%Y-%m-%d') AS Nacimiento, Sexo, Telefono, EstadoCivil, TipoUsuario, UsuarioActivo, Discapacidad, DescripcionDiscapacidad, sv.PresionArtSistolica, sv.PresionArtDiastolica, sv.Temperatura, sv.Estatura, sv.Peso FROM USUARIOS AS u INNER JOIN SIGNOSVITALES AS sv ON u.Cedula=sv.Cedula WHERE u.Cedula = ?";
        await connection.query(datosperfil, ced, (error, datosp) => {
            //console.log(datosp);
          if (error) throw error;
            res.render("perfil", { datosp: datosp, ced:ced, tipoUsuarioActivo:tipoUsuarioActivo, apellidos:apellidos, nombres:nombres, TablaUsuarios:TablaUsuarios, cantMedicos:cantMedicos, datosGuardados:datosGuardados});
            datosGuardados = 0;
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al cargar la página de perfil.", error);
  }
};
const ModificarPerfil = async (req, res) => {
  try {
      if(ced != null){
        datosGuardados = 1;
        const registro = req.body;
        const sql = "UPDATE USUARIOS SET Apellidos='"+registro.Apellidos+"', Nombres='"+registro.Nombres+"', Contrasena='"+registro.Contrasena+"', Correo='"+registro.Correo+"', Nacimiento='"+registro.Nacimiento+"', Sexo='"+registro.Sexo+"', Telefono='"+registro.Telefono+"', EstadoCivil='"+registro.EstadoCivil+"', TipoUsuario='"+registro.TipoUsuario+"' WHERE Cedula='"+ced+"';";
        await connection.query(sql, (error, data) => {
            console.log("Usuario con cédula", registro.Cedula, "actualizado correctamente.");
          if (error) throw error;
          res.redirect("/Perfil");
        });
    }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al actualizar perfil.", error);
  }
};

//CONTINUAR AQUÍ******************
const CitasPendientes = async (req, res) => {
  try {
      if(ced != null){
        const cPendientes = "SELECT u.Apellidos, u.Nombres, ag.Id, ag.Cedula, ag.NombresMedico, MotivoCita, EstadoCita FROM AGENDARCITAS AS ag INNER JOIN USUARIOS AS u ON ag.Cedula=u.Cedula WHERE ag.NombresMedico = '"+apellidos+" "+nombres+"' ORDER BY ag.Id DESC;";
        //console.log(apellidos+" "+nombres)
        await connection.query(cPendientes, (error, datosca) => {
            //console.log(datosca);
          if (error) throw error;
          res.render("panelmedico", { datosca: datosca, ced:ced, tipoUsuarioActivo:tipoUsuarioActivo, apellidos:apellidos, nombres:nombres, TablaUsuarios:TablaUsuarios, cantMedicos:cantMedicos});
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al consultar los datos de citas.", error);
  }
};

var diagnosticoIdTemp = 0;  //Id de la cita atendida.
var cedulaDP = null;    //Cédula del paciente atendido.
var Antecedentes = "";  //Antecedentes del paciente atendido.
const ConsultarDiagnosticoPrevio = async (req, res) => {
  try {
      if(ced != null){
        const diagnosticoId = req.params;
        const cPendientes = "SELECT u.Cedula, u.Apellidos, u.Nombres, ag.MotivoCita, ag.Id, d.Id AS IdDiagnostico, d.Cedula AS CedulaDiagnostico, d.Antecedentes FROM AGENDARCITAS AS ag LEFT JOIN DIAGNOSTICO AS d ON ag.Cedula=d.Cedula RIGHT JOIN USUARIOS AS u ON ag.Cedula=u.Cedula GROUP BY ag.Id";
        //console.log(apellidos+" "+nombres)
        await connection.query(cPendientes, (error, datosdp) => {
            //console.log(datosdp);
            for(var i=0; i<datosdp.length; i++){    //Obtener la cédula del Id seleccionado de la cita que se va a diagnosticar.
                if(datosdp[i].Id==diagnosticoId.Id){
                    diagnosticoIdTemp = diagnosticoId.Id;
                    cedulaDP = datosdp[i].Cedula;
                    Antecedentes = datosdp[i].Antecedentes;
                    break;
                }
            }
            console.log("Cédula:", cedulaDP, "obtenida a partir del Id:", diagnosticoIdTemp);
            console.log("Antecedentes obtenidos a partir del Id seleccionado:", Antecedentes);
          if (error) throw error;
          res.render("diagnosticar", { datosdp: datosdp, cedulaDP:cedulaDP, tipoUsuarioActivo:tipoUsuarioActivo, diagnosticoId:diagnosticoId, Antecedentes:Antecedentes, ced:ced, apellidos:apellidos, nombres:nombres, TablaUsuarios:TablaUsuarios, cantMedicos:cantMedicos});
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al consultar los datos de diagnósticos previos.", error);
  }
};

const Diagnosticar = async (req, res) => {
  try {
      if(ced != null){
        const datosDiagnostico = req.body;
        const diagnosticop = "INSERT INTO DIAGNOSTICO(Cedula, Antecedentes, Descripcion, Prescripcion) VALUES ('"+datosDiagnostico.Cedula+"','"+datosDiagnostico.Descripcion+"','"+datosDiagnostico.Descripcion+"','"+datosDiagnostico.Prescripcion+"')";
        await connection.query(diagnosticop, (error, data) => {
          if (error) throw error;
          res.redirect("/CambiarEstadoCita");
        });
      }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al asentar diagnóstico médico.", error);
  }
};

const CambiarEstadoCita = async (req, res) => {
  try {
      if(ced != null){
        const sql = "UPDATE AGENDARCITAS SET EstadoCita='Atendido' WHERE Id = ?";
        await connection.query(sql, diagnosticoIdTemp, (error, data) => {
            console.log("La cita médica con Id =", diagnosticoIdTemp, "ha sido atendida.");
          if (error) throw error;
          res.redirect("/PanelMedico");
        });
    }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al actualizar estado de cita médica.", error);
  }
};

var buscandoPaciente = 0;
var usuarioEncontrado = 0;
var modificandoPaciente = 0;
const PanelSecretaria = async (req, res) => {
    try {
        if(ced != null){
            buscandoPaciente = 0;
            usuarioEncontrado = 0;
            modificandoPaciente = 0;
            /*const cUsuarios = "SELECT * FROM USUARIOS";
            await connection.query(cUsuarios, (error, usuariosPS) => {
                console.log("Consulta a la tabla de usuarios exitosa.");
                if (error){
                    throw error;
                }
                res.render("panelsecretaria", {TablaUsuarios:TablaUsuarios, tipoUsuarioActivo:tipoUsuarioActivo, ced:ced, apellidos:apellidos, nombres:nombres});
            });*/
            res.render("panelsecretaria", {modificandoPaciente:modificandoPaciente, buscandoPaciente:buscandoPaciente, usuarioEncontrado:usuarioEncontrado, TablaUsuarios:TablaUsuarios, tipoUsuarioActivo:tipoUsuarioActivo, ced:ced, apellidos:apellidos, nombres:nombres});
        }else{
            res.redirect("/");
        }
    } catch (error) {
        console.log("Error al consultar usuarios.", error);
    }
};

const BuscarEnPanelSecretaria = async (req, res) => {
    try {
        if(ced != null){
            buscandoPaciente = 1;
            modificandoPaciente = 0;
            const buscarCedUsuario = req.body;
            const cUsuarios = "SELECT * FROM USUARIOS WHERE Cedula = ?";
            await connection.query(cUsuarios, buscarCedUsuario.Cedula, (error, usuariosPS) => {
                console.log("Consulta del usuario con cédula", buscarCedUsuario.Cedula, "en la tabla de usuarios exitosa.");
                if (error){
                    throw error;
                }
                if(usuariosPS.length!=0 && (usuariosPS[0].TipoUsuario=="P" || usuariosPS[0].TipoUsuario=="PM" || usuariosPS[0].TipoUsuario=="PS" || usuariosPS[0].TipoUsuario=="PMS")){
                    usuarioEncontrado = 1;
                }else{
                    usuarioEncontrado = 0;
                }
                res.render("panelsecretaria", {modificandoPaciente:modificandoPaciente, buscandoPaciente:buscandoPaciente, usuarioEncontrado:usuarioEncontrado, usuariosPS:usuariosPS, TablaUsuarios:TablaUsuarios, tipoUsuarioActivo:tipoUsuarioActivo, ced:ced, apellidos:apellidos, nombres:nombres});
            });
            //res.render("panelsecretaria", {TablaUsuarios:TablaUsuarios, tipoUsuarioActivo:tipoUsuarioActivo, ced:ced, apellidos:apellidos, nombres:nombres});
        }else{
            res.redirect("/");
        }
    } catch (error) {
        console.log("Error al consultar usuarios.", error);
    }
};

const DetallesUsuarioSignosVitales = async (req, res) => {
    try {
        if(ced != null){
            buscandoPaciente = 0;
            usuarioEncontrado = 0;
            modificandoPaciente = 1;
            const detalleUsuario = req.params;
            const sql = "SELECT u.Cedula, Apellidos, Nombres, Correo, DATE_FORMAT(Nacimiento, '%Y-%m-%d') AS Nacimiento, Sexo, Telefono, EstadoCivil, TipoUsuario, sv.PresionArtSistolica, sv.PresionArtDiastolica, sv.Temperatura, sv.Estatura, sv.Peso FROM USUARIOS AS u, SIGNOSVITALES AS sv WHERE u.Cedula=sv.Cedula AND u.Cedula = ?";
            await connection.query(sql, detalleUsuario.Cedula, (error, signosUsuario) => {
                console.log("La consulta de signos vitales se ha realizado con éxito.");
                //console.log(signosUsuario);
                if (error){
                    throw error;
                }
                res.render("panelsecretaria", {modificandoPaciente:modificandoPaciente, buscandoPaciente:buscandoPaciente, usuarioEncontrado:usuarioEncontrado, signosUsuario:signosUsuario, tipoUsuarioActivo:tipoUsuarioActivo, ced:ced, apellidos:apellidos, nombres:nombres, datosGuardados:datosGuardados});
                datosGuardados = 0;
            });
        }else{
            res.redirect("/");
        }
    } catch (error) {
        console.log("Error al actualizar los signos vitales.", error);
    }
};

const ActualizarSignosVitales = async (req, res) => {
  try {
      if(ced != null){
        datosGuardados = 1;
        const signosVitales = req.body;
        const sql = "UPDATE SIGNOSVITALES SET PresionArtSistolica='"+signosVitales.PresionArtSistolica+"', PresionArtDiastolica='"+signosVitales.PresionArtDiastolica+"', Temperatura='"+signosVitales.Temperatura+"', Estatura='"+signosVitales.Estatura+"', Peso='"+signosVitales.Peso+"' WHERE Cedula = ?";
        await connection.query(sql, signosVitales.Cedula, (error, signos) => {
            console.log("Los signos vitales del paciente con cédula", signosVitales.Cedula, "han sido actualizados.");
          if (error) throw error;
          res.redirect("/DetallesUsuarioSignosVitales/"+signosVitales.Cedula);
        });
    }else{
          res.redirect("/");
      }
  } catch (error) {
    console.log("Error al actualizar los signos vitales.", error);
  }
};

module.exports = {
  IniciarSesion,
  ValidarUsuario,
  Registrarse,
  ValidarRegistro,
  ConsultarCitas,
  AgendarCita,
  EliminarCita,
  ConsultarDiagnostico,
  Perfil,
  ModificarPerfil,
  CitasPendientes,
  ConsultarDiagnosticoPrevio,
  Diagnosticar,
  CambiarEstadoCita,
  PanelSecretaria,
  DetallesUsuarioSignosVitales,
  BuscarEnPanelSecretaria,
  ActualizarSignosVitales,
};
