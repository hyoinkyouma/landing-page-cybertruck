//express server
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");

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

//Mailchimp keys
//api key
//248675f79100a1c9b71f35f22d65a5e0-us14
//list Id
//ff35c83c20

//need css files
app.use(express.static(path.join(__dirname, "../public/")));

//need to parse post request
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/post-form", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/post_form.html"));
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

  const listID = "ff35c83c20";
  const apiKey = "bbd10e4dae5a05c91e4ace5d030a6b91-us14";
  const url = `https://us14.api.mailchimp.com/3.0/lists/${listID}`;

  //options for http req
  const options = {
    method: "POST",
    auth: `roman:`,
  };

  //API Req
  //response is verbose to not confuse with res above
  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(path.join(__dirname, "../public/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "../public/failure.html"));
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
