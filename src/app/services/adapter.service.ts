import { Injectable } from '@angular/core';
import { Pokemon as PokemonApiResponse } from 'pokeapi-js-wrapper';
import { Pokemon } from '../types/pokemon.type';

@Injectable({
  providedIn: 'root'
})
export class PokemonAdapterService {
  
  adaptFromApiResponse(apiResponse: PokemonApiResponse): Pokemon {
    return {
      id: String(apiResponse.id),
      name: apiResponse.name,
      height: apiResponse.height,
      weight: apiResponse.weight,
      types: apiResponse.types.map(t => ({
        slot: t.slot,
        type: {
          name: t.type.name,
          url: t.type.url
        }
      })),
      sprites: {
        front_default: apiResponse.sprites.front_default,
      },
      stats: apiResponse.stats.map(t => ({
        base_stat: t.base_stat,
        stat: {
          name: t.stat.name,
          url: t.stat.url
        }
      })),
      abilities: apiResponse.abilities.map(t => ({
        is_hidden: t.is_hidden,
        slot: t.slot,
        ability: {
          name: t.ability.name,
          url: t.ability.url
        }
      })),
    };
  }
}
