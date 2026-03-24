import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production",
  entry: "./src/js/script.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "script.js",
  },
};