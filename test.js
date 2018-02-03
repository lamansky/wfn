'use strict'

const assert = require('assert')
const wfn = require('.')

/* eslint-disable brace-style */

// These functions are up here so no extra spacing messes with their stringification
function emptyMultiline () {
}
function multiline () {
  return 'test'
}
function allman ()
{
}

describe('wfn()', function () {
  it('should copy properties from the original function to the wrapper', function () {
    const wrapper = wfn(function original (a, b) {}, function wrapper () {})
    assert.strictEqual(wrapper.name, 'original')
    assert.strictEqual(wrapper.length, 2)
  })

  describe('wrapper#toString()', function () {
    it('should add comment after single-line functions', function () {
      const wrapper = wfn(function f () {}, function wrapper () {})
      assert(String(wrapper).trim().endsWith('}\n/* [wfn] Wrapped with wrapper() */'))
    })

    it('should add comment after single-line arrow functions', function () {
      const wrapper = wfn(() => {}, function wrapper () {})
      assert(String(wrapper).trim().endsWith('}\n/* [wfn] Wrapped with wrapper() */'))
    })

    it('should add comment inside multiline functions', function () {
      const wrapper = wfn(emptyMultiline, function wrapper () {})
      assert(String(wrapper).trim().endsWith('{\n/* [wfn] Wrapped with wrapper() */\n}'))
    })

    it('should add comment inside multiline functions with Allman brace style', function () {
      const wrapper = wfn(allman, function wrapper () {})
      assert(String(wrapper).trim().endsWith('{\n/* [wfn] Wrapped with wrapper() */\n}'))
    })

    it('should respect spacing within multiline functions', function () {
      const wrapper = wfn(multiline, function wrapper () {})
      assert(String(wrapper).includes('{\n  /* [wfn] Wrapped with wrapper() */\n  '))
    })

    it('should include 2 names separated by “and” if 2 nested wrappers', function () {
      const wrapper1 = wfn(function f () {}, function wrapper1 () {})
      const wrapper2 = wfn(wrapper1, function wrapper2 () {})
      assert(String(wrapper2).includes('/* [wfn] Wrapped with wrapper1() and wrapper2() */'))
    })

    it('should include 3 names in comma list if 3 nested wrappers', function () {
      const wrapper1 = wfn(function f () {}, function wrapper1 () {})
      const wrapper2 = wfn(wrapper1, function wrapper2 () {})
      const wrapper3 = wfn(wrapper2, function wrapper3 () {})
      assert(String(wrapper3).includes('/* [wfn] Wrapped with wrapper1(), wrapper2(), and wrapper3() */'))
    })

    it('should mention unnamed functions after named ones', function () {
      const wrapper1 = wfn(function f () {}, function wrapper1 () {})
      const wrapper2 = wfn(wrapper1, function () {})
      const wrapper3 = wfn(wrapper2, function wrapper3 () {})
      assert(String(wrapper3).includes('/* [wfn] Wrapped with wrapper1(), wrapper3(), and 1 other unnamed function */'))
    })

    it('should mention unnamed functions if all are unnamed', function () {
      const wrapper1 = wfn(function f () {}, function () {})
      const wrapper2 = wfn(wrapper1, function () {})
      assert(String(wrapper2).includes('/* [wfn] Wrapped with 2 unnamed functions */'))
    })
  })
})
