const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { response } = require("express");

const app = express();
app.set("view engine", "ejs");
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//connecting to mongoDB database
mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser: true});

//todoList schema 
const listSchema = new mongoose.Schema({
    name: String
});
//model created
const Item = mongoose.model("Item", listSchema);

const newItem = new Item({
    name: "WElcome "
});
const newItem1 = new Item({
    name: "To your list"
});

const newItem2 = new Item({
    name: "hit tthat add "
});

const defaultItems = [newItem, newItem1, newItem2]

Item.insertMany(defaultItems, function(err){
    if(err){
        console.log(err);
    }else console.log("successfully inserted");
})

app.get("/", function(req, res){
    res.render("list.ejs", {
        listTitle:"Today",
        addItems: defaultItems
    })
});

app.get("/about", function(req, res){
    res.render("about.ejs");
});

app.post("/", function(req, res){
    

    let item = req.body.newItem;
    
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        
    console.log(item);
    defaultItems.push(item);
    res.redirect("/");
    }
})
app.get("/work", function(req, res){
    
    res.render("list", {listTitle: "Work", addItems: workItems})
})

app.post("/work", function(req, res){
    let item = req.body.newItem;
    console.log("got this in work list ");
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3030, function(){
    console.log("Listening at port 3030");
})