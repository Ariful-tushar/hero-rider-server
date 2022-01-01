const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(fileUpload());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ga8wg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("hero-rider");
    const usersCollections = database.collection("users");
    const ridersCollections = database.collection("riders");
    const learnersCollections = database.collection("learners");
    console.log("Connected to MongoDB");

    // GET Riders API
    app.get("/riders", async (req, res) => {
      const cursor = ridersCollections.find({});
      let riders;
      const email = req.query.email;
      if (email) {
        riders = await ridersCollections.find({ email: email }).toArray();
      } else {
        riders = await cursor.toArray();
      }
      // const riders = await cursor.toArray();
      res.json(riders);
    });

    // POST Products
    app.post("/riders", async (req, res) => {
      let profilePicture;
      let drivingLicencePicture;
      let nidPicture;

      if (req.files !== null) {
        if (req.files.profilePicture) {
          profilePicture = Buffer.from(
            req.files.profilePicture.data.toString("base64"),
            "base64"
          );
        } else {
          profilePicture = "";
        }
        //   const drivingLicencePicture = Buffer.from(
        //     req.files.drivingLicencePicture.data.toString("base64"),
        //     "base64"
        //   );
        if (req.files.nidPicture) {
          nidPicture = Buffer.from(
            req.files.nidPicture.data.toString("base64"),
            "base64"
          );
        } else {
          nidPicture = "";
        }
        //   const nidPicture = Buffer.from(
        //     req.files.nidPicture.data.toString("base64"),
        //     "base64"
        //   );

        if (req.files.drivingLicencePicture) {
          drivingLicencePicture = Buffer.from(
            req.files.drivingLicencePicture.data.toString("base64"),
            "base64"
          );
        } else {
          drivingLicencePicture = "";
        }
      }

      const rider = {
        ...req.body,
        profilePicture,
        drivingLicencePicture,
        nidPicture,
      };
      const result = await ridersCollections.insertOne(rider);

      res.send(result);
    });

    // GET Learners API
    app.get("/learners", async (req, res) => {
      const cursor = ridersCollections.find({});
      let riders;
      const email = req.query.email;
      if (email) {
        learners = await learnersCollections.find({ email: email }).toArray();
      } else {
        learners = await cursor.toArray();
      }
      // const learners = await cursor.toArray();
      res.json(learners);
    });

    // POST Products
    app.post("/learners", async (req, res) => {
      console.log("body", req.body);

      let profilePicture;
      let nidPicture;

      if (req.files !== null) {
        if (req.files.profilePicture) {
          console.log("problem");
          profilePicture = Buffer.from(
            req.files.profilePicture.data.toString("base64"),
            "base64"
          );
        } else {
          profilePicture = "";
        }
        if (req.files.nidPicture) {
          nidPicture = Buffer.from(
            req.files.nidPicture.data.toString("base64"),
            "base64"
          );
        } else {
          nidPicture = "";
        }
      }

      const learner = {
        ...req.body,
        profilePicture,
        nidPicture,
      };
      const result = await learnersCollections.insertOne(learner);

      res.send(result);
    });

    // GET Users API
    app.get("/users", async (req, res) => {
      console.log("user", req.query);
      const query = req.query;
      const page = req.query.page;
      const email = req.query.email;
      console.log(email);
      const size = parseInt(req.query.size);
      let users;
      const cursor = usersCollections.find({});
      // const users = await cursor.toArray();
      const count = await cursor.count();
      if (page) {
        users = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else if (email) {
        users = await usersCollections.find({ email: email }).toArray();
      } else {
        users = await cursor.toArray();
      }
      res.json({
        count,
        users,
      });
    });

    // POST USERS
    app.post("/users", async (req, res) => {
      const user = req.body;

      const result = await usersCollections.insertOne(user);
      res.json(result);
    });

    // GET ADMIN
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // MAKE ADMIN
    app.put("/users/makeadmin", async (req, res) => {
      const user = req.body;

      if ("admin" === "admin") {
        const filter = { email: user.Email };
        const updateDoc = { $set: { role: "admin" } };
        const result = await usersCollections.updateOne(filter, updateDoc);
        res.json(result);
      }
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Hero Rider is Running"));

app.listen(port, () => console.log(`Hero Rider is running on port ${port}`));

// hero_rider
// H6xfmXdg780d3W7j
