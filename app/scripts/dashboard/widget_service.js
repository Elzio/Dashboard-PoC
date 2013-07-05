var mod = angular.module('o-dashboard');

mod.service('widgetService', [
    function() {

        var data = [
            {   title:'Widget #1',
                grid: { row:1, col:1, sizex:3, sizey:3}
            }
        ,
            {   title:'Widget #2',
                grid: { row:1, col:4, sizex:2, sizey:3}
            }
        ,
            {   title:'Widget #3',
                grid: { row:1, col:1, sizex:3, sizey:2}
            }
        ,
            {   title:'Widget #4',
                grid: { row:3, col:3, sizex:2, sizey:4}
            }
        ,
            {   title:'Widget #5',
                grid: { row:4, col:10, sizex:1, sizey:1}
            }
        ];

        this.getWidgets = function() {
            console.log( 'widget service: getwigets', data );
            return data;
        };

        this.removeWidget = function ( id ) {
            console.log( 'widget service: removing widget id: ', id );
        };

        this.addWidget = function (widget) {
            console.log( 'widget service: adding widget', widget );
            data.push(widget);
        }

    }
]);
