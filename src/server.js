import app from "./app.js";
import prisma from "./config/db.js";
const PORT = process.env.PORT || 4000;
async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to Db", error);
    process.exit(1);
  }
}
startServer();
