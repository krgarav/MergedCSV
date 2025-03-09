const multer = require("multer");
const path = require("path");
const readCSVAndConvertToJSON = require("../services/csv_to_json");
const convertJSONToCSV = require("../services/json_to_csv");
const fs = require("fs");
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File filter to allow only CSV files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"), false);
  }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

// Controller function for handling file uploads
const uploadCSVFiles = async (req, res) => {
  try {
    if (!req.files || !req.files.file1 || !req.files.file2) {
      return res.status(400).json({ error: "Both CSV files are required" });
    }
    // Get file paths
    const file1Path = req.files.file1[0].path;
    const file2Path = req.files.file2[0].path;
    const firstJsonData = await readCSVAndConvertToJSON(file1Path);
    const secondJsonData = await readCSVAndConvertToJSON(file2Path);
    const keys = Object.keys(secondJsonData[0]);

    // for (let i = 0; i < firstJsonData.length; i++) {
    //   for (let j = 0; j < secondJsonData.length; j++) {
    //       const firstData = firstJsonData[i].barcode;
    //       const secondData = secondJsonData[j][barcodeKey];
    //     if (firstData === secondData) {
    //       const obj1 = {
    //         barcode: firstJsonData[i].barcode,
    //         roll: firstJsonData[i]["1"],
    //         attendance: secondJsonData[j]["R1"],
    //       };
    //       const obj2 = {
    //         barcode: firstJsonData[i].barcode,
    //         roll: firstJsonData[i]["2"],
    //         attendance: secondJsonData[j]["R2"],
    //       };
    //       const obj3 = {
    //         barcode: firstJsonData[i].barcode,
    //         roll: firstJsonData[i]["3"],
    //         attendance: secondJsonData[j]["R3"],
    //       };
    //       const obj4 = {
    //         barcode: firstJsonData[i].barcode,
    //         roll: firstJsonData[i]["4"],
    //         attendance: secondJsonData[j]["R4"],
    //       };
    //       finalData.push(obj1, obj2, obj3, obj4);
    //     }
    //   }
    // }
    const barcodeKey = keys[0];
    const pageKey = keys[5];
    const secondDataMap = new Map(
      secondJsonData.map((item) => [item[barcodeKey], item])
    );

    const finalData = [];
    let serialNumber = 1;
    for (const firstItem of firstJsonData) {
      const matchingSecondItem = secondDataMap.get(firstItem.barcode);
      if (matchingSecondItem) {
        for (let k = 1; k <= 4; k++) {
          finalData.push({
            serial_no: serialNumber++,
            barcode: firstItem.barcode,
            roll: firstItem[k.toString()],
            attendance: matchingSecondItem[`R${k}`],
            image_path: matchingSecondItem[pageKey],
          });
        }
      }
    }
    if (finalData.length === 0) {
      return res
        .status(402)
        .json({ success: false, message: "Empty merged file" });
    }
    const finalcsv = await convertJSONToCSV(finalData);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="finalData.csv"'
    );

    res.send(finalcsv);
  } catch (error) {
    return res
      .status(402)
      .json({ success: false, message: "error occured", error });
  }
};

module.exports = { upload, uploadCSVFiles };
