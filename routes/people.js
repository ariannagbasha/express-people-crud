import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as db from "../database.js";

const router = express.Router();

let people = []
/**
 * http://127.0.0.1:3000/people OR http://localhost:3000/people
 * GET ALL PEOPLE - appropriate method = GET .. no req.params needed
 * GOOD STATUS: 200
 * GOOD RESPONSE: all people
 * ERROR CODE: 500 - Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const people = await db.readEntity("people");
    res.json(people);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * CREATE ONE PERSON - find appropriate method
 * GOOD STATUS: 201
 * GOOD RESPONSE: created person
 * ERROR CODE: 500 - Internal Server Error
 */

router.post("/", async (req, res) => {
  try {
    const people = await db.readEntity("people");
    res.status(201)
    people.push({...req.body, id: uuidv4()})
    res.json(people);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * GET ONE PERSON - find appropriate method
 * GOOD STATUS: 200
 * GOOD RESPONSE: person requested
 * ERROR CODE: 500 - Internal Server Error
 */
router.get("/:personId", async (req, res) => {
  try {
    const people = await db.readEntity("people");
    res.status(200)
    const foundPerson = people.find(
      (person) => person.id = req.params.personId
    )
    res.json(people);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});
/**
 * UPDATE ONE PERSON - find appropriate method
 * GOOD STATUS: 200
 * GOOD RESPONSE: updated person
 * ERROR CODE: 500 - Internal Server Error
 */
router.put("/:peopleId", async (req, res) => {
  try {
    const people = await db.readEntity("people");
    res.status(200)
    res.json(people);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * DELETE ONE PERSON - find appropriate method
 * GOOD STATUS: 200
 * ERROR CODE: 500 - Internal Server Error
 */
router.delete("/:peopleId", async (req, res) => {
  try {
    const people = await db.readEntity("people");
    res.status(200)
    const foundPerson = people.find(
      (person) => person.id = req.params.personId
    )
    people.filter((person) => person != foundPerson)
    res.json(people);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

export default router;
