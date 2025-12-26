const loadingOverlay = document.getElementById("loadingOverlay");

document.addEventListener("DOMContentLoaded", () => {


    //Se as func nao funcionarem, analisa essa parte aqui e muda pra classList.add() com o optionalChaining "?."

    function showLoading() {
        loadingOverlay.style.opacity = 1;
    };
    
    function hideLoading() {
        loadingOverlay.style.opacity = 0;
    };

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

            return {
                id,
                ...pokeDetails
            };
    
            // console.log("TYPE POKE", pokeDetails.types[id].type.name)

        } catch (err) {
            console.log(err.message)

        } finally {
            //nada ainda
        }
    }

    async function getPokeInfos() {

        try {
            showLoading()

            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=251")

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)

            const dataResponse = await response.json();
    
            // console.log( "FETCH TODOS POKÉMONS", dataResponse);

            getPokeDetails(dataResponse.results[0].url)

        } catch (err) {
            console.log(err.message)
        } finally {
            hideLoading();
        }
    }

    getPokeInfos()
})

