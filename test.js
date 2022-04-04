const test = require('tape')
    , endpoint = require('./')

test('null node', t => {
  t.plan(1)
  t.notOk(endpoint(null), 'null is null')
  t.end()
})

test('no children', t => {
  t.plan(1)
  t.equal(endpoint({
    key:  '123456',
    type: 'leaf',
    depth: 10
  }), '123/456/123456.topojson') // No children nested
  t.end()
})

test('nested children with some missing grandchildren', t => {
  t.plan(1)

  let node = {
    key: '12345678910',
    type: 'root',
    depth: 1,
    children: [{
      key: '3983020289',
      type: 'child',
      depth: 2,
      children: []
    }, {
      key: '3203',
      type: 'child',
      depth: 2,
      children: [{
        depth: 3,
        key: '320023989',
        type: 'grandchild'
      }]
    }]
  }
  t.equal(endpoint(node), '123/456/789/12345678910-child-grandchild.topojson')

  t.end()
})

test('nested children', t => {
  t.plan(2)

  let node = {
    key: '12345678910',
    type: 'root',
    depth: 0,
    children: [{
      key: '3983020289',
      type: 'child',
      depth: 1,
      children: [{
        key: '320023989',
        type: 'grandchild',
        depth: 2
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
