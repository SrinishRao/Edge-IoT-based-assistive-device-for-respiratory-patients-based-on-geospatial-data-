const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

const signUpLoginDao = require("../dao/signUpLoginDao");
const signUpLoginDaoobj = new signUpLoginDao();

router.get('/airQualityData', function (req, res) {

    let queryResult = {};
    const getData = async () => {
      console.log("calling");
      queryResult = await signUpLoginDaoobj.getAirQualityData();
      console.log(queryResult);
      res.status(200).json({ result: queryResult });
    }
    getData();
});


router.post("/signup", (req, res) => {
 
  let userName = req.body.UserName;
  let email = req.body.Email.toLowerCase().trim();
  let Password = req.body.Password;

  const createUserIfNotPresent = async () => {
   
      let signUpData = {
        "name": userName,
        "email": email,
        "password": Password,
      }
      await signUpLoginDaoobj.createNewUser(signUpData);
      console.log("Successfully created");
      res.status(200).json({ responseMessage: 'Successfully Created' });
    
  }
  try {
    createUserIfNotPresent();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.post("/saveAirQualityData", (req, res) => {
  let co = req.body.co;
  let no2 = req.body.no2;
  let o3 = req.body.o3;
  let temperature = req.body.temperature;
  let humidity = req.body.humidity;
  let label = req.body.label;

  const saveAirQualityData = async () => {
   
      let data = {
        "Temperature": temperature,
        "Humidity": humidity,
        "CO": co,
        "NO2": no2,
        "O3" : o3,
        "AsthmaRisk" : label
      }
      console.log("data is ");
      console.log(data);
      await signUpLoginDaoobj.saveAirQualityData(data);
      console.log("Successfully updated");
      res.status(200).json({ responseMessage: 'Successfully Updated' });
    
  }
  try {
    saveAirQualityData();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.post('/login', function (req, res) {
  
  let Email = req.body.Email.toLowerCase().trim();
  let Password = req.body.Password;
  console.log("Email,Password is" + Email + "," + Password);
  let queryResult = [];
  const checkuser = async () => {
    queryResult = await signUpLoginDaoobj.login(Email, Password);
    console.log(queryResult);

    if (!queryResult[0]) {
      console.log("invalid user");
      res.status(202).json({ validUser: false });
    } else {
      if (queryResult[0].name != null) {
        console.log("User exists! Valid credentials");
        
        res.cookie('cookie1', queryResult[0].id, { maxAge: 900000, httpOnly: false, path: '/' });
        res.cookie('cookie2', Email, { maxAge: 900000, httpOnly: false, path: '/' });
        console.log("Added cookies");
        req.session.UserID = queryResult[0].id;
        req.session.Email = Email;
        
        res.status(200).json({ validUser: true });
      }
    }
  }
  try {
    checkuser();
  }
  catch (err) {
    console.log("unable to read the database");
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});
module.exports = router;