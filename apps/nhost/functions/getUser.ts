import { Request, Response } from 'express';
import jwt from "jsonwebtoken";

export default (req: Request, res: Response) => {
  const token = req.body.token;
  const jwtSecret = JSON.parse(process.env.NHOST_JWT_SECRET);
  var decoded = jwt.verify(token, jwtSecret.key)[
    'https://hasura.io/jwt/claims'
  ]; 

  try {
    res.status(200).send({ id: decoded['x-hasura-user-id']})
  } catch (error) { 
    console.log(error);
    res.status(400).send("Error")
  }
}