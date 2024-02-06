import Env from "./ENV";
import app from "./app";
import startup from "./startup";

startup().then(() => {
  
  console.log("Startup script executed. Now Starting server....");
  app.listen(Env.PORT, () => {
    console.log(`Server is running on port ${Env.PORT}`);
  });

});