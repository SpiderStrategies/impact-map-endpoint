const path = require('path')

const extension = 'topojson'

/*
 * Return the child type of the node
 */
const childType = node => {
  if (!node.children || node.children.length == 0) {
    return null // No children
  }

  return node.children[0].type
}

/*
 * Returns the topojson endpoint for a node within a rollup tree.
 *
 * The `id` of the node is broken into 3 character chunks to form a path of
 * subdirectories, making it easier to use command line tools. The alternative
 * approach would have 100K+ files in a directory making cli tools cumbersome.
 *
 * For each level in the tree, we define a new directory with that node's `id`.
 * Inside of that directory will be a `${node.key}-<children-type>.json` file
 * containing the shape data.
 *
 * If the node doesn't contain children we use the structure `${node.key}.json`
 */
module.exports = node => {
  if (!node) {
    return null
  }

  let id = node.key.toString()
    , type = childType(node)
    , subpath = path.join(...id.substring(0, Math.min(id.length, 9)).match(/.{1,3}/g)) // Chunk the id

  if (type) {
    return path.join(subpath, `${node.key}-${type}.${extension}`)
  } else {
    return path.join(subpath, `${node.key}.${extension}`)
  }

}

