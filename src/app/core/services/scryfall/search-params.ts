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
    unique?: string;

    /**
     * The method to sort returned cards.
     * Options: name, set, released, rarity, color, usd, tix,
     *  eur, cmc, power, toughness, edhrec, artist, review     
     */
    order?: string;

    /**
     * The direction to sort cards.
     * Options: asc, desc, auto
     */
    dir?: string;

    /**
     * If true, extra cards (tokens, planes, etc) will be included.
     * Equivalent to adding include:extras to the fulltext search.
     * Defaults to false.
     */
    include_extras?: boolean;

    /**
     * If true, cards in every language supported by Scryfall will be included.
     * Defaults to false.
     */
    include_multilingual?: boolean;

    /**
     * If true, rare care variants will be included, like the Hairy Runesword.
     * Defaults to false.
     */
    include_variations?: boolean;

    /**
     * The page number to return, default 1.
     */
    page?: number;
}