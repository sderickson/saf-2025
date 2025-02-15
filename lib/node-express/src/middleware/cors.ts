import cors from "cors";
import { Router } from "express";

const domains = ["docker.localhost", "localhost", "saf-demo.online"];

const subdomains = ["", "www.", "specs.api."];

const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

const whitelist = new Set(
  domains.flatMap((domain) =>
    subdomains.map((subdomain) => `${protocol}://${subdomain}${domain}`)
  )
);

export const corsRouter = Router();
const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (whitelist.has(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});
corsRouter.options("*", corsMiddleware);
corsRouter.use(corsMiddleware);
