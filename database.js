import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import util from "util";

/*
  This file acts as a very naive database implementation
  you should **NEVER** do this in production
  For example one of the biggest issues is that if multiple requests come into the server at the same time
  and lets say one deletes people/1 an the other updates people/1
  depending on the order of the request and exact timing.. we could end up
  with very different results than we expecting
  See race conditions --> https://www.youtube.com/watch?v=7aF0q7NfwfA
*/

// turn callback style functions into promise based ones
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const fileExistsAsync = util.promisify(fs.exists);

// lets get the current directory path
const __dirname = path.resolve(path.dirname(""));

// this is the directory to our data folder
const fileDirectory = path.resolve(__dirname, "data");

// gets the exact file's name as far as its path and adding .json to the end
const getFileName = (fileName) =>
  path.resolve(fileDirectory, `${fileName}.json`);

// get the file contents as an array from the json file on disk
const getFileContents = async (fileName) => {
  try {
    // get the path to the file
    const filePath = getFileName(fileName);

    // check if this collection exists
    const fileExists = await fileExistsAsync(filePath);

    // if not just return an empty array
    if (!fileExists) {
      return [];
    }

    // get the file contents
    const fileContents = await readFileAsync(filePath);

    // parse the file contents into an array
    return JSON.parse(fileContents);
  } catch (err) {
    // lets log something happened here
    console.log("database:getFileContents", err);

    // we will re-throw the error so our other functions dont think this function was successful
    throw err;
  }
};

// re-write the file to the json file on disk
const saveFileContents = async (fileName, data) => {
  try {
    // retrieve the exact filename and its path
    const filePath = getFileName(fileName);
    // write the file contents back to the json file on disk as a JSON string
    await writeFileAsync(filePath, JSON.stringify(data));
  } catch (err) {
    console.log("database:saveFileContents", err);
    // we will re-throw the error so our other functions dont think this function was successful
    throw err;
  }
};

export const createEntity = async (entity, data = {}) => {
  try {
    // get a list of all the items in this collection
    const dbContent = await getFileContents(entity);

    // create a new entitiy
    const dataCreated = {
      ...data,
      // give the entity an id
      id: uuidv4(),
    };

    // add the entity to the array
    dbContent.push(dataCreated);

    // sabe the new entities back to the database
    await saveFileContents(entity, dbContent);

    // return the item we created
    return dataCreated;
  } catch (err) {
    console.log("database:createEntity", err);
    throw err;
  }
};

// get all of the items in the file
export const readEntity = async (entity) => await getFileContents(entity);

// find an entity by its id
export const findEntity = async (entity, id) => {
  try {
    // get all items in the file
    const entities = await readEntity(entity);

    // return the one matched or nothing
    return entities.find((item) => item.id === id);
  } catch (error) {
    console.log("database:findEntity", err);
    throw err;
  }
};

// update an entity passing its id then an object containing its updates
export const updateEntity = async (entity, id, updates) => {
  try {
    // get all the entities
    const entities = await readEntity(entity);

    // find the index of the element in our array
    const index = entities.findIndex((item) => item.id === id);

    // if we cant find it let's bail out now
    if (index === -1) {
      throw new Error("Item does not exist");
    }

    // replace the item at that index with a merged copy of the item and its updates
    entities[index] = {
      ...entities[index],
      ...updates,
    };

    // save the entities back to the json file on disk
    await saveFileContents(entity, entities);

    // return the newly updated item
    return entities[index];
  } catch (err) {
    console.log("database:updateEntity", err);
    throw err;
  }
};

// delete an entity from the db
export const deleteEntity = async (entity, id) => {
  try {
    // make sure what we are updating exists
    const item = await findEntity(entity, id);

    // bail if we cannot find the item
    if (!item) {
      throw new Error("Item does not exist");
    }

    // get all of the entities
    const entities = await readEntity(entity);

    // filter out the item we are deleting out of the array
    const newEntities = entities.filter((ent) => ent.id !== id);

    // save the new array back to the json file on disk
    await saveFileContents(entity, newEntities);
  } catch (err) {
    console.log("database:deleteEntity", err);
    throw err;
  }
};
