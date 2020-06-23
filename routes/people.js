import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as db from "../database.js";

const router = express.Router();

// let people = []
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
router.get("/:personId", async (req, res) => {
  try {
    const person = await db.findEntity("people", req.params.personId);
    if (!person) {
      res.status(404).send("Not Found");
      return;
    }
    res.status(200).json(person);
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
    const person = await db.createEntity("people", req.body);
    res.status(201).json(person);
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
    await db.findEntity("people", req.params.peopleId);
    res.status(200).json(people);
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
    await db.updateEntity("people", req.body, req.params.peopleId);
    res.status(200).json(people);
  } catch (err) {
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
    await db.deleteEntity("people", req.params.peopleId);
    res.status(200).send("ok")
  } catch (err) { 
    res.status(500).send("Internal Server Error");
  }
});

export default router;
