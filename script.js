document.addEventListener("DOMContentLoaded", () => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    const pokemonGrid = document.getElementById("pokemonGrid");
    const inputPokemon = document.getElementById("searchPokemon");
    const cleanSearch = document.getElementById("cleanSearch");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("modal");
    const body = document.querySelector("body");
    const modalBody = document.querySelector(".modal-body");
    
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

            // console.log(pokeDetails.abilities)

            const abilities = await Promise.all(pokeDetails.abilities.map(async (ability) => {

                const abilitiesRes = await fetch(ability.ability.url);
                if (!abilitiesRes) { console.log("ERRO na requisição do tipo", ability.ability.url); return}

                const responseAbility = await abilitiesRes.json()

                return responseAbility.name;
            }))

            return {
                id,
                ...pokeDetails,
                types,
                abilities,
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

    function showPokemonDetails(pokemon) {
        modalBody.innerHTML = `
        <img src="${setPokeImg(pokemon)}" alt="${pokemon.name}" />
        <h3>${pokemon.name}</h3>
            <div class="pokemon-details">
                <div class="detail-items">
                    <strong>Height</strong>
                    ${(pokemon.height / 10).toFixed(1)} m
                </div>
                <div class="detail-items">
                    <strong>Weight</strong>
                    ${(pokemon.weight).toFixed(1)} kg
                </div>
                <div class="detail-items">
                    <strong>Types</strong>
                    ${pokemon.types.map(type => type.name).join(", ")}
                </div>
                <div class="detail-items">
                    <strong>Abilities</strong>
                    ${pokemon.abilities.join(", ")}
                </div>
                <div class="detail-items">
                    <strong>HP</strong>
                    ${pokemon.stats[0].base_stat}
                </div>
                <div class="detail-items">
                    <strong>Atack</strong>
                    ${pokemon.stats[1].base_stat}
                </div>
                <div class="detail-items">
                    <strong>Defense</strong>
                    ${pokemon.stats[3].base_stat}
                </div>
                <div class="detail-items">
                    <strong>Speed</strong>
                    ${pokemon.stats[5].base_stat} km/h
                </div>
            </div>

        `;
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
                <span class="type-badge" style="background-color: ${type.color}">${type.name}</span>
            `
        ).join("");

        pokemonGrid.appendChild(pokemonCard);
        pokemonCard.appendChild(img);
        pokemonCard.appendChild(title);
        pokemonCard.appendChild(typeDiv);

        closeModal.addEventListener("click", () => {
                modal.style.display = "none";
            })
    
            pokemonCard.addEventListener('click', () => {
                modal.style.display = "flex";
                showPokemonDetails(pokemon)
            })

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

    inputPokemon.addEventListener("input", (e) => { 
        const searchValue = e.target.value.toLowerCase().trim();

        if (searchValue !== "") {
            cleanSearch.style.display = "flex";
            const filteredPokemons = allPokemons.filter((pokemon) => {
               if (!pokemon) return false;
               return pokemon.name.toLowerCase().includes(searchValue)
            })

            pokemonGrid.innerHTML = "";
            if (filteredPokemons.length == 0) {

                const notFoundPokemon = document.createElement("div");
                notFoundPokemon.className = "card-not-found"

                notFoundPokemon.innerHTML = `
                    <span>Pokémon ${searchValue} não encontrado!</span>
                `;

                pokemonGrid.appendChild(notFoundPokemon)


            } else {
                renderPokemonsGrid(filteredPokemons)
            }
        }
        else {
            cleanSearch.style.display = "none";
            renderPokemonsGrid(allPokemons);
        }
    })

    cleanSearch.addEventListener("click", () => {
        inputPokemon.value = "";
        cleanSearch.style.display = "none";
        renderPokemonsGrid(allPokemons)
    })

    getPokeInfos()
})