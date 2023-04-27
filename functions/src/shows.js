import { FieldValue } from "firebase-admin/firestore";
import { db } from "./dbConnect.js";

const coll = db.collection('shows');

export async function getShows (req, res) {
  const showsCollection = await coll.get()
  const shows = showsCollection.docs.map(doc => ({...doc.data(), id: doc.id}))
  res.send(shows)
}

export async function addShow (req, res) {
  const {seasons, title, poster} = req.body
  if (!title || !poster) {
    res.status(400).send({message: 'Must include title and poster'})
    return
  }
  let newShow = {seasons, title, poster, createdAt: FieldValue.serverTimestamp()}
  await coll.add(newShow)
  //res.status(201).send({message: "Show Added!"})
  getShows(req,res)
}