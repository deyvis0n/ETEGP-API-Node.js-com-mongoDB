const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const uri = "mongodb+srv://dbUser:dbUser@cluster0.wxg9a.mongodb.net/test"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const port = process.env.PORT || '1337'
app.set('port', port)

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

client.connect(err => {
    if(err) console.log(err)

    const collection = client.db("teste-bd").collection("crud")

    app.route('/')
    .get((req, res) => {
        res.render('index.ejs')
    })

    app.route('/show').get((req, res) => {
        collection.find().toArray((err, results) => {
            if(err) return console.log(err)
            res.render('show.ejs', {crud: results})
        })
    })

    app.route('/show')
    .post((req, res) => {
        collection.insertOne(req.body, () => {
            res.redirect('/show')
        })
    })

    app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id
        collection.find(ObjectId(id)).toArray((err, result) => {
            if(err) return res.send(err)
            res.render('edit.ejs', {crud: result})
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var name = req.body.name
        var surname = req.body.surname

        collection.updateOne({_id: ObjectId(id)}, {
            $set: {
                name: name,
                surname: surname
            }
        }, (err, result) => {
            if(err) return res.send(err)
            res.redirect('/show')
            console.log('Banco de dados atualizado')
        })

    })

    app.route('/delete/:id')
    .get((req,res) => {
        var id = req.params.id
        collection.deleteOne({_id: ObjectId(id)}, (err, result) => {
            if(err) return res.send(500, err)
            console.log('Usuario deletado do banco de dados')
            res.redirect('/show')
        })
    })

    app.listen(port, () => { console.log(`Servidor rodando na porta ${port}`)})
})