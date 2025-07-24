import { Component, inject } from '@angular/core';

import { PokemonService } from 'services/pokemon.service';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';

@Component({
    selector: 'app-all-pokemon-list',
    imports: [PokemonListComponent],
    template: `        
    @if (pokemonService.pokemonListResource.value(); as pokemonData) {
        <app-pokemon-list [pokemonList]="pokemonData.results" />
    }
`,
})
export class AllPokemonListContainer {
    protected readonly pokemonService = inject(PokemonService)
}

