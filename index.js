import express from "express";
import expressGraphQL from "express-graphql";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import schema from "./graphql/schema";
const graphqlHTTP = require('express-graphql')

const app = express();
const PORT = process.env.PORT || "4000";
const db = "mongodb+srv://User:confidential@cluster0-trjba.mongodb.net/test?retryWrites=true";

mongoose.connect(
    db,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

app.use((err, req, res, next) => {
  res.status(500).json({ error: { message: 'Internal Server Error' } })
})

app.use((req, res, next) => {
  res.status(404).json({ error: { message: 'Route not found.' } })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
