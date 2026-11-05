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
      repeat(choice($.type_collection, $.interface_declaration)),
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

    type_collection: $ => seq(
      optional($.annotation_block),
      'typeCollection',
      optional(field('name', $.identifier)),
      '{',
      optional($.version),
      repeat(choice($.constant_declaration, $._type_definition)),
      '}',
    ),

    interface_declaration: $ => seq(
      optional($.annotation_block),
      'interface',
      field('name', $.identifier),
      optional(seq('extends', field('base', $.qualified_name))),
      optional(seq(
        'manages',
        field('managed', $.qualified_name),
        repeat(seq(',', field('managed', $.qualified_name))),
      )),
      '{',
      optional($.version),
      repeat($._interface_member),
      '}',
    ),

    _interface_member: $ => choice(
      $.constant_declaration,
      $._type_definition,
    ),

    version: $ => seq(
      'version',
      '{',
      'major', field('major', $.integer),
      'minor', field('minor', $.integer),
      '}',
    ),

    // Placeholders, filled in by the following grammar milestones.
    constant_declaration: $ => seq(optional($.annotation_block), 'const', $.identifier),
    _type_definition: $ => seq(optional($.annotation_block), 'typedef', $.identifier),

    annotation_block: $ => seq('<**', repeat1($.annotation), '**>'),

    annotation: $ => seq(
      field('tag', $.annotation_tag),
      field('text', optional($.annotation_text)),
    ),

    annotation_tag: _ => /@[a-z-]+[ \t]*:/,

    annotation_text: _ => /(\\[btnfru"'\\*@]|[^\\*@])+/,

    qualified_name: $ => seq($.identifier, repeat(seq('.', $.identifier))),

    integer: _ => token(choice(
      /0[xX][0-9a-fA-F]+/,
      /0[bB][01]+/,
      /[0-9]+/,
    )),

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
