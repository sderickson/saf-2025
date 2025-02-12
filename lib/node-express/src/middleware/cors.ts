import cors from "cors";

export const corsMiddleware = cors({
  origin: ["http://docker.localhost"],
  credentials: true,
});
