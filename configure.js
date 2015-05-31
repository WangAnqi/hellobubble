var route = require('./route');
route.map({
    method:'get',
    url: /\/blog\/?$/i,
    controller: 'blog',
    action: 'index'
});