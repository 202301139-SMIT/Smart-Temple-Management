import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { isSimulationModeEnabled, getSimulatedDate } from "./services/simulation.service.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `⚙️ Server running on port ${PORT}`
      );
      if (isSimulationModeEnabled()) {
        console.log(
          `🧪 SIMULATION MODE ACTIVE — System date: ${getSimulatedDate().toISOString().split("T")[0]}`
        );
        console.log(
          `   Change via API: POST /api/v1/forecast/simulation`
        );
        console.log(
          `   Or set SIMULATION_MODE=false in .env to disable`
        );
      } else {
        console.log(`📡 PRODUCTION MODE — Using real-time system date`);
      }
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB Connection Failed:",
      error
    );
    process.exit(1);
  });

  app.use(errorHandler);