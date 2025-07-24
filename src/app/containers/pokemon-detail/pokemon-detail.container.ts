import { Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Pokedex } from 'pokeapi-js-wrapper';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'services/pokemon.service';
import { TabComponent } from 'components/tab/tab.component';
import { PokemonAdapterService } from 'services/adapter.service';

const pokedex = new Pokedex();

export enum Tabs {
    ABILITIES = 'abilities',
    TYPES = 'types',
    STATS = 'stats'
}

@Component({
    selector: 'app-pokemon-detail',
    imports: [PokemonInfoComponent, TabComponent],
    template: `
        @let pokemon = pokemonService.pokemonResource.value();

        <div class="w-full bg-black text-white h-60 p-2 rounded-md shadow-inner">
            @if (currentPokemonInfo.data(); as pokemonInfo) {
                <app-pokemon-info [pokemonInfo]="adapterService.adaptFromApiResponse(pokemonInfo)" />
            }
        </div>

        <div class="flex flex-row *:flex-auto gap-2">
            @for(tab of tabOptions; track tab.label) {
                <app-tab [tabName]="tab.label" (tabClickedEvent)="loadTab(tab.value)"/>
            }
        </div>

        <div class="grow bg-white p-4 rounded-md shadow-inner text-gray-800">
        @if(pokemon) {
            @if (showAbilities) {
                <div class="space-y-2">
                    <div class="text-lg font-semibold">Abilities</div>
                    <div class="max-h-60 overflow-y-auto space-y-1">
                        @for (ability of pokemon.abilities; track ability.ability.name) {
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
                        @for (type of pokemon.types; track type.type.name) {
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
                        @for (stat of pokemon.stats; track stat.stat.name) {
                            <div class="p-3 border rounded bg-gray-100">
                                <div><span class="font-medium">Name:</span> {{ stat.stat.name }}</div>
                                <div><span class="font-medium">Base Stat:</span> {{ stat.base_stat }}</div>
                            </div>
                        }
                    </div>
                </div>
            }
        }
        </div>
    `,
})
export class PokemonDetailContainer {
    private readonly route = inject(ActivatedRoute);
    protected readonly pokemonService = inject(PokemonService);
    protected readonly adapterService = inject(PokemonAdapterService)

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

    protected showAbilities = true;
    protected showType = false;
    protected showStats = false;

    protected readonly tabs = Tabs;
    protected readonly tabOptions = [
        { label: 'Abilities', value: Tabs.ABILITIES },
        { label: 'Types', value: Tabs.TYPES },
        { label: 'Stats', value: Tabs.STATS }
      ];

    constructor() {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20');
    }

    public loadTab(tabName: string): void {
        this.showAbilities = false;
        this.showType = false;
        this.showStats = false;

        switch (tabName.toLowerCase()) {
            case Tabs.ABILITIES:
                this.showAbilities = true;
                break;
            case Tabs.TYPES:
                this.showType = true;
                break;
            case Tabs.STATS:
                this.showStats = true;
                break;
            default:
                this.showAbilities = true;
                break;
        }
    }
}
