
export class Endpoints {

    private static SERVER_URL = "http://localhost:8080";

    public static GET_ALBUM_BY_ID				= Endpoints.SERVER_URL + "/collector/album/n/{id}"
    public static GET_ALBUMS_FROM_USUARIO_PAGED	= Endpoints.SERVER_URL + "/collector/album/user/{user}"
    public static GET_ALL_ALBUMS_FROM_USUARIO	= Endpoints.SERVER_URL + "/collector/album/user/{user}/all"
    public static COUNT_ALBUMS_FROM_USUARIO		= Endpoints.SERVER_URL + "/collector/album/user/{user}/count"
    public static CREATE_ALBUM					= Endpoints.SERVER_URL + "/collector/album/"
    public static EDIT_ALBUM					= Endpoints.SERVER_URL + "/collector/album/n/{id}"
    public static DELETE_ALBUM					= Endpoints.SERVER_URL + "/collector/album/n/{id}"
    public static COUNT_CARTAS_ALBUM			= Endpoints.SERVER_URL + "/collector/album/n/{id}/count"

    public static GET_PAGINA_FROM_ALBUM		    = Endpoints.SERVER_URL + "/collector/cartas/album/{id}/{page}"
    public static GET_ALL_CARTAS_FROM_ALBUM	    = Endpoints.SERVER_URL + "/collector/cartas/album/{id}/all"
    public static PUT_CARTA_IN_ALBUM		    = Endpoints.SERVER_URL + "/collector/cartas/album/{id}"
    public static DELETE_CARTA				    = Endpoints.SERVER_URL + "/collector/cartas/n/{id}"
    public static GET_X_CARTAS_ALEATORIAS	    = Endpoints.SERVER_URL + "/collector/cartas/welcome/{x}"

}