APP.SPEED_DEFAULT = 250;

APP.generator = function(howMany){
	return {
		get: function(){
			return Math.floor((Math.random() * howMany) + 1) - 1
		} 
	}
};

var Randomizer = {};

Randomizer.create = function(howMany){
	var generator = APP.generator(howMany);
    var _limit = 50;
    var _count = 0;
	var times = [];
	var percents = [];
	var _random;

	var counter = 0;
	var listeners = [];
	var endListeners = [];

	var update = function(random){
		_random = random;
		times[random] = times[random] + 1;
		percents = percents.map(function(item, index){
			return times[index] * 100 / counter;
		});
		notify();
        if (_limitReached()){
        	notifyEnd();
        	_stop();
        	restart();
        };
	};

	var restart = function(){
		_count = 0;
		for (var i = howMany - 1; i >= 0; i--) {
			times[i] = 0;
			percents[i] = 0;
		};
	}

	var notifyEnd = function(){
		for (var i = endListeners.length - 1; i >= 0; i--) {
			endListeners[i](_random);
		};
	};

	var notify = function(){
		for (var i = listeners.length - 1; i >= 0; i--) {
			listeners[i](percents, times, _random);
		};
	};

    var _limitReached = function(){
        return _count >= _limit;
    };

    var _start = function(){
        APP.timer = setInterval(APP.randomizer.createRandom, APP.speed || APP.SPEED_DEFAULT);
    };

    var _stop = function(){
        clearInterval(APP.timer);
    };

    restart();

	return {
		getPercents: function(){
			return percents;
		},
		createRandom: function(){
			var random = generator.get();
			_count++;
			counter++;
			update(random);
		},
		onRandom: function(aListener){
			listeners.push(aListener);
		},
		onEnd: function(aListener){
			endListeners.push(aListener);
		},
		start: _start,
		stop: _stop
	};
};