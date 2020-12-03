const path = require('path')

const extension = 'topojson'

/*
 * Walks the descendants of the node returning an array containing
 * the node type of each level
 */
const childTypes = node => {
  if (!node.children) {
    return [] // No children
  }

  let stack = [node]
    , types = []

  while (stack.length) {
    let node = stack.pop()
      , children = node.children

    if (children && children.length) {
      let child = children[0]
      types.push(child.type)
      stack.push(child)
    }
  }
  return types
}

/*
 * Returns the topojson endpoint for a node within a rollup tree.
 *
 * The `id` of the node is broken into 3 character chunks to form a path of
 * subdirectories, making it easier to use command line tools. The alternative
 * approach would have 100K+ files in a directory making cli tools cumbersome.
 *
 * For each level in the tree, we define a new directory with that node's `id`.
 * Inside of that directory will be a `${node.key}-<children-types>.json` file
 * containing the shape data for all children within the node.
 */
module.exports = node => {
  if (!node || !node.children) {
    return null
  }

  let id = node.key.toString()
    , subtypes = childTypes(node).join('-')
    , subpath = path.join(...id.substring(0, Math.min(id.length, 9)).match(/.{1,3}/g)) // Chunk the id

  return path.join(subpath, `${node.key}-${subtypes}.${extension}`)
}

