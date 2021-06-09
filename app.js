const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { response } = require("express");
const _ = require("lodash");

const app = express();
// Setting up templating engine
app.set("view engine", "ejs");
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//connecting to mongoDB database
mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser: true});

//todoList schema 
const listSchema = new mongoose.Schema({
    name: String
});

//model items
const Item = mongoose.model("Item", listSchema);

const defaultItems = [];


//root location
app.get("/", function(req, res){
    
    Item.find({}, function(err, results){
        
        res.render("list.ejs", {listTitle:"Today", addItems: results});
          
    });
});

//custom list schema  
const customListSchema = new mongoose.Schema({
    name: String,
    items: [listSchema]
});

// collection lists
const List = mongoose.model("List", customListSchema);

//GET for CUSTOM LIST NAME IN PARARMS 
app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });     
                list.save(function(err){
                    if(err) console.log(err);
                    else console.log("new lsit Itetm inserted in a new custom List");
                });
                res.redirect("/"+customListName);
            }
            else{
                res.render("list", {listTitle: foundList.name, addItems: foundList.items})
            }
        }else{
            console.log(err);
        }
    });
});

// app.get("/about", function(req, res){
//     res.render("about.ejs");
// });

// ADDING A NEW ITEM
app.post("/", function(req, res){
    const newItemName = req.body.newItem;
    const listName = req.body.list;
    // console.log(listName);
    const item = new Item({
        name: newItemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

// FOR DELETING AN ITEM
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.deleteOne({_id: checkedItemId}, function(err){
            if(err) console.log(err);
            else console.log("element deleted yay!");
            res.redirect("/"); 
        });
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items:{_id: checkedItemId}}}, function(err, results){
            if(err) console.log(err);
            else{
                res.redirect("/"+listName);
            }
        })
    }
    
});

// PORT 3030 Listening 
app.listen(3030, function(){
    console.log("Listening at port 3030");
})