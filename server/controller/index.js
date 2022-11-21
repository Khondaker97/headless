const { ObjectId } = require("mongodb");
const db = require("../db/conn");
//db
const database = db.getDb("FileTree");
const folders = database.collection("folders");

//insert one
const addFolder = async (req, res) => {
  const { folderName, parentId } = req.body;
  const data = {
    parentId,
    folderName,
    children: [],
    createdAt: new Date(),
  };
  try {
    const counts = await folders.estimatedDocumentCount();
    if (counts === 0) {
      //1st folder or Root
      let rootData = { ...data, parentId: null };
      await folders.insertOne(rootData);
      return res.status(201).send("Successfully Root Created!");
    } else {
      const result = await folders.insertOne(data);
      let childId = result.insertedId;
      folders.findOneAndUpdate(
        { _id: ObjectId(parentId) },
        { $push: { children: childId } }
      );
      return res.status(201).send({ success: true, error: false });
    }
  } catch (error) {
    res.status(500).send("Failed!");
  }
};
//get one
const getFolder = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await folders
      .find(
        { parentId: id }
        // { projection: { _id: 0, children: 1 } }
      )
      .toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Failed!");
  }
};
//get ALL From root
const getRoot = async (req, res) => {
  try {
    const result = await folders
      .find(
        { parentId: null },
        { projection: { children: 1, folderName: 1, parentId: 1 } }
      )
      .toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Failed!");
  }
};
//get ALL
const getFolders = async (req, res) => {
  try {
    const result = await folders.find({}).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Failed!");
  }
};

//update
const updateFolder = async (req, res) => {
  const id = req.params.id;
  const folderName = req.body.folderName;
  try {
    const result = await folders.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { folderName: folderName }, $currentDate: { lastModified: true } }
    );
    res.status(204).send(result);
  } catch (error) {
    res.status(400).send("Failed!");
  }
};
//delete
const delFolder = async (req, res) => {
  const folderId = req.params.id;
  try {
    const delFolder = await folders.findOneAndDelete(
      { _id: ObjectId(folderId) },
      { projection: { _id: 0, parentId: 1 } }
    );
    let parentFolder = delFolder.value.parentId;
    // console.log(parentFolder);
    if (parentFolder) {
      folders.findOneAndUpdate(
        { _id: ObjectId(parentFolder) },
        {
          $pull: { children: ObjectId(folderId) },
        }
      );
    }
    await folders
      .aggregate([{ $match: { parentId: folderId } }])
      .forEach((doc) => {
        folders.deleteOne({ parentId: doc.parentId });
      });
    res.status(204).send({ success: true, error: false });
  } catch (error) {
    res.status(400).send({ error: true });
  }
};
module.exports = {
  addFolder,
  getRoot,
  getFolder,
  getFolders,
  updateFolder,
  delFolder,
};
