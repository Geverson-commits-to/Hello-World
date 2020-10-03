const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

nunjucks.configure("views", {
	autoescape: true,
	express: app,
	watch: true
});

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "njk");

app.get("/", (req, res) =>{
 	return res.render("Home");
});

const checkidade = (req, res, next) =>{
	try{
		const { idade } = req.query
		if(!idade){
			return res.redirect("/");
		}

		next();
	}catch(erro){
		console.error(`Berrrouuu no middleware ${erro}`);
		return res.redirect(`/error/?erro=${erro} Status: 404`);
	}
} 

// rota para calcular valor no input
app.post("/check", (req, res) =>{
	try{
		const valor = req.body.age
		if(valor >= 18)
		{
			return res.redirect(`/major/?idade=${valor}`);
		}
		else
		{			
			return res.redirect(`/minor/?idade=${valor}`);
		}

	}catch(erro){
		console.error(`${erro}`)
		return res.redirect(`/error/?erro=${erro} Status: 404`);
	}
})

// rota para direcionamento caso idade maior q 18
app.get("/major", checkidade, (req, res) =>{
	const { idade } = req.query
	return res.render("major" , { idade });
});

// rota para direcionamento caso idade menor q 18
app.get("/minor", checkidade, (req, res) =>{
	const { idade } = req.query
	return res.render("minor" , { idade });
});

// rota error
app.get("/error", (req, res) =>{
	return res.send(req.query.erro)
});

app.listen(3000);
