const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { response } = require("express");

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

// The next three items are default items of list
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



app.get("/", function(req, res){
    
    Item.find({}, function(err, results){
        if(results.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else console.log("successfully inserted into DB");
            })
            res.redirect("/");
            
        }else{
            res.render("list.ejs", {listTitle:"Today", addItems: results});
        }    
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
    const customListName = req.params.customListName;
    
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
    let newItemName = req.body.newItem;
    console.log(newItemName);
    const addNew = new Item({
        name: newItemName
    });
    addNew.save(function(err){
        if(err){
            console.log(err);
        }else console.log("newData inserted successfully!");
    })
    res.redirect("/");
});

// FOR DELETING AN ITEM
app.post("/delete", function(req, res){
    const deleteId = req.body.checkbox;
    Item.deleteOne({_id: deleteId}, function(err){
        if(err) console.log(err);
        else console.log("element deleted yay!");
        res.redirect("/"); 
    });
});

// PORT 3030 Listening 
app.listen(3030, function(){
    console.log("Listening at port 3030");
})