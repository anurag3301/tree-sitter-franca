# tree-sitter-franca

[Tree-sitter](https://tree-sitter.github.io/) grammar for [Franca IDL](https://github.com/franca/franca) (`.fidl`).

Covers packages, imports, type collections, interfaces, attributes, methods,
broadcasts, all type definitions, constants, expressions, annotations,
and contracts. Validated against ~180 public `.fidl` files.

Deployment files (`.fdepl`) are supported by a second grammar in [`fdepl/`](fdepl),
validated against ~3700 real `.fdepl` files.

## Development

```sh
npm install
npx tree-sitter generate
npx tree-sitter test
```

## Neovim (nvim-treesitter)

```lua
vim.filetype.add({ extension = { fidl = "franca" } })
vim.api.nvim_create_autocmd("User", {
  pattern = "TSUpdate",
  callback = function()
    require("nvim-treesitter.parsers").franca = {
      install_info = { url = "https://github.com/anurag3301/tree-sitter-franca" },
    }
    require("nvim-treesitter.parsers").fdepl = {
      install_info = {
        url = "https://github.com/anurag3301/tree-sitter-franca",
        location = "fdepl",
      },
    }
  end,
})
```

Copy `queries/*.scm` to `queries/franca/` and `fdepl/queries/*.scm` to `queries/fdepl/`
(and add `vim.filetype.add({ extension = { fdepl = "fdepl" } })`).

## License

MIT
