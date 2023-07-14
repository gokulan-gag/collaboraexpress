var express = require("express");
var router = express.Router();

const AWS = require("aws-sdk");

AWS.config.loadFromPath("./config.json");

const s3 = new AWS.S3();

/* *
 *  wopi CheckFileInfo endpoint
 */

router.get("/files/:fileId", function (req, res) {
  console.log("file id: " + req.params.fileId);
  let params = { Bucket: "demo-s3-bucket-july", Key: "" };

  const fileID = req.params.fileId;

  if (fileID == "1") {
    params.Key = "sampledocx.docx";
  }

  if (fileID == "2") {
    params.Key = "samplePPTX.pptx";
  }

  if (fileID == "3") {
    params.Key = "sampleXLSX.xlsx";
  }

  if (fileID == "4") {
    params.Key = "samplePDF.pdf";
  }

  if (fileID == "5") {
    params.Key = "sampleJPG.jpg";
  }

  s3.headObject(params, (err, data) => {
    if (err) {
      console.log("Error retrieving file information:", err);
      res.sendStatus(404);
    } else {
      console.log(data);
      const fileInfo = {
        BaseFileName: "sampledocx.docx",
        Size: data.ContentLength,
        UserId: 1,
        UserCanWrite: true,
      };

      res.json(fileInfo);
    }
  });
});

/* *
 *  wopi GetFile endpoint
 */
router.get("/files/:fileId/contents", function (req, res) {
  console.log("file id: " + req.params.fileId);
  let params = { Bucket: "demo-s3-bucket-july", Key: "" };

  const fileID = req.params.fileId;

  if (fileID == "1") {
    params.Key = "sampledocx.docx";
  }

  if (fileID == "2") {
    params.Key = "samplePPTX.pptx";
  }

  if (fileID == "3") {
    params.Key = "sampleXLSX.xlsx";
  }

  if (fileID == "4") {
    params.Key = "samplePDF.pdf";
  }

  if (fileID == "5") {
    params.Key = "sampleJPG.jpg";
  }

  s3.getObject(params, function (err, data) {
    if (err) {
      console.log("Error retrieving file content:", err);
      return res.sendStatus(404);
    } else {
      const fileContent = data.Body;
      console.log("DATA....", data);
      return res.send(fileContent);
    }
  });
});

/* *
 *  wopi PutFile endpoint
 *
 *  Given a request access token and a document id, replaces the files with the POST request body.
 *  The PutFile wopi endpoint is triggered by a request with a POST verb at
 *  https://HOSTNAME/wopi/files/<document_id>/contents
 */
router.post("/files/:fileId/contents", function (req, res) {
  // we log to the console so that is possible
  // to check that saving has triggered this wopi endpoint
  console.log("wopi PutFile endpoint");
  if (req) {
    console.dir("SAVED DATA....", req);
    // console.log(req.body.toString());
    res.sendStatus(200);
  } else {
    console.log("Not possible to get the file content.");
    res.sendStatus(404);
  }
});

module.exports = router;
