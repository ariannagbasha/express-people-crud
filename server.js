import express from "express";
import path from "path";
import people from "./routes/people.js";

const __dirname = path.resolve(path.dirname(""));
const staticDirectory = path.resolve(__dirname, "public");

const app = express();
//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.json()); // allows me to read JSON from a POST or PUT request
app.use(express.urlencoded({ extended: false }));
// TODO serve built react files
app.use(express.static(staticDirectory));



const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

// this namespaces the people router to "/people"
app.use("/people", people);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});
