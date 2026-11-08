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

## Neovim

Requires Neovim 0.11+ and the `main` branch of
[nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter), plus a C compiler.
Neither language is part of nvim-treesitter or Neovim yet, so register them yourself.
The parser names are `franca` and `fdepl`; the built-in `fidl` parser is
Google's Fuchsia IDL, a different language, and is unaffected.

Add this to your config (before calling `require("nvim-treesitter").install`):

```lua
vim.filetype.add({ extension = { fidl = "franca", fdepl = "fdepl" } })

vim.api.nvim_create_autocmd("User", {
  pattern = "TSUpdate",
  callback = function()
    local parsers = require("nvim-treesitter.parsers")
    local url = "https://github.com/anurag3301/tree-sitter-franca"
    parsers.franca = {
      install_info = { url = url, branch = "main", queries = "queries" },
    }
    parsers.fdepl = {
      install_info = { url = url, branch = "main", location = "fdepl", queries = "fdepl/queries" },
    }
  end,
})

vim.api.nvim_create_autocmd("FileType", {
  pattern = { "franca", "fdepl" },
  callback = function(args) vim.treesitter.start(args.buf) end,
})
```

Then install the parsers and restart Neovim:

```vim
:lua require("nvim-treesitter").install({ "franca", "fdepl" })
```

To update later, run `:TSUpdate` (or `install` with `{ force = true }`).
Open a `.fidl` or `.fdepl` file and run `:checkhealth vim.treesitter` or `:InspectTree` to verify.

### Using a local clone

Point at a checkout instead of GitHub, which is handy for hacking on the grammar:

```lua
local repo = vim.fn.expand("~/repo/tree-sitter-franca")
parsers.franca = { install_info = { path = repo, queries = "queries" } }
parsers.fdepl = { install_info = { path = repo, location = "fdepl", queries = "fdepl/queries" } }
```

### Colours

The queries use the standard nvim-treesitter captures (`@keyword`, `@keyword.type`,
`@type`, `@type.builtin`, `@module`, `@property`, ...). Many colourschemes paint some of these
alike; to tell them apart, override the language-specific groups, e.g.

```lua
vim.api.nvim_set_hl(0, "@type.builtin.franca", { fg = "#89ddff" })
vim.api.nvim_set_hl(0, "@keyword.type.franca", { fg = "#c792ea", italic = true })
```

## Other editors

Any editor that can load a tree-sitter grammar works: build each parser with
`tree-sitter build` (run in the repo root for `franca`, in `fdepl/` for `fdepl`) and use
the queries in `queries/` and `fdepl/queries/`. The generated sources are committed, so
the `tree-sitter` CLI is only needed for development.

## License

MIT
