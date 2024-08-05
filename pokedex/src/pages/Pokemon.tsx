// @ts-nocheck

import { useCallback, useEffect, useState } from "react";
import Wrapper from "../sections/Wrapper";
import { useParams } from "react-router-dom";
import { defaultImages, images } from "../utils";
import { extractColors } from "extract-colors";
import axios from "axios";
import Evolution from "./Pokemon/Evolution";
import Locations from "./Pokemon/Locations";
import CapableMoves from "./Pokemon/CapableMoves";
import Description from "./Pokemon/Description";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCurrentPokemon } from "../app/slices/PokemonSlice";
import { setPokemonTab } from "../app/slices/AppSlice";
import Loader from "../components/Loader";
import {
  pokemonRoute,
  pokemonSpeciesRoute,
  pokemonTabs,
} from "../utils/constants";

function Pokemon() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const currentPokemonTab = useAppSelector(
    ({ app: { currentPokemonTab } }) => currentPokemonTab
  );
  const currentPokemon = useAppSelector(
    ({ pokemon: { currentPokemon } }) => currentPokemon
  );

  useEffect(() => {
    dispatch(setPokemonTab(pokemonTabs.description));
  }, [dispatch]);

  const getRecursiveEvolution = useCallback(
    (evolutionChain, level, evolutionData) => {
      if (!evolutionChain.evolves_to.length) {
        return evolutionData.push({
          pokemon: {
            ...evolutionChain.species,
            url: evolutionChain.species.url.replace(
              "pokemon-species",
              "pokemon"
            ),
          },
          level,
        });
      }
      evolutionData.push({
        pokemon: {
          ...evolutionChain.species,
          url: evolutionChain.species.url.replace("pokemon-species", "pokemon"),
        },
        level,
      });
      return getRecursiveEvolution(
        evolutionChain.evolves_to[0],
        level + 1,
        evolutionData
      );
    },
    []
  );

  const getEvolutionData = useCallback(
    (evolutionChain) => {
      const evolutionData = [];
      getRecursiveEvolution(evolutionChain, 1, evolutionData);
      return evolutionData;
    },
    [getRecursiveEvolution]
  );

  const [isDataLoading, setIsDataLoading] = useState(true);
  const getPokemonInfo = useCallback(
    async (image) => {
      try {
        const { data } = await axios.get(`${pokemonRoute}/${params.id}`);
        console.log('Datos del Pokémon:', data);
  
        const { data: dataEncounters } = await axios.get(data.location_area_encounters);
        console.log('Datos de encuentros:', dataEncounters);
  
        const { data: { evolution_chain: { url: evolutionURL } } } = await axios.get(`${pokemonSpeciesRoute}/${data.id}`);
        const { data: evolutionData } = await axios.get(evolutionURL);
        console.log('Datos de evolución:', evolutionData);
  
        const pokemonAbilities = {
          abilities: data.abilities.map(({ ability }) => ability.name),
          moves: data.moves.map(({ move }) => move.name),
        };
  
        const encounters = [];
        const evolution = getEvolutionData(evolutionData.chain);
  
        let evolutionLevel;
        const evolutionDataFound = evolution.find(({ pokemon }) => pokemon.name === data.name);
        if (evolutionDataFound) {
          evolutionLevel = evolutionDataFound.level;
        } else {
          console.warn('Evolución no encontrada para el Pokémon:', data.name);
          evolutionLevel = 'unknown'; // o cualquier valor por defecto que prefieras
        }
  
        dataEncounters.forEach((encounter) => {
          encounters.push(encounter.location_area.name.toUpperCase().split("-").join(" "));
        });
  
        const stats = data.stats.map(({ stat, base_stat }) => ({
          name: stat.name,
          value: base_stat,
        }));
  
        dispatch(
          setCurrentPokemon({
            id: data.id,
            name: data.name,
            types: data.types.map(({ type: { name } }) => name),
            image,
            stats,
            encounters,
            evolutionLevel,
            evolution,
            pokemonAbilities,
          })
        );
        setIsDataLoading(false);
      } catch (error) {
        console.error('Error al obtener la información del Pokémon:', error);
      }
    },
    [params.id, dispatch, getEvolutionData]
  );

  useEffect(() => {
    const imageElemet = document.createElement("img");
    imageElemet.src = images[params.id];
    const options = {
      pixels: 10000,
      distance: 1,
      splitPower: 10,
      colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
      saturationDistance: 0.2,
      lightnessDistance: 0.2,
      hueDistance: 0.083333333,
    };
    const getColor = async () => {
      const color = await extractColors(imageElemet.src, options);
      const root = document.documentElement;
      root.style.setProperty("--accent-color", color[0].hex.split('"')[0]);
    };
    getColor();
    let image = images[params.id];
    if (!image) {
      image = defaultImages[params.id];
    }

    getPokemonInfo(image);
  }, [params.id, getPokemonInfo]);

  return (
    <>
      {!isDataLoading && currentPokemon ? (
        <>
          {currentPokemonTab === pokemonTabs.description && <Description />}
          {currentPokemonTab === pokemonTabs.evolution && <Evolution />}
          {currentPokemonTab === pokemonTabs.locations && <Locations />}
          {currentPokemonTab === pokemonTabs.moves && <CapableMoves />}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Wrapper(Pokemon);