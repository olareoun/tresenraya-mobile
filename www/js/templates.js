(function(ns){
    ns = ns || {};
    ns.templates = ns.templates || {};
    
    ns.templates.laneContainer = ''
    ns.templates.laneContainer += '<div class="lane-container">';
    ns.templates.laneContainer += '</div>';
    ns.templates.user = '<span class="badge"></span>'
    ns.templates.count = '<span class="badge badge-times">0</span>'
    ns.templates.lane = '';
    ns.templates.lane += '<div class="progress">';
    ns.templates.lane += '<div class="progress-bar random-progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0"   aria-valuemax="100">';
    ns.templates.lane += '<span class="sr-only"></span>';
    ns.templates.lane += '</div><span class="choice-name"></span>';
    ns.templates.lane += '</div>';

    ns.templates.casilla = '';
    ns.templates.casilla += '<div class="casilla"></div>';

    return ns;
}(APP));



