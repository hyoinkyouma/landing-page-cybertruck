//express server
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");

//mailchimp apikeys and list endpoint
//creds.js is not on github feel free to add your own endpoints
//format is
//{mailchimp:
//  {
// apiKey: ""
// listID: ""
//  }
//}
const creds = require("./creds.js");
const mailchimp = creds.mailchimp;

const port = process.env.PORT || 3000;

//class for mailchimpjson
function Member(email, name, number, company) {
  this.members = [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name,
        PHONE: number,
        COMPANY: company,
      },
    },
  ];
}

//need css files, assets (image, font, etc.), and front-end js
app.use(express.static(path.join(__dirname, "../public/")));

//need to parse post request
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/post-form", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/post_form.html"));
});

app.get("/failure", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/failure.html"));
});

app.post("/failure", (req, res) => {
  res.redirect("/post-form");
});

app.post("/", (req, res) => {
  const user = new Member(
    req.body.email,
    req.body.name,
    Number(req.body.phone),
    req.body.company
  );
  const jsonData = JSON.stringify(user);

  const apiKey = mailchimp.apiKey;
  const listID = mailchimp.listID;

  const url = `https://us14.api.mailchimp.com/3.0/lists/${listID}`;

  //options for http req
  const options = {
    method: "POST",
    auth: `roman:${apiKey}`,
  };

  //API Req
  //response is verbose to not confuse with res above
  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(path.join(__dirname, "../public/success.html"));
    } else {
      res.redirect("/failure");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
