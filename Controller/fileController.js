const File = require("../Models/fileModels");
const { successResponse } = require("../Config/responseMsg");
const { v4: uuid4 } = require("uuid");
const sendMailToUser = require("../Services/emailService");

const sendFile = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      throw new Error("Please provide a file for upload");
    }

    const fileObj = new File({
      filename: file.filename,
      uuid: uuid4(),
      path: file.path,
      size: file.size,
    });

    const saveFile = await fileObj.save();

    const fileLink = {
      File: `${process.env.APP_BASE_URL}/files/${saveFile.uuid}`,
    };

    res.json(
      successResponse(
        fileLink,
        "File uploaded successfully. You can access the file using the following link:"
      )
    );
  } catch (error) {
    console.log("An issue occurred while processing the file link." + error);
    next(error);
  }
};

const renderFile = async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link has been expired." });
    }
    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    console.log("An issue occurred while processing the file link." + error);
    return res.render("download", { error: "Something went wrong." });
    // next(error); // Uncomment this line if you want to pass the error to the error handling middleware.
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link has been expired." });
    }
    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
  } catch (error) {
    console.log("An issue occurred while processing the file link." + error);
    // return res.render("download", { error: "Something went wrong." });
    next(error); // Uncomment this line if you want to pass the error to the error handling middleware.
  }
};

const sendEMail = async (req, res, next) => {
  const uuid = req.body.uuid;
  const emailTo = req.body.emailTo;
  const emailFrom = req.body.emailFrom;

  if (!uuid || !emailTo || !emailFrom) {
    return res
      .status(422)
      .send({ error: "All fields are required except expiry." });
  }
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent once." });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    const download = `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`;
    const size = `${parseInt(file.size / 1000)} KB`;
    const expires = "24 hours";

    await sendMailToUser(emailFrom, emailTo, download, expires, size);
    res.json("Mail sent");
  } catch (error) {
    console.log("An issue occurred while processing the file link." + error);
    // return res.render("download", { error: "Something went wrong." });
    next(error); // Uncomment this line if you want to pass the error to the error handling middleware.
  }
};

module.exports = { sendFile, renderFile, downloadFile, sendEMail };
