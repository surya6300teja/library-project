import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
 
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "library",
    password: "152004",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", async(req, res) => {
    const result = await db.query("SELECT * from items");
    const items=result.rows;
    
    res.render("index.ejs",{
        listItems:items,
        
    })

  });

  app.get("/rating", async(req, res) => {
    const result = await db.query("SELECT * from items order by recommendation desc");
    const items=result.rows;
    
    res.render("index.ejs",{
        listItems:items,
        
    })

  });

  app.get("/date", async(req, res) => {
    const result = await db.query("SELECT * from items order by dates desc");
    const items=result.rows;
    
    res.render("index.ejs",{
        listItems:items,
        
    })

  });

app.get('/info', async(req, res) => {
    const itemId = req.query.id;
    const result = await db.query("SELECT * from items where id=$1",[itemId]);
    const items=result.rows;
    
    res.render("info.ejs",{
        listItems:items
    })
    
});

app.post('/find', async(req, res) => {
    const itemId = req.body.find;
    if(Number.isInteger(itemId)){
        const result = await db.query("SELECT * from items where isbn=$1",[itemId]);
        const items=result.rows;
        
        res.render("info.ejs",{
        listItems:items
        });
    }else{
        const result = await db.query("SELECT * from items where title=$1",[itemId]);
        const items=result.rows;
        
        res.render("index.ejs",{
        listItems:items
        });
    }
    
    
});


app.get('/new', async(req, res) => {
    res.render("new.ejs")
});



app.post("/add", async(req, res) => {
    const title =req.body.title;
    const author =req.body.author;
    const isbn =req.body.isbn;
    const summary =req.body.summary;
    const contents =req.body.contents;
    const rating =req.body.rating;

    const date = new Date();
    
    try{
        await db.query("INSERT INTO items(title,author,dates,isbn,summary,contents,recommendation) values($1,$2,$3,$4,$5,$6,$7)",
        [title,author,date,isbn,summary,contents,rating]
        );
        console.log("done");
        res.redirect("/");
    }catch(err){
        
    }
    
});

app.get('/edit', async(req, res) => {
    const itemId = req.query.id;
    const result = await db.query("SELECT * from items where id=$1",[itemId]);
    const items=result.rows;
    res.render("edit.ejs",{
        listItems:items
    })
    
});

app.post("/edit", async(req, res) => {
    
    const id=req.body.id;
    const title =req.body.title;
    const author =req.body.author;
    const isbn =req.body.isbn;
    const summary =req.body.summary;
    const contents =req.body.contents;
    const rating =req.body.rating;

    const date = new Date();
    
    try{
        await db.query("UPDATE items SET title=$1,author=$2,dates=$3,isbn=$4,summary=$5,contents=$6,recommendation=$7 where id=$8",
        [title,author,date,isbn,summary,contents,rating,id]
        );
        console.log("done");
        res.redirect("/");
    }catch(err){
        
    }
    
});

 
app.get('/delete', async(req, res) => {
    const itemId = req.query.id;
    const result = await db.query("DELETE FROM items where id=$1",[itemId]);
    const items=result.rows;
    res.redirect("/");
    
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
