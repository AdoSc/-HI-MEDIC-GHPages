const app = require("./app/app");

const IP = "192.168.100.84";

app.listen(app.get("port"), IP, () => {
  console.log(
    "Servidor ejecuntándose en la dirección: "+IP+":"+app.get("port")
  );
});
 