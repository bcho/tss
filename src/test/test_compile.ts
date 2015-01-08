/// <reference path="./_ref.d.ts" />

import tss = require('../tss');
import should = require('should');
import tsc = require('typescript-compiler');

describe('compile', () => {
    var compiled: string = tss.compile('test', [__filename]);

    it('should compile to string', () => {
        should(compiled).be.a.String;
    });

    it('should be able to compile as typescript', () => {
        var compiler = () => {
            tsc.compileString(compiled, '', null, (e) => {
                throw new Error('compile failed');
            });
        };

        compiler.should.not.throw();
    });
});
