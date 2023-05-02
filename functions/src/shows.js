import { FieldValue } from "firebase-admin/firestore";
import jwt  from "jsonwebtoken";
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const coll = db.collection('shows');

export async function getShows (req, res) {
  const showsCollection = await coll.get()
  const shows = showsCollection.docs.map(doc => ({...doc.data(), id: doc.id}))
  res.send(shows)
}

export async function addShow (req, res) {
  const token = req.headers.authorization
  if(!token) {
    res.status(401).send({message: 'Unauthorized. A valid token is required.'})
    return
  }
  const decoded = jwt.verify(token, secretKey)
  if(!decoded) {
    res.status(401).send({ message: 'A valid token is required.'})
    return
  }
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

export async function deleteShow (req, res) {
  const {showId} = req.params
  await coll.doc(showId).delete()
  getShows(req, res)
}

export async function editShow (req, res) {
  const { showId } = req.params
  await coll.doc(showId).update(req.body)
    .catch(err => res.status(500).send(err));
  getShows(req, res)
}