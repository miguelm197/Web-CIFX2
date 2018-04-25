var app = angular.module("myApp", ['ngRoute', 'ngCookies', 'angular-md5', 'angular-carousel', 'ngTouch', 'ngFileUpload']);

/*ENRUTAMIENTO*/
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'src/login/login.html',
            controller: 'loginCtrl'
        })
        .when('/home', {
            templateUrl: 'src/home/home.html',
            controller: 'homeCtrl'
        })
        .when('/configuracion', {
            templateUrl: 'src/configuracion/configuracion.html',
            controller: 'configuracionCtrl'
        })
        .when('/nuevoProducto', {
            templateUrl: 'src/nuevoProducto/nuevoProducto.html',
            controller: 'nuevoProductoCtrl'
        })
        .when('/listaProductos', {
            templateUrl: 'src/listaProductos/listaProductos.html',
            controller: 'listaProductosCtrl'
        })
        .when('/listaUsuarios', {
            templateUrl: 'src/listaUsuarios/listaUsuarios.html',
            controller: 'listaUsuariosCtrl'
        })
        .when('/usuario/:id', {
            templateUrl: 'src/usuario/usuario.html',
            controller: 'usuarioCtrl'
        })
        .when('/producto/:id', {
            templateUrl: 'src/producto/producto.html',
            controller: 'productoCtrl'
        })
        .when('/productos', {
            templateUrl: 'src/productos/productos.html',
            controller: 'productosCtrl'
        })
        .when('/parametros', {
            templateUrl: 'src/parametros/parametros.html',
            controller: 'parametrosCtrl'
        })
        .when('/403', {
            templateUrl: 'src/vistas/403.html',
        })
        .when('/404', {
            templateUrl: 'src/vistas/404.html',
        })

        .otherwise({ redirectTo: "/home" });
});


//Autenticacaion
app.run(['$rootScope', '$location', '$cookies', '$http', function ($rootScope, $location, $cookies, $http) {

    var urlServices = "http://localhost";
    var portServices = 3000;

    app.config['urlServicios'] = urlServices + ":" + portServices;

    // mantenerse logueado luego de resfrescar la pagina
    $rootScope.globals = $cookies.getObject('globals') || false;//Obtengo los valore de las cookies si hay

    // $rootScope.globals = $rootScope.globals ? $rootScope.globals.currentUser : false;


    if ($rootScope.globals) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.sape = "aa"
    $rootScope.alerta = {
        mostrar: false,
        tipo: "",
        titulo: "",
        texto: "",
        mensaje: function (tipo, titulo, texto) {
            $rootScope.alerta.tipo = tipo;
            $rootScope.alerta.titulo = titulo;
            $rootScope.alerta.texto = texto;
            $rootScope.alerta.mostrar = true;
        }
    };




    //Verifica cada vez que cambia la url (queda escuchando)
    $rootScope.$on('$locationChangeStart', function (event, next, current) {


        var loggedIn = $rootScope.globals ? $rootScope.globals.currentUser : false;
        if (loggedIn) {
            var rolUsuario = loggedIn.rolUsuario;

            //Páginas en las cuales NO puede entrar el rol
            var paginasPublic = ['/nuevaTarea', '/parametros', '/nuevoProducto', '/listaProductos', '/listaUsuarios', '/configuracion','/login'];
            var paginasAdmins = ['/login'];
            var paginas = [""];

            if (rolUsuario == "admin")
                paginas = paginasAdmins;

            if (rolUsuario == "public")
                paginas = paginasPublic;

            var pag = $location.path();
            var restrictedPage = paginas.indexOf(pag) == -1 ? true : false;



            if (($location.path().indexOf("usuario") != -1) && (rolUsuario == "public")) {
                var miId = loggedIn.id;
                var idUrl = $location.path().split("/")[2];
                if (miId != idUrl)
                    restrictedPage = false;
            }

            if (!restrictedPage) {
                $location.path('/403');
            }




         


        } else {


            //Páginas que puede entrar un usuario sin estar logueado
            var paginas = ['/login', '/home', '/productos', '/404', '/'];
            // var restrictedPage = $.inArray($location.path(), ) === -1;

            var restrictedPage = false;
            if ($location.path().indexOf("/producto/") != -1) {
                restrictedPage = true;
            } else {
                restrictedPage = paginas.indexOf($location.path()) != -1 ? true : false;
            }


            if (!restrictedPage) {
                $location.path('/403');
            }
        }


        var currPag = $location.path();
        // páginas donde no se tiene que mostrar el usuario buscador xel nav
        var pags = ["/configuracion", "/nuevoProducto", "/parametros", '/usuario', "/listaProductos", "/listaUsuarios", "/usuario"];
        if (pags.indexOf(currPag) != -1 || currPag.indexOf("/usuario") != -1) {
            $rootScope.buscador = {
                visible: true
            }
        } else {
            $rootScope.buscador = {
                visible: false
            }
        }
    });

}]);
