(function(ns){

    ns = ns || {};
    ns.widgets = ns.widgets || {};

    ns.widgets.Messages = function(element){
        var _container = element;

        var _addMessage = function(msg, kind) {
            var message = $('<div class="alert">');
            message.addClass("alert-" + kind);
            message.html(msg);
            $('#messages-container').html("");
            $('#messages-container').append(message);
        };

        return {
            addMessage: _addMessage
        }

    };

    ns.widgets.Tablero = function(element, gameId){

        var tablero = element;
        var _casillaClickedCallbacks = [];
        var _winnerCallbacks = [];
        var _looserCallbacks = [];

        var _restart = function(){
            tablero.find('.casilla').each(function(){
                $(this).removeClass('casilla-checked');
                $(this).removeClass('red');
                $(this).removeClass('green');
            });
        };

        var _disable = function(){
            tablero.find('.casilla').each(function(){
                $(this).off('click');
            });
         };

        var _enable = function(){
            tablero.find('.casilla').each(function(){
                if (!$(this).hasClass('casilla-checked')){
                    $(this).off('click');
                    $(this).on('click', _clickHandler);
                };
            });
        };

        var _clickHandler = function(ev){
            _disable();
            $(this).addClass('casilla-checked');
            $(this).addClass('green');
            _casillaClickedEvent($(this).attr('id'));
            if (_hasWinner()){
                _winnerEvent();
                _restart();
            };
            ev.stopPropagation();
            return false;
        };

        var _casillaClickedEvent = function(casillaId){
            _casillaClickedCallbacks.forEach(function(callback){
                var msg = {"key": "play", "gameId": gameId, "casilla": casillaId};
                callback(JSON.stringify(msg));
            });
        };

        var _casillaChecked = function(casillaId){
            tablero.find('#' + casillaId).addClass('casilla-checked');
            tablero.find('#' + casillaId).addClass('red');
            if (_hasWinner()){
                _looserEvent();
                _restart();
            } else {
                _enable();
            }
        };

        var winnerLines = [
            ['a', 'b', 'c'], ['a', 'd', 'g'], ['a', 'e', 'i'], 
            ['b', 'e', 'h'], ['c', 'f', 'i'], ['c', 'e', 'g'], 
            ['d', 'e', 'f'], ['g', 'h', 'i']
        ];

        var _hasWinner = function(){
            return winnerLines.reduce(function(previous, current){
                return previous || _checkChecked(current);
            }, false);
        };

        var _winnerEvent = function(){
            _winnerCallbacks.forEach(function(callback){
                callback();
            });
        };

        var _looserEvent = function(){
            _looserCallbacks.forEach(function(callback){
                callback();
            });
        };

        var _checkChecked = function(casillas){
            return _checkCheckedColor(casillas, 'red') || _checkCheckedColor(casillas, 'green');
        };

        var _checkCheckedColor = function(casillas, color){
            var checked = casillas.reduce(function(previous, current){
                return previous && tablero.find('#' + current).hasClass('casilla-checked') && tablero.find('#' + current).hasClass(color);
            }, true);
            return checked;
        };

        return {
            enable: _enable,
            disable: _disable,
            restart: _restart,
            casillaChecked: _casillaChecked,
            onCasillaClicked: function(callback){
                _casillaClickedCallbacks.push(callback);
            },
            onWinner: function(callback){
                _winnerCallbacks.push(callback);
            },
            onLooser: function(callback){
                _looserCallbacks.push(callback);
            }
        }

    };

    return ns;
}(APP));