const path = require('path')

const extension = 'topojson'

const flatten = node => {
  return node.reduce((p, c) => {
    p = p.concat(c)
    if (c.children) {
      p = p.concat(flatten(c.children))
    }
    return p
  }, [])
}

/*
 * Walks the descendants of the node returning an array containing
 * the node type of each level
 */
const childTypes = node => {
  if (!node.children) {
    return [] // No children
  }

  // Flatten all the children
  let deepest = flatten(node.children).reduce((p, c) => {
    if (!p.length || c.depth > p[p.length - 1].depth) {
      p.push({
        depth: c.depth,
        type: c.type
      })
    }
    return p
  }, [])

  return deepest.map(node => node.type)
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
 *
 * If the node doesn't contain children we use the structure `${node.key}.json`
 */
module.exports = node => {
  if (!node) {
    return null
  }

  let id = node.key.toString()
    , subtypes = childTypes(node).join('-')
    , subpath = path.join(...id.substring(0, Math.min(id.length, 9)).match(/.{1,3}/g)) // Chunk the id

  if (subtypes) {
    return path.join(subpath, `${node.key}-${subtypes}.${extension}`)
  } else {
    return path.join(subpath, `${node.key}.${extension}`)
  }

}

