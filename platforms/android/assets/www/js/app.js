var APP = {};

APP.init = function(){
    APP.appController = new APP.controllers.AppCtrl();
};

$(function() {
  APP.init();
});