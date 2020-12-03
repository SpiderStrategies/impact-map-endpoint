const test = require('tape')
    , endpoint = require('./')

test('null node', t => {
  t.plan(1)
  t.notOk(endpoint(null), 'null is null')
  t.end()
})

test('no children', t => {
  t.plan(1)
  t.notOk(endpoint({}), 'no children provides no endpoint')
  t.end()
})

test('nested children', t => {
  t.plan(2)

  let node = {
    key: '12345678910',
    type: 'root',
    children: [{
      key: '3983020289',
      type: 'child',
      children: [{
        key: '320023989',
        type: 'grandchild'
      }]
    }]
  }

  t.equal(endpoint(node), '123/456/789/12345678910-child-grandchild.topojson')
  t.equal(endpoint(node.children[0]), '398/302/028/3983020289-grandchild.topojson')

  t.end()
})

test('short node id path', t => {
  t.plan(1)

  let node = {
    key: '123',
    type: 'root',
    children: [{
      key: '3983020289',
      type: 'child'
    }]
  }

  t.equal(endpoint(node), '123/123-child.topojson')
  t.end()
})
