const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Routes
const superUsers = require("./routes/superUsers");

require("dotenv").config();

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const whitelist = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://www.instagram.com/",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`"Not allowed by CORS", ${origin}`));
    }
  },
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Routes;
app.use("/api/superUsers", superUsers);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
