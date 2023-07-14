var express = require("express");
var router = express.Router();

const AWS = require("aws-sdk");

AWS.config.loadFromPath("./config.json");

const s3 = new AWS.S3();

/* *
 *  wopi CheckFileInfo endpoint
 *
 *  Returns info about the file with the given document id.
 *  The response has to be in JSON format and at a minimum it needs to include
 *  the file name and the file size.
 *  The CheckFileInfo wopi endpoint is triggered by a GET request at
 *  https://HOSTNAME/wopi/files/<document_id>
 */
router.get("/files/:fileId", function (req, res) {
  console.log("file id: " + req.params.fileId);
  // test.txt is just a fake text file
  // the Size property is the length of the string
  // returned by the wopi GetFile endpoint

  s3.headObject(
    { Bucket: "demo-s3-bucket-july", Key: req.params.fileId },
    (err, data) => {
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
    }
  );
  // res.json({
  //   BaseFileName: "test.pptx",
  //   Size: 11,
  //   UserId: 1,
  //   UserCanWrite: true,
  // });
});

/* *
 *  wopi GetFile endpoint
 *
 *  Given a request access token and a document id, sends back the contents of the file.
 *  The GetFile wopi endpoint is triggered by a request with a GET verb at
 *  https://HOSTNAME/wopi/files/<document_id>/contents
 */
router.get("/files/:fileId/contents", function (req, res) {
  // we just return the content of a fake text file
  // in a real case you should use the file id
  // for retrieving the file from the storage and
  // send back the file content as response

  s3.getObject(
    { Bucket: "demo-s3-bucket-july", Key: req.params.fileId },
    function (err, data) {
      if (err) {
        console.log("Error retrieving file content:", err);
        res.sendStatus(404);
      } else {
        const fileContent = data.Body;
        console.log("DATA....", data);
        res.send(fileContent);
      }
    }
  );

  // var fileContent = "Hello world!";
  // res.send(fileContent);
});

/* *
 *  wopi PutFile endpoint
 *
 *  Given a request access token and a document id, replaces the files with the POST request body.
 *  The PutFile wopi endpoint is triggered by a request with a POST verb at
 *  https://HOSTNAME/wopi/files/<document_id>/contents
 */
router.post("/files/:fileId/contents", function (req, res) {
  console.log("wopi PutFile endpoint");

  if (req.body) {
    const fileContent = req.body;
    console.log("REQ BODY...", fileContent);

    // Use the S3 putObject method to save the file content
    s3.putObject(
      {
        Bucket: "demo-s3-bucket-july",
        Key: req.params.fileId,
        Body: fileContent,
      },
      function (err) {
        if (err) {
          console.log("Error saving file content:", err);
          return res.sendStatus(500);
        } else {
          console.log("File saved successfully");
          return res.sendStatus(200);
        }
      }
    );
  } else {
    console.log("Not possible to get the file content.");
    return res.sendStatus(404);
  }
});

module.exports = router;
