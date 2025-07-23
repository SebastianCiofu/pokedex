import { Component, inject } from '@angular/core';

import { PokemonService } from 'services/pokemon.service';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';

// TODO: replace this with a real API call
// TODO: implement "fetch next page" so we can get more than 20 pokemons
@Component({
    selector: 'app-all-pokemon-list',
    imports: [PokemonListComponent],
    template: `        
    @if (pokemonService.pokemonListResource.value(); as pokemonData) {
        <app-pokemon-list [pokemonList]="pokemonData.results" />
    } @else {
        <p>Loading data...</p>
    }
`,
})
export class AllPokemonListContainer {
    protected readonly pokemonService = inject(PokemonService)
}

