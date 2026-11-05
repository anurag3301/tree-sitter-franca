/**
 * @file Franca IDL grammar for tree-sitter
 * @author Anurag Kumar Singh
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'franca',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => seq(
      $.package_declaration,
      repeat($.import_declaration),
    ),

    package_declaration: $ => seq('package', field('name', $.qualified_name)),

    import_declaration: $ => seq(
      'import',
      choice(
        seq(field('namespace', $.imported_name), 'from', field('uri', $.string)),
        seq('model', field('uri', $.string)),
      ),
    ),

    imported_name: $ => seq($.qualified_name, optional('.*')),

    qualified_name: $ => seq($.identifier, repeat(seq('.', $.identifier))),

    identifier: _ => /\^?[a-zA-Z_][a-zA-Z0-9_]*/,

    string: _ => token(choice(
      /"([^"\\]|\\[\s\S])*"/,
      /'([^'\\]|\\[\s\S])*'/,
    )),

    comment: _ => token(choice(
      seq('//', /[^\r\n]*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
    )),
  },
});
