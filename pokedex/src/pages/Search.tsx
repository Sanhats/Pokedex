// @ts-nocheck

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
  const handleChange = debounce((value: string) => getPokemon(value), 300);
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
  

  const getPokemon = async (value: string) => {
    if (value.length) {
      let pokemons;
      if (searchType === "name") {
        pokemons = allPokemon.filter((pokemon) =>
          pokemon.name.includes(value.toLowerCase())
        );
      } else if (searchType === "type") {
        pokemons = allPokemon.filter(
          (pokemon) =>
            pokemon.types &&
            pokemon.types.some((type) =>
              type.type.name.includes(value.toLowerCase())
            )
        );
      }
      console.log("Filtered Pokemons:", pokemons); // Verificar el resultado del filtrado
      dispatch(getPokemonsData(pokemons));
    } else {
      const clonedPokemons = [...allPokemon];
      const randomPokemonsId = clonedPokemons
        .sort(() => Math.random() - Math.random())
        .slice(0, 50);
      dispatch(getPokemonsData(randomPokemonsId));
    }
  };
  
  

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
              placeholder={`Search Pokemon by ${searchType}`}
            />
          </div>
          <PokemonCardGrid pokemons={randomPokemons} />
        </div>
      )}
    </>
  );
}

export default Wrapper(Search);
