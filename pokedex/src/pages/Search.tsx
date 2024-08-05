import React, { useEffect, useState } from "react";
import Wrapper from "../sections/Wrapper";
import { debounce } from "../utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getInitialPokemonData } from "../app/reducers/getInitialPokemonData";
import { getPokemonsData } from "../app/reducers/getPokemonsData";
import Loader from "../components/Loader";
import { setLoading } from "../app/slices/AppSlice";
import PokemonCardGrid from "../components/PokemonCardGrid";

function Search() {
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const isLoading = useAppSelector(({ app: { isLoading } }) => isLoading);

  const dispatch = useAppDispatch();
  const { allPokemon, randomPokemons } = useAppSelector(
    ({ pokemon }) => pokemon
  );

  useEffect(() => {
    dispatch(getInitialPokemonData());
  }, [dispatch]);

  useEffect(() => {
    if (allPokemon) {
      const clonedPokemons = [...allPokemon];
      const randomPokemonsId = clonedPokemons
        .sort(() => Math.random() - Math.random())
        .slice(0, 20);
      dispatch(getPokemonsData(randomPokemonsId));
    }
  }, [allPokemon, dispatch]);

  useEffect(() => {
    if (randomPokemons) {
      console.log("Loaded Pokemons:", randomPokemons);
      dispatch(setLoading(false));
    }
  }, [randomPokemons, dispatch]);

  const fetchPokemonByType = async (type: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await response.json();
      const pokemonList = data.pokemon.map((p: any) => p.pokemon);
      return pokemonList;
    } catch (error) {
      console.error("Error fetching Pokémon by type:", error);
      return [];
    }
  };

  const getPokemon = async (value: string) => {
    setSearchValue(value);
    if (allPokemon && value.length) {
      let pokemons: any[] = [];
      if (searchType === "name") {
        pokemons = allPokemon.filter((pokemon) =>
          pokemon.name && pokemon.name.toLowerCase().includes(value.toLowerCase())
        );
      } else if (searchType === "type") {
        const typePokemons = await fetchPokemonByType(value.toLowerCase());
        pokemons = allPokemon.filter((pokemon) =>
          typePokemons.some((typePokemon: any) => typePokemon.name === pokemon.name)
        );
      }
      console.log("Filtered Pokemons:", pokemons); // Verificar el resultado del filtrado
      dispatch(getPokemonsData(pokemons));
    } else if (allPokemon) {
      const clonedPokemons = [...allPokemon];
      const randomPokemonsId = clonedPokemons
        .sort(() => Math.random() - Math.random())
        .slice(0, 50);
      dispatch(getPokemonsData(randomPokemonsId));
    }
  };

  const handleChange = debounce((value: string) => getPokemon(value), 300);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="search">
          <div className="search-options">
            <input
              type="text"
              onChange={(e) => handleChange(e.target.value)}
              className="pokemon-searchbar"
              placeholder="Buscar Pokemon por..."
              value={searchValue}
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type-selector"
            >
              <option value="name">Nombre</option>
              <option value="type">Tipo</option>
            </select>
          </div>
          <PokemonCardGrid pokemons={randomPokemons || []} />
        </div>
      )}
    </>
  );
}

export default Wrapper(Search);
