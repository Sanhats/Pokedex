import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pokemonsRoute } from "../../utils/constants";

interface Pokemon {
  name: string;
  url: string;
}

export const getInitialPokemonData = createAsyncThunk(
  "pokemon/initialData",
  async () => {
    try {
      const { data } = await axios.get(pokemonsRoute);
      const formattedData = data.results.map((pokemon: Pokemon) => ({
        name: pokemon.name,
        url: pokemon.url
      }));
      return formattedData;
    } catch (err) {
      console.error(err);
    }
  }
);
