import fetch from "node-fetch";

export default async function handler(req, res){
  const { url } = req.query;
  if(!url) return res.status(400).send("Missing URL");
  try{
    const response = await fetch(url);
    const text = await response.text();
    res.setHeader("Content-Type","text/html");
    res.send(text);
  }catch(err){
    res.status(500).send("Error fetching URL");
  }
}
