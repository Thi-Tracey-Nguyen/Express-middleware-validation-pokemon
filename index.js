import express from 'express'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const baseURL = "https://pokeapi.co/api/v2/pokemon/";

// localhost:3000
// Custom validation starts here
const isPokemonValid = async (req, res, next) => {
    await fetch(baseURL + req.body.pokemonName.toLowerCase()).then(async (data) => {
        let dataText = await data.text()

    if (dataText === "Not Found") {
        next(new Error('Pokemon not found'))
    } else {
        req.body.returnedPokemon = JSON.parse(dataText)
        next()
    }
})
}

const handleInvalid = (error, req, res, next) => {
    if (error) {
        console.log(error.message)
        res.status(400).json({
            error: error.message
        })
    }
}


app.post('/', isPokemonValid, handleInvalid, (req, res) => {

    // If this fetch request returns JSON, then we want to store it as an object that we can work with.
    
    res.send({
        pokedexNumber: req.body.returnedPokemon.id,
        name: req.body.returnedPokemon.name
    });

    console.log(req)
});

// Activate the server at port 3000.
app.listen(3000, () => {
    console.log("Server running!");
});