import { effect, Injectable, resource, signal } from '@angular/core';
import { SimplePokemon } from 'types/simple-pokemon.type';

export interface PokemonData {
  count: number;
  next: string;
  previous: string;
  results: SimplePokemon[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
   public readonly offset = signal(0);
   public readonly limit = signal(20);

   public name = signal('bulbasaur')

   public readonly pokemonListResource = resource({
    request: () => ({ offset: this.offset(), limit: this.limit() }),
    loader: async ({ request }) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${request.offset}&limit=${request.limit}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
      }

      const json = await response.json()

      console.log(json)

      return json;
    }
  });

   public readonly pokemonResource = resource({
    request: () => ({ name: this.name() }),
    loader: async ({ request }) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${request.name}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
      }

      const json = await response.json()

      console.log(json)

      return json;
    }
  });

  nextPage() {
    this.limit.update(current => current + 10);
  }
}
