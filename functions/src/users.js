import { FieldValue } from "firebase-admin/firestore";
import { db } from "./dbConnect.js";

const coll = db.collection('users')

export async function signUp (req, res) {
  const { email, password } = req.body
  if (!email || password.length < 6) {
    res.status(400).send({message: 'Username/Password cannot be empty. Password must be at least 6 characters.'})
    return
  }
  //TODO: check if email is already in use
  const newUser = {
    email: email.toLowerCase(),
    password,
    createdAt: FieldValue.serverTimestamp(),
  }
  await coll.add(newUser)
  // res.status(201).send({message: 'User Added!'})
  
  //once the user is added, log them in
  login(req, res)
}

export async function login (req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).send({message: 'Username/Password cannot be empty'})
    return
  }
  const users = await coll
    .where('email', '==', email.toLowerCase())
    .where('password', '==', password)
    .get()
  let user = users.docs.map(doc => ({...doc.data(), id: doc.id}) )[0]
  if (!user) {
    res.status(400).send({message: 'Invalid email and/or password.'})
    return
  }
  delete user.password
  res.send(user)

}

