import dotenv from "dotenv";
dotenv.config();

const devOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const prodOrigins = [
  process.env.CLIENT_URL,      // e.g. https://hiroclub.org
  process.env.ADMIN_URL,       // optional admin panel
].filter(Boolean);             // removes undefined/null

// Auto-switch depending on NODE_ENV
const allowedOrigins = process.env.NODE_ENV === "production"
  ? prodOrigins
  : devOrigins;

// Export full CORS config
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow mobile apps / Postman / curl (origin = undefined)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`❌ CORS blocked: ${origin} not allowed`),
      false
    );
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,

  // Preflight performance
  optionsSuccessStatus: 200,
  maxAge: 86400, // cache preflight for 24h
};
