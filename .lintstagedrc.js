module.exports = {
  "**/*.{js,jsx,ts,tsx,json,md,yml,yaml}": (filenames) => {
    return [`pnpm nx format:write --files=${filenames.join(",")}`];
  },
};
