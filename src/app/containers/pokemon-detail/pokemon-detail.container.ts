import { Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Pokedex } from 'pokeapi-js-wrapper';
import { Pokemon } from 'types/pokemon.type';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'services/pokemon.service';

const pokedex = new Pokedex();

@Component({
    selector: 'app-pokemon-detail',
    imports: [PokemonInfoComponent],
    template: `
        <div class="w-full bg-black text-white h-60 p-2 rounded-md shadow-inner">
            @if (currentPokemonInfo.data(); as pokemonInfo) {
                <app-pokemon-info [pokemonInfo]="pokemonInfo" />
            }
        </div>

        <div class="flex flex-row *:flex-auto gap-2">
            <button class="bg-cyan-300 p-2 rounded-md" (click)="loadAbilities()">Abilities</button>
            <button class="bg-cyan-300 p-2 rounded-md" (click)="loadType()">Types</button>
            <button class="bg-cyan-300 p-2 rounded-md" (click)="loadY()">Y</button>
        </div>

        <div class="grow bg-white p-4 rounded-md shadow-inner text-gray-800">
            @if (showAbilities) {
                <div class="space-y-2">
                    <div class="text-lg font-semibold">Abilities</div>
                    <div class="max-h-60 overflow-y-auto space-y-1">
                        @for (ability of pokemonService.pokemonResource.value().abilities; track ability.ability.name) {
                            <div class="px-3 py-1 bg-cyan-100 rounded shadow text-sm">
                                {{ ability.ability.name }}
                            </div>
                        }
                    </div>
                </div>
            }

            @else if (showType) {
                <div class="space-y-2">
                    <div class="text-lg font-semibold">Types</div>
                    <div class="max-h-60 overflow-y-auto space-y-1">
                        @for (type of pokemonService.pokemonResource.value().types; track type.type.name) {
                            <div class="px-3 py-1 bg-purple-100 rounded shadow text-sm">
                                {{ type.type.name }}
                            </div>
                        }
                    </div>
                </div>
            }

            @else if (showStats) {
                <div class="space-y-2">
                    <div class="text-lg font-semibold">Stats</div>
                    <div class="max-h-60 overflow-y-auto space-y-2">
                        @for (stat of pokemonService.pokemonResource.value().stats; track stat.stat.name) {
                            <div class="p-3 border rounded bg-gray-100">
                                <div><span class="font-medium">Name:</span> {{ stat.stat.name }}</div>
                                <div><span class="font-medium">Base Stat:</span> {{ stat.base_stat }}</div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    `,
})
export class PokemonDetailContainer {
    private readonly route = inject(ActivatedRoute);
    protected readonly pokemonService = inject(PokemonService);

    readonly pokemonId = toSignal(this.route.paramMap.pipe(map((params) => params.get('pokemonId') ?? 'bulbasaur')), {
        initialValue: 'bulbasaur',
    });

    readonly currentPokemonInfo = injectQuery(() => ({
        queryKey: ['pokemon', this.pokemonId()],
        queryFn: () => {
            this.pokemonService.name.set(this.pokemonId());

            return pokedex.getPokemonByName(this.pokemonId());
        },
    }));

    showAbilities = true;
    showType = false;
    showStats = false;

    constructor() {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20');
    }

    loadAbilities(): void {
        this.showAbilities = true;
        this.showType = false;
        this.showStats = false;
    }

    loadType(): void {
        this.showAbilities = false;
        this.showType = true;
        this.showStats = false;
    }

    loadY(): void {
        this.showAbilities = false;
        this.showType = false;
        this.showStats = true;
    }
}
