var mod = angular.module('o-dashboard');

mod.service('widgetService', [
    function() {

        var data = [
            {   title:'Widget #1',
                grid: { row:1, col:1, sizex:3, sizey:2},
                templateUrl: 'templates/tpl1.html'

            }
        ,
            {   title:'Widget #2',
                grid: { row:1, col:1, sizex:3, sizey:2},
                templateUrl: 'templates/tpl1.html'
            }
        ,
            {   title:'Widget #3',
                grid: { row:1, col:1, sizex:3, sizey:2},
                templateUrl: 'templates/tpl1.html'
            }
        ,
            {   title:'Widget #4',
                grid: { row:1, col:1, sizex:2, sizey:4},
                templateUrl: 'templates/tpl1.html'
            }
        ,
            {   title:'Widget #5',
                grid: { row:3, col:1, sizex:4, sizey:2}
            }
        ,
            {   title:'Widget #6',
                grid: { row:3, col:1, sizex:4, sizey:2}
            }
        ,
            {   title:'Widget #7',
                grid: { row:4, col:1, sizex:4, sizey:2}
            }
        ,
            {   title:'Widget #8',
                grid: { row:6, col:1, sizex:2, sizey:2}
            }
        ,
            {   title:'Widget #9',
                grid: { row:6, col:1, sizex:2, sizey:2}
            }
        ,
            {   title:'Widget #10',
                grid: { row:6, col:1, sizex:2, sizey:2}
            }
        ];

        this.getWidgets = function() {
            console.log( 'widget service: getwigets', data );
            return data;
        };

        this.removeWidget = function ( widget ) {
            var idx = data.indexOf(widget);
            data.splice(idx, 1);
        };

        this.addWidget = function ( widget ) {
            data.push(widget);
        }

    }
]);
