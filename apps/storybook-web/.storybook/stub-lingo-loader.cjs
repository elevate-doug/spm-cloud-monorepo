const path = require('path')
const fs = require('fs')

// Packages known to be safe and resolvable (don't stub these)
const knownSafePackages = [
  'react',
  'react-native',
  'react-native-web',
  'react-native-paper',
  'react-native-safe-area-context',
  'react-native-vector-icons',
]

// Packages that are native-only and must always be stubbed
const alwaysStubPackages = [
  'react-native-image-pan-zoom',
  'react-native-svg',
  '@react-native-community/',
]

function isSafePackage(source) {
  return knownSafePackages.some((pkg) => source === pkg || source.startsWith(pkg + '/'))
}

function isAlwaysStub(source) {
  return alwaysStubPackages.some((pkg) => source.startsWith(pkg))
}

function shouldStubImport(importSource, id) {
  // Always stub native-only packages
  if (isAlwaysStub(importSource)) return true

  // Check relative imports
  if (importSource.startsWith('.')) {
    const resolved = path.resolve(path.dirname(id), importSource)
    // Stub if it escapes the lingo package
    if (!resolved.includes('packages' + path.sep + 'lingo')) return true
    // Stub if the file doesn't exist
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '']
    const fileExists = extensions.some((ext) => fs.existsSync(resolved + ext))
    const dirExists = extensions.some((ext) => fs.existsSync(path.join(resolved, 'index' + ext)))
    if (!fileExists && !dirExists) return true
    return false
  }

  // Bare specifiers (packages)
  if (!importSource.startsWith('/')) {
    if (isSafePackage(importSource)) return false
    // Try to resolve the package — if it fails, stub it
    try {
      require.resolve(importSource, { paths: [path.dirname(id)] })
      return false
    } catch {
      return true
    }
  }

  return false
}

module.exports = function stubLingoLoader(source) {
  const id = this.resourcePath
  let result = source

  // Stub import statements
  const importRegex = /^(import\s+(?:(\w+)(?:\s*,\s*)?)?(?:\{([^}]*)\})?\s+from\s+['"]([^'"]+)['"])/gm
  const importReplacements = []

  let match
  while ((match = importRegex.exec(source)) !== null) {
    const [fullMatch, , defaultImport, namedImports, importSource] = match

    if (shouldStubImport(importSource, id)) {
      const stubs = []
      if (defaultImport) {
        stubs.push(`const ${defaultImport} = {};`)
      }
      if (namedImports) {
        const names = namedImports.split(',').map((n) => n.trim()).filter(Boolean)
        for (const name of names) {
          const alias = name.includes(' as ') ? name.split(' as ')[1].trim() : name
          stubs.push(`const ${alias} = () => null;`)
        }
      }
      importReplacements.push({ original: fullMatch, replacement: stubs.join(' ') })
    }
  }

  for (const { original, replacement } of importReplacements) {
    result = result.replace(original, replacement)
  }

  // Stub require() calls with broken paths
  const requireRegex = /require\(\s*['"]([^'"]+)['"]\s*\)/g
  let reqMatch
  while ((reqMatch = requireRegex.exec(result)) !== null) {
    const [fullMatch, requireSource] = reqMatch
    if (shouldStubImport(requireSource, id)) {
      result = result.replace(fullMatch, '({ default: {} })')
    }
  }

  return result
}
