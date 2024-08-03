// @ts-nocheck

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { defaultImages, images, pokemonTypes } from "../../utils";
import { generatedPokemonType, genericPokemonType, pokemonTypeInterface } from "../../utils/types";

export const getPokemonsData = createAsyncThunk(
  "pokemon/randomPokemon",
  async (pokemons: genericPokemonType[]) => {
    try {
      const pokemonsData: generatedPokemonType[] = [];
      for await (const pokemon of pokemons) {
        const { data }: { data: { id: number; types: { type: { name: string } }[] } } = await axios.get(pokemon.url);
        
        const types: pokemonTypeInterface[] = data.types.map(
          ({ type: { name } }) => ({
            [name]: pokemonTypes[name] || { image: '', strength: [], weakness: [], resistance: [], vulnerable: [] }
          })
        );
        

        let image: string = images[data.id];
        if (!image) {
          image = defaultImages[data.id];
        }
        if (image) {
          pokemonsData.push({
            name: pokemon.name,
            id: data.id,
            image,
            types,
          });
        }
      }
      console.log(pokemonsData); // Verificar los datos en la consola
      return pokemonsData;
    } catch (err) {
      console.error(err);
    }
  }
);
