//configurando o servidor
const express = require("express")
const server = express()

//configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com o banco de dados
const Pool = require("pg").Pool
const db = new Pool({
    user:'postgres',
    password:'123456',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a templete engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

//configurando a apresentação da página
server.get("/", function(req, res){
    db.query("SELECT name, blood FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res){
    //pergar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios")
    }
    
    //colocando valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(err){
        if (err) return res.send("Erro no banco de dados")

        return res.redirect("/")
    })

})

//ligar o servidor e permitindo acesso na porta 3000
server.listen(3000)