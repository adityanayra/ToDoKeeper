const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();
app.set("view engine", "ejs");
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let listItems = ["buy food", "cook food", "eat food"];
app.get("/", function(req, res){

    let options = {
        weekday:"long", 
        year: "numeric",
        month:"long",
        day:"numeric"
    }
    let today = new Date();
    let day = today.toLocaleDateString("en-us", options);
    res.render("list.ejs", {kindofDay: day, addItems: listItems});
   
})

app.post("/", function(req, res){
  
    let item = req.body.newItem;
    listItems.push(item);
    res.redirect("/");
})


app.listen(3030, function(){
    console.log("Listening at port 3030");
})