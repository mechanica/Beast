'use strict';
/*global describe:true, it:true, beforeEach:true*/

var expect = require('chai').expect;

describe('Beast service', function () {

  it('should do something', function () {
    var something = function () { return true; };

    expect(something).to.be.a('function');
    expect(something).not.to.throw();
    expect(something()).to.be.true;
  });

  it('should execute workflow');
  it('should support long-running tasks');
  it('should be scalable');

  it('should be awesome');

});
