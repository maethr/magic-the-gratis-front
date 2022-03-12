/**
 * Api documentation:
 * https://scryfall.com/docs/api/cards/search
 */
export class SearchParams {

    /* Global configuration */
    static readonly format = 'json';
    static readonly pretty = 'true';

    /**
     * The strategy for omitting similar cards.
     * Options: cards, art, print.
     */
    unique?: string = 'cards';
    static readonly unique_values = ['cards', 'art', 'prints'];

    /**
     * The method to sort returned cards.
     * Options: name, set, released, rarity, color, usd, tix,
     *  eur, cmc, power, toughness, edhrec, artist, review     
     */
    order?: string = 'name';
    static readonly order_values = ['name', 'set', 'released', 'rarity', 'color', 'usd', 'tix',
        'eur', 'cmc', 'power', 'toughness', 'edhrec', 'artist', 'review'];

    /**
     * The direction to sort cards.
     * Options: asc, desc, auto
     */
    dir?: string = 'auto';
    static readonly dir_values = ['asc', 'desc', 'auto'];

    /**
     * If true, extra cards (tokens, planes, etc) will be included.
     * Equivalent to adding include:extras to the fulltext search.
     * Defaults to false.
     */
    include_extras?: boolean = false;

    /**
     * If true, cards in every language supported by Scryfall will be included.
     * Defaults to false.
     */
    include_multilingual?: boolean = false;

    /**
     * If true, rare care variants will be included, like the Hairy Runesword.
     * Defaults to false.
     */
    include_variations?: boolean = false;

    /**
     * The page number to return, default 1.
     */
    page?: number = 1;
}