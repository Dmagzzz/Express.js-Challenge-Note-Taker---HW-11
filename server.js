const express = require("express")

const app = express()

const path = require("path")

const uuidv1 = require("uuid/v1")

const fs = require("fs")

const util = require("util")

const readFileAsync = util.promisify(fs.readFile)

const writeFileAsync = util.promisify(fs.writeFile)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    readFileAsync("db/db.json", "utf-8")
    .then(notes => res.json(JSON.parse(notes)))
    .catch(error => res.json(error))
})

app.post("/api/notes", (req, res) => {
    const note = {id: uuidv1(), ...req.body}
    readFileAsync("db/db.json", "utf-8")
    .then(notes => {
        const newNotes = JSON.parse(notes)
        return writeFileAsync ("db/db.json", JSON.stringify([note, ...newNotes]))
    })
    .then(() => res.json(JSON.parse(note)))
    .catch(error => res.json(error))
})

app.delete("/api/notes/:id", (req, res) => {
    readFileAsync("db/db.json", "utf-8")
    .then(data => {
        const notes = JSON.parse(data).filter(note=>{
            return note.id !== req.params.id
        })
        res.json({
            sucess:true
        })
    })
    .catch(error => res.json(error))
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})







app.listen(3001, () => console.log("server listening on port 3001"))