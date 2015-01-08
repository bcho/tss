/// <reference path="../tss.ts" />
/// <reference path="../../typings/tsd.d.ts" />

// Simple type hinting for typescript-compiler.
declare module "typescript-compiler" {
    export = tsc;
}

declare var tsc: any;
