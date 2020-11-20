import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-porter';

export default [
    {
        input: 'example/main.js',        
        output: { 
            file: 'public/main.js',
            format: 'iife',
            sourcemap: true,
            name: 'Admin',
        },
        plugins: [                      
            resolve({
                customResolveOptions: {
                    moduleDirectory: ['node_modules', 'src']
                },
            }),
            commonjs(),            
            css({dest: 'public/main.css', minified: false}),            
            babel({                
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['example/**', 'src/**']
            }),
        ],
    },    
    {
        input: 'src/index.js',
        output: { 
            file: 'dist/forestry-admin.js',
            format: 'cjs',            
            sourcemap: true,            
        },        
        plugins: [            
            resolve({
                customResolveOptions: {
                    moduleDirectory: ['node_modules', 'src']
                },                
            }),
            commonjs(),
            css({dest: 'dist/forestry-admin.css', minified: false}),            
            babel({                
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['src/**', 'node_modules/**']
            }),
        ],
    },    
];