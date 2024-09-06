import fs from 'fs';
import express from 'express';

const app = express();
const port = 3000;
app.get("/",async (req,res)=>{
    res.setHeader('Content-Type',"text/html");
    await  res.sendFile("index.html");
});
app.get("/songs",(req,res)=>{
    res.json({songs:fs.readdirSync("public/songs")});
});
app.listen(port,()=>{
    console.log(`http://192.168.0.108:3000/Spotify-clone/`);
})