import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.NODE_ENV === "production"
        ? ["https://portal.company.com"]
        : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004"],
      credentials: true
    }
  });

  app.use(helmet());
  app.setGlobalPrefix("api");
  app.enableCors();

  const port = parseInt(process.env.PORT || "8000", 10);
  await app.listen(port, "0.0.0.0");
  console.log(`[AuthService] Running on port ${port}`);
}
bootstrap();
