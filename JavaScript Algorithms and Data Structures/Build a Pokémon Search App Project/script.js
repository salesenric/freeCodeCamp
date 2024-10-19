const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const pokemonName = document.getElementById('pokemon-name');
const pokemonId = document.getElementById('pokemon-id');
const pokemonWeight = document.getElementById('weight');
const pokemonHeight = document.getElementById('height');
const pokemonImage = document.getElementById('image');
const pokemonTypes = document.getElementById('types');
const pokemonHp = document.getElementById('hp');
const pokemonAttack = document.getElementById('attack');
const pokemonDefense = document.getElementById('defense');
const pokemonSpecialAttack = document.getElementById('special-attack');
const pokemonSpecialDefense = document.getElementById('special-defense');
const pokemonSpeed = document.getElementById('speed');

async function fetchPokemonData(nameOrId) {
  try {
    
    const url = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${nameOrId}`;
    
    const response = await fetch(url);

    if (!response.ok) throw new Error("Pokémon not found!");

    const pokemonData = await response.json();
    
    //console.log(pokemonData);
    
    displayPokemonData(pokemonData);

  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    alert("Pokémon not found");
  }
}

function displayPokemonData(pokemon) {

  pokemonName.innerHTML = `<h2>${pokemon.name.toUpperCase()}</h2>`;
  pokemonId.innerHTML = `#${pokemon.id}`;
  pokemonWeight.innerHTML = `${pokemon.weight}`;
  pokemonHeight.innerHTML = `${pokemon.height}`;
  pokemonImage.innerHTML = `<img id="sprite" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;
  pokemonTypes.innerHTML="";
  pokemon.types.forEach((t) => pokemonTypes.innerHTML +=`<p>${t.type.name.toUpperCase()}</p>`);
  pokemonHp.innerHTML = `${pokemon.stats.find(stat => stat.stat.name === "hp").base_stat}`;
  pokemonAttack.innerHTML = `${pokemon.stats.find(stat => stat.stat.name === "attack").base_stat}`;
  pokemonDefense.innerHTML = `${pokemon.stats.find(stat => stat.stat.name === "defense").base_stat}`;
  pokemonSpecialAttack.innerHTML = `${pokemon.stats.find(stat => stat.stat.name === "special-attack").base_stat}`;
  pokemonSpecialDefense.innerHTML = `${pokemon.stats.find(stat => stat.stat.name === "special-defense").base_stat}`;
  pokemonSpeed.innerHTML = `${pokemon.stats.find(stat => stat.stat.name === "speed").base_stat}`;

}

searchButton.addEventListener('click', () => {

  const nameOrId = searchInput.value.trim().toLowerCase();
  
  fetchPokemonData(nameOrId);

});
