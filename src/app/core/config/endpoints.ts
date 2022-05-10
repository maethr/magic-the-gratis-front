
export class Endpoints {

   public static GET_ALBUM_BY_ID				= "/collector/album/n/{id}"
   public static GET_ALBUMS_FROM_USUARIO_PAGED	= "/collector/album/user/{user}"
   public static GET_ALL_ALBUMS_FROM_USUARIO	= "/collector/album/user/{user}/all"
   public static COUNT_ALBUMS_FROM_USUARIO		= "/collector/album/user/{user}/count"
   public static CREATE_ALBUM					= "/collector/album/"
   public static EDIT_ALBUM						= "/collector/album/n/{id}"
   public static DELETE_ALBUM					= "/collector/album/n/{id}"
   public static COUNT_CARTAS_ALBUM				= "/collector/album/n/{id}/count"

    public static GET_PAGINA_FROM_ALBUM		    = "/collector/cartas/album/{id}/{page}"
    public static GET_ALL_CARTAS_FROM_ALBUM	    = "/collector/cartas/album/{id}/all"
    public static PUT_CARTA_IN_ALBUM		    = "/collector/cartas/album/{id}"
    public static DELETE_CARTA				    = "/collector/cartas/n/{id}"
    public static GET_X_CARTAS_ALEATORIAS	    = "/collector/cartas/welcome/{x}"
}