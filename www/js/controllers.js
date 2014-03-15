(function(ns){

    ns = ns || {};
    ns.controllers = ns.controllers || {};

    ns.controllers.AppCtrl = function(){

        var _gameId;

        var tablero;

        var messages = new APP.widgets.Messages($('#messages-container'));

        var socket, host;
        host = "wss://agile-island-2511.herokuapp.com/";

        var _connect = function() {
            try {
                socket = new WebSocket(host);

                socket.onopen = function() {
                    // messages.addMessage("Socket Status: " + socket.readyState + " (open)", 'info');
                };

                socket.onclose = function() {
                    // messages.addMessage("Desconectado", 'info');
                };

                socket.onmessage = function(msg) {
                    var data = JSON.parse(msg.data);
                    console.log(data);
                    if (data["key"] == "game-id-response") {
                        messages.addMessage("Esperando contrincante...", 'info');
                        _initTablero(data["gameId"]);
                        _disableRequestGame();
                        return;
                    }
                    if (data["key"] == "play"){
                        tablero.casillaChecked(data["casilla"]);
                        return;
                    }
                    if (data["key"] == "start-game"){
                        messages.addMessage("A jugar!!", 'success');
                        tablero.enable();
                        return;
                    }
                    if (data["key"] == "halt-game"){
                        messages.addMessage("El otro jugador se desconectó", 'warning');
                        _enableRequestGame();
                        tablero.restart();
                        tablero.disable();
                        return;
                    }
                };
            } catch(exception) {
                messages.addMessage("Error: " + exception, 'danger');
            }
        };

        _connect();
        $('#connect').hide();

        var _disableRequestGame = function(){
            $("#request-game").hide();
        };

        var _enableRequestGame = function(){
            $("#request-game").show();
        };

        var _initTablero = function(gameId){
            tablero = new APP.widgets.Tablero($('#tablero-container'), gameId);
            tablero.onCasillaClicked(_send);
            tablero.onWinner(function(){
                messages.addMessage("Has ganado!!", 'success');
            });
            tablero.onLooser(function(){
                messages.addMessage("Has perdido!!", 'warning');
            });
        };

        var _send = function(msg) {
            try {
                socket.send(msg);
            } catch(exception) {
                messages.addMessage("Failed To Send", 'danger');
            }
        };

        $("#disconnect").click(function(event) {
            $('#connect').show();
            $('#disconnect').hide();
            messages.addMessage("Te has desconectado.", "warning");
            socket.close();
            event.stopPropagation();
            return false;
        });

        $('#connect').on('click', function(){
            $('#disconnect').show();
            _connect();
        });

        $("#request-game").click(function(event) {
            _send(JSON.stringify({"key": "request-game"}));
            event.stopPropagation();
            return false;
        });

    };

    return ns;

}(APP));