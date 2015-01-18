'use strict';

var request = require('request');
var Promise = require('es6-promise').Promise;

var actions = {
    'delete': 'del',
    'get': 'get',
    'post': 'create',
    'put': 'update'
};

var endpoints = [
    'get livetv/popularchannels',
    'get livetv/allowed_channels',
    'get livetv/suggested_channels',
    'get livetv/channel',
    'get livetv/streamurl'
];

function YouSee(options) {

    this.settings = {
        url: 'http://api.yousee.tv/rest/',
        headers : {
            'X-API-KEY':'HCN2BMuByjWnrBF4rUncEfFBMXDumku7nfT3CMnn'
        }
    };

    if (typeof options === 'object') {
        extend(this.settings, options);
    }

    initialize.call(this);
};

YouSee.prototype = {

    request: function (endpoint, method, data, headers) {

        return new Promise(function(resolve, reject) {

            var options = {
                url: this.settings.url + endpoint + '/json',
                method: method.toUpperCase(),
                headers: this.settings.headers,
                qs: data,
                json: true
            };

            if (typeof headers === 'object') {
                extend(options, headers);
            }

            return request(options, function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });

        }.bind(this));

    },

    setAuth: function(authData) {
        this.settings.auth = authData
    }

};

function initialize() {

    function createNestedObject(base, names, value) {
        var lastName = arguments.length === 3 ? names.pop() : false;
        for (var i = 0; i < names.length; i++) {
            base = base[names[i]] = base[names[i]] || {};
        }
        if (lastName) {
            base = base[lastName] = value;
        }
        return base;
    }

    function addMethod(route) {
        var parts = route.split(' ');
        var method = parts[0];
        var path = parts[1];
        var pathArr = parts[1].replace('/:id', '').split('/');
        pathArr.push(actions[method]);

        var fn = function () {
            var args = Array.prototype.slice.call(arguments);
            var endpoint = path;
            if (path.indexOf(':id') > -1) {
                endpoint = path.replace(':id', args[0]);
                args.shift();
            }
            return this.request(endpoint, method, args[0], args[1]);
        }.bind(this);

        createNestedObject(this, pathArr, fn);
    }

    for (var i = 0; i < endpoints.length; i += 1) {
        addMethod.call(this, endpoints[i]);
    }
}

function extend(target, obj) {
    for (var key in obj) {
        target[key] = obj[key];
    }
}

module.exports = YouSee;
