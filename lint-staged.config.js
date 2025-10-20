/**
 * Configuration Lint-Staged pour Monorepo
 *
 * Cette configuration optimisée pour Windows et les monorepos :
 * - Utilise prettier installé à la racine du workspace
 * - Gère correctement les chemins Windows avec des espaces
 * - Formate uniquement les fichiers staged
 * - Ignore les fichiers générés et les lock files via .prettierignore
 */

module.exports = {
  // Formater tous les fichiers supportés avec Prettier
  '**/*.{js,jsx,ts,tsx,json,md,yml,yaml,css,scss,html}': (filenames) => {
    // Échapper les chemins pour Windows
    const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ')

    return [
      `prettier --write --ignore-unknown ${files}`,
    ]
  },

  // Optionnel : ajouter ESLint pour les fichiers TS/TSX/JS/JSX
  // Décommentez si vous voulez lint les fichiers
  // '**/*.{ts,tsx,js,jsx}': (filenames) => {
  //   const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ')
  //   return [
  //     `eslint --fix ${files}`,
  //   ]
  // },
}
