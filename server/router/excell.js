const express = require("express");
const { upload, uploadCSVFiles } = require("../controller/fileUploadController");

const router = express.Router();

router.post("/", upload.fields([{ name: "file1" }, { name: "file2" }]), uploadCSVFiles);

module.exports = router;
