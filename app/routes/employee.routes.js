const express = require("express");
const router = express.Router();
const controladorbd = require("../controllers/employee.controller");

router.get("/", controladorbd.IniciarSesion);
router.post("/Citas", controladorbd.ValidarUsuario);
router.get("/Registrarse", controladorbd.Registrarse);
router.post("/RegistroCompletado", controladorbd.ValidarRegistro);

router.get("/MisCitas", controladorbd.ConsultarCitas);
router.post("/AgendarCitas", controladorbd.AgendarCita);
router.get("/EliminarCita/:Id", controladorbd.EliminarCita);
router.get("/MiDiagnostico", controladorbd.ConsultarDiagnostico);

router.get("/Perfil", controladorbd.Perfil);
router.post("/ModificarPerfil", controladorbd.ModificarPerfil);

router.get("/PanelMedico", controladorbd.CitasPendientes);
router.get("/Diagnostico/:Id", controladorbd.ConsultarDiagnosticoPrevio);
router.post("/Diagnosticar", controladorbd.Diagnosticar);
router.get("/CambiarEstadoCita", controladorbd.CambiarEstadoCita);

router.get("/PanelSecretaria", controladorbd.PanelSecretaria);
router.get("/DetallesUsuarioSignosVitales/:Cedula", controladorbd.DetallesUsuarioSignosVitales);
router.post("/BuscarEnPanelSecretaria", controladorbd.BuscarEnPanelSecretaria);
router.post("/ActualizarSignosVitales", controladorbd.ActualizarSignosVitales);

module.exports = router;
