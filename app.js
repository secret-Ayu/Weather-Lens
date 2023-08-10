const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static("public"));
// Setting path for public directory 
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
var temp = "";
var humidity = "";
var pressure = "";
var speed = "";
var desc = "";
var city = "";
var state1 = "";
var visi = "";
var temp_min = "";
var temp_max = "";
var sunrise = "";
var sunset = "";

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
let day = weekday[d.getDay()];
const monthh = month[d.getMonth()];
app.get("/", function (req, res) {
    res.render("index", {
        temp: temp, humidity: humidity, pressure: pressure, speed: speed, day: day, date: d.getDate(), year: d.getFullYear(),
        month: monthh, desc: desc, state: state1, city: city, visi: visi,
        temp_max: temp_max, temp_min: temp_min, temp_max: temp_max, sunrise: sunrise, sunset: sunset
        
    });
});



app.post("/", function (req, res) {
    console.log(req.body);
    city = req.body.city;
    var state = req.body.state;
    if (city === "") { res.redirect("/"); }
    else { 
    console.log(city);
    console.log(state);
    if (state === "Andhra Pradesh") { state = "AD"; }
    else if (state === "Assam") { state = "AS"; }
    else if (state === "Bihar") { state = "BR"; }
    else if (state === "Chattisgarh") { state = "CG"; }
    else if (state === "Delhi") { state = "DL"; }
    else if (state === "Goa") { state = "GA"; }
    else if (state === "Gujarat") { state = "GJ"; }
    else if (state === "Haryana") { state = "HR"; }
    else if (state === "Himachal Pradesh") { state = "HP"; }
    else if (state === "Jammu and Kashmir") { state = "JK"; }
    else if (state === "Jharkhand") { state = "JH"; }
    else if (state === "Karnataka") { state = "KA"; }
    else if (state === "Kerala") { state = "KL"; }
    else if (state === "Lakshadweep Islands") { state = "LD"; }
    else if (state === "Madhya Pradesh") { state = "MP"; }
    else if (state === "Maharashtra") { state = "MH"; }
    else if (state === "Manipur") { state = "MN"; }
    else if (state === "Meghalaya") { state = "ML"; }
    else if (state === "Mizoram") { state = "MZ"; }
    else if (state === "Nagaland") { state = "NL"; }
    else if (state === "Odisha") { state = "OD"; }
    else if (state === "Pondicherry") { state = "PY"; }
    else if (state === "Punjab") { state = "PB"; }
    else if (state === "Rajasthan") { state = "RJ"; }
    else if (state === "Sikkim") { state = "SK"; }
    else if (state === "Tamil Nadu") { state = "TN"; }
    else if (state === "Telangana") { state = "TS"; }
    else if (state === "Tripura") { state = "TR"; }
    else if (state === "Uttar Pradesh") { state = "UP"; }
    else if (state === "Uttarakhand") { state = "UK"; }
    else if (state === "West Bengal") { state = "WB"; }
    else if (state === "Andaman and Nicobar Islands") { state = "AN"; }
    else if (state === "Chandigarh") { state = "CH"; }
    else if (state === "Dadra & Nagar Haveli and Daman & Diu") { state = "DNHDD"; }
    else if (state === "Ladakh") { state = "LA"; }
    else { state = "OT"; }
    console.log(state);
    const uri = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",IND&limit=&appid="+process.env.API_KEY;

    var options = {
        url: uri
    }

    request(options, function (err, response, body) {
        if (err) {
            console.log(err);
        }
        else {

            console.log(body);

            const r = JSON.parse(body);



            if (r.length === 0) { res.redirect("/"); }

            else {
               
                const uri = "https://api.openweathermap.org/data/2.5/weather?lat=" + r[0].lat + "&lon=" + r[0].lon + "&appid="+process.env.API_KEY;
                var option2 = {

                    url: uri
                }

                request(option2, function (err, response, body) {
                    if (err) console.log(err);
                    else {
                        console.log(body);
                        var p = JSON.parse(body);
                        console.log(p);
                        temp = p.main.temp;
                        temp = parseInt(temp);
                        console.log(temp);
                        temp = temp - 273.15;
                        temp = temp.toString();
                        temp = temp.substring(0, 4);
                         

                            desc = p.weather[0].description;
                       
                        humidity = p.main.humidity;
                        pressure = p.main.pressure;
                        speed = p.wind.speed;
                        temp_min = p.main.temp_min;
                        temp_min = parseInt(temp_min);
                        temp_min = temp_min - 273.15;
                        temp_min = temp_min.toString();
                        temp_min = temp_min.substring(0, 4);

                        temp_max = p.main.temp_max;
                        temp_max = parseInt(temp_max);
                        temp_max = temp_max - 273.15;
                        temp_max = temp_max.toString();
                        temp_max = temp_max.substring(0, 4);
                        sunrise = p.sys.sunset;
                        visi = p.visibility;
                        var timestamp = (p.sys.sunrise);
                        var times = (parseInt(timestamp)) * 1000;

                        var date = new Date(times);
                        date = date.toLocaleString()
                        date = date.substring(10);
                        sunrise = date;
                        var date2 = new Date((p.sys.sunset) * 1000);
                        date2 = date2.toLocaleString()
                        date2 = date2.substring(10);
                        sunset = date2;
                        state1 = p.name;
                        res.redirect("/");
                    }
                })
            }
        }

    });
};
});

app.listen(port, function () {
    console.log("Server is running on port " + port);
});