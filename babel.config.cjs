const presets = [
    [
        "@babel/env", {    
            "useBuiltIns": "usage",
            "corejs": {
                "version": "3.9.1",
                "proposals": false
            },
            "targets": "ie 10"
        }
    ]
];

const plugins = [];

module.exports = { presets, plugins };