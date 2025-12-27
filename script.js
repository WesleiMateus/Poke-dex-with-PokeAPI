document.addEventListener("DOMContentLoaded", () => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    const pokemonGrid = document.getElementById("pokemonGrid");

    //Se as func nao funcionarem, analisa essa parte aqui e muda pra classList.add() com o optionalChaining "?."

    let allPokemons = [];

    function showLoading() {
        loadingOverlay.style.opacity = 1;

    };
    
    function hideLoading() {
        loadingOverlay.style.zIndex = -99999;
        loadingOverlay.style.opacity = 0;
    };

    function getTypeColors(type) {
        return getComputedStyle(document.documentElement).getPropertyValue(`--type-color-${type}`).trim() || "grey";
    }

    async function getPokeDetails(url) {
        try {

            const id = url.split("/").filter(Boolean).pop()
            if (!id) {
                console.log(`Pokémon com ID: ${id} não encontrado, url: ${url}`)
                return null;
            }

            
            const response = await fetch(url);
            if (!response.ok) {
                console.log(`Erro ao buscar dados da API referente ao pokémon com ID: ${id}!`)
                return null;
            }

            const pokeDetails = await response.json();

            const types = await Promise.all(pokeDetails.types.map( async (type) => {

                const typeRes = await fetch(type.type.url)
                if (!typeRes) { console.log("ERRO na requisição do tipo", type.type.url); return}

                const responseType = await typeRes.json();

                return {
                    name: responseType.name,
                    color: getTypeColors(type.type.name)
                }
            }))


            return {
                id,
                ...pokeDetails,
                types
            };

        } catch (err) {
            console.log("ERRO: Erro ao buscar detalhes do pokémon", err)
            return null

        } finally {
            //nada ainda
        }
    }

    function setPokeImg (sprites) {
        const svgFrontDefault = sprites.sprites.other.dream_world?.front_default;
        const pngFrontDefault = sprites.sprites.front_default;

        return svgFrontDefault || pngFrontDefault;
    }

    function createPokemonCard(pokemon) {
        const pokemonCard = document.createElement("div");
        pokemonCard.className = "poke-card";
        pokemonCard.dataset.id = pokemon.id;

        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = pokemon.name;
        img.src = setPokeImg(pokemon);

        const title = document.createElement("h3");
        title.textContent = pokemon.name;

        const typeDiv = document.createElement("div");
        typeDiv.className = "pokemon-types";

        typeDiv.innerHTML = pokemon.types.map(type => 
            `
                <span>${type.name}</span>
            `
        ).join("");

        console.log(pokemon.types)

        
        pokemonGrid.appendChild(pokemonCard);
        pokemonCard.appendChild(img);
        pokemonCard.appendChild(title);
        pokemonCard.appendChild(typeDiv);

        return pokemonCard;

    }

    function renderPokemonsGrid(pokemons) {
        pokemonGrid.innerHTML = "";
        const fragment = document.createDocumentFragment();

        for ( const pokemon of pokemons ) {
            const card = createPokemonCard(pokemon);
            fragment.appendChild(card);
        } 

        pokemonGrid.appendChild(fragment) 
    }

    async function getPokeInfos() {

        try {
            showLoading()

            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=251")

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)

            const dataResponse = await response.json();

            const pokeInfos = await Promise.all(dataResponse.results.map( async (pokemon) => {
                const details = await getPokeDetails(pokemon.url);
                return details; 
            }))
            
            allPokemons = pokeInfos.filter(Boolean);

            renderPokemonsGrid(allPokemons)

            getPokeDetails(dataResponse.results[0].url)

        } catch (err) {
            console.log("Erro ao buscar pokémon", err)
        } finally {
            hideLoading();
            
        }
    }

    getPokeInfos()
})