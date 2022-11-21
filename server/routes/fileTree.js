const express = require("express");
const router = express.Router();
//controller
const {
  addFolder,
  getFolders,
  updateFolder,
  delFolder,
  getFolder,
  getRoot,
} = require("../controller");

router.post("/folders", addFolder);
router.get("/root", getRoot);
router.get("/folders", getFolders);
router.get("/folders/:id", getFolder);
router.patch("/folders/:id", updateFolder);
router.delete("/folders/:id", delFolder);

module.exports = router;
