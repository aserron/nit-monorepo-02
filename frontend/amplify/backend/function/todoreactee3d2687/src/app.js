// /*
// Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["GRAPHQL_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

// Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
// */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

//* NIT IMPORT
const axios = require("axios")
const cors = require('cors')


// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/items', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/items/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

const refreshConfig = {
  method: 'post',
  url: `https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.152099c5f964c9211038e3ecdca0df90.551441c19d3225870a2bf0dd76169b01&client_id=1000.EQYZLSIQFA34VRCDMIZ2W3PFP8TPHI&client_secret=${Parameters.GRAPHQL_API_KEY}&grant_type=refresh_token`,
  headers: {
    'Cookie': 'b266a5bf57=57c7a14afabcac9a0b9dfc64b3542b70; iamcsr=51cc2dde-0b07-4c90-b6dc-3ffa75cdb357; _zcsr_tmp=51cc2dde-0b07-4c90-b6dc-3ffa75cdb357'
  }
};


/**********************
 * NIT CODE get method *
 **********************/

app.post('/save-to-zoho', async (req, res) => {
  try {
    const { firstName, lastName, email, user, description, location, website, twitter_username } = req.body
    const refreshToken = await axios(refreshConfig)
    axios({
      method: 'post',
      url: 'https://recruit.zoho.com/recruit/v2/Candidates',
      headers: {
        'Authorization': `Zoho-oauthtoken ${refreshToken.data.access_token}`,
        'Content-Type': 'application/json'
      },
      data: { 
        "data": [
          { "Origin": "Github Search Utility", "Skill_Set": description, "Github": user, "Current_Employer": null, "Street": null, "Email": email, "Zip_Code": null, "Experience_in_Years": null, "$approved": true, "State": null, "Country": location, "Rating": null, "$applied_with_linkedin": null, "Website": website, "Twitter": twitter_username, "Salutation": null, "Applying_for": null, "Source": "Github Search Utility", "First_Name": firstName, "Full_Name": firstName + " " + lastName, "Phone": null, "Mobile": null, "Last_Name": lastName, "Current_Salary": null, "Expected_Salary": null }], "trigger": ["approval", "workflow", "blueprint"]
      }
    })
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (error) {
        res.status(400).json({ error: error.toString() });
      });

  }
  catch (err) {

  }

})



/****************************
* Example post method *
****************************/

app.post('/items', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/items/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/items', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/items/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/items', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/items/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started at port 3000")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
