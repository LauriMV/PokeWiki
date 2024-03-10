const url = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

let pokemonArray = [];
    
    async function cargarPokemons(endPoint) {
        const response = await fetch(endPoint, { method: 'GET' })
        const data = await response.json();
        
        if (data.results) {
            //pintar muchos
            const array = data.results;
            pintarPokemons(array, sectionPokemons);
        } else {
            //pintar uno
            pintarUnPokemon(data, sectionPokemons);
        }
    }



 

/*async function cargarPokemons(endPoint) {
    const response = await fetch(endPoint, { method: 'GET' });
    const data = await response.json();
    if (data.results) {
        pokemonArray = data.results;
        pintarPokemons(pokemonArray, sectionPokemons);
    } else {
        pintarUnPokemon(data, sectionPokemons);
    }
}
*/
    //cargar todos los pers
    cargarPokemons(url);

    const sectionPokemons = document.querySelector('.characters');

    async function pintarPokemons(lista, lugar) {
        for (let pokemon of lista) {
            await pintarUnPokemon(pokemon, lugar); // Pra que pinte cada Pokmon
        }
    }

    async function pintarUnPokemon(pokemonData, lugar) {
        const pokemonUrl = pokemonData.url;
        const response = await fetch(pokemonUrl);
        const pokemon = await response.json();

        //  URL  del Pokémon
        const speciesUrl = pokemon.species.url;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();

        //  tres evoluciones 
        const evolutions = [];
        let currentEvolution = speciesData.chain; 
        while (currentEvolution) {
            evolutions.push(currentEvolution.species.name);
            if (currentEvolution.evolves_to.length > 0) {
                currentEvolution = currentEvolution.evolves_to[0];
            } else {
                currentEvolution = null;
            }
        }

        // Crear lo del  HTML 
        const article = document.createElement('article');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = pokemon.sprites['front_default'];
        img.alt = pokemon.name;
        const h3 = document.createElement('h3');
        h3.classList.add("nombre");
        h3.textContent = pokemon.name;
        const p = document.createElement('p');
        p.textContent = `Nº: ${pokemon.id}`;

        // para mostrar las evoluciones
        const ul = document.createElement('ul');
        evolutions.forEach(evolution => {
            const li = document.createElement('li');
            li.textContent = evolution;
            ul.appendChild(li);
        });

        // Agregar todo al artículo 
        figure.appendChild(img);
        article.append(figure, h3, p, ul,);
        lugar.appendChild(article);
    }

    //lista d tipos
const pokemonTypes = document.getElementById('pokemon-types');
    
//para el click de cada uno
pokemonTypes.addEventListener('click', (event) => {
    event.preventDefault();
    const targetType = event.target.dataset.type; //tipo de pokemos seleccionado
    if (targetType) {
        filterPokemonsByType(targetType); // Filtrar y mostrar
    }
});
        
/*function filterPokemonsByType(type) {
    const articles = document.querySelectorAll('.characters article'); // Seleccion de tods
    articles.forEach(article => {
        const ul = article.querySelector('ul');
        if (ul) {
            const li = ul.querySelector('li');
            if (li) {
                const pokemonType = li.textContent.toLowerCase(); // Obtengo el tipo de pokemon del primer elemento de la lista
                if (type === 'all' || pokemonType === type) { 
                    article.style.display = 'block'; // muestro el pokemon
                } else {
                    article.style.display = 'none'; // oculto el pokemon
                }
            }
        }
    });
}
*/

async function filterPokemonsByType(type) {
    const url = `https://pokeapi.co/api/v2/type/${type}`; 
    try {
        const response = await fetch(url); // hago  solicitud
        const data = await response.json(); // resspuesta

        // lista nombres
        const pokemonNames = data.pokemon.map(pokemon => pokemon.pokemon.name);

        // lista pokemon
        const pokemonList = await Promise.all(pokemonNames.map(async name => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            return response.json();
        }));

        // lcomtemedor
        const charactersDiv = document.querySelector('.characters');
        charactersDiv.innerHTML = '';

        // pinto pokemon
        pokemonList.forEach(pokemon => {
            pintarUnPokemon(pokemon, charactersDiv);
        });
    } catch (error) {
        console.error('Error al filtrar Pokémon por tipo:', error);
    }
}

