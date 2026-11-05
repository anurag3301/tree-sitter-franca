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

    constant_declaration: $ => seq(
      optional($.annotation_block),
      'const',
      field('type', $._type_ref),
      optional($.array_suffix),
      field('name', $.identifier),
      '=',
      field('value', $._initializer),
    ),

    _type_definition: $ => choice(
      $.array_declaration,
      $.typedef_declaration,
      $.struct_declaration,
      $.union_declaration,
      $.enumeration_declaration,
      $.map_declaration,
    ),

    array_declaration: $ => seq(
      optional($.annotation_block),
      optional('public'),
      'array',
      field('name', $.identifier),
      'of',
      field('element_type', $._type_ref),
    ),

    typedef_declaration: $ => seq(
      optional($.annotation_block),
      optional('public'),
      'typedef',
      field('name', $.identifier),
      'is',
      field('type', $._type_ref),
    ),

    struct_declaration: $ => seq(
      optional($.annotation_block),
      optional('public'),
      'struct',
      field('name', $.identifier),
      optional(choice(
        seq('extends', field('base', $.qualified_name)),
        'polymorphic',
      )),
      '{',
      repeat($.field),
      '}',
    ),

    union_declaration: $ => seq(
      optional($.annotation_block),
      optional('public'),
      'union',
      field('name', $.identifier),
      optional(seq('extends', field('base', $.qualified_name))),
      '{',
      repeat($.field),
      '}',
    ),

    field: $ => seq(
      optional($.annotation_block),
      field('type', $._type_ref),
      optional($.array_suffix),
      field('name', $.identifier),
    ),

    enumeration_declaration: $ => seq(
      optional($.annotation_block),
      optional('public'),
      'enumeration',
      field('name', $.identifier),
      optional(seq('extends', field('base', $.qualified_name))),
      $.enumerator_list,
    ),

    enumerator_list: $ => seq(
      '{',
      optional(seq(
        $.enumerator,
        repeat(seq(optional(','), $.enumerator)),
      )),
      '}',
    ),

    enumerator: $ => seq(
      optional($.annotation_block),
      field('name', $.identifier),
      optional(seq('=', field('value', $._expression))),
    ),

    map_declaration: $ => seq(
      optional($.annotation_block),
      optional('public'),
      'map',
      field('name', $.identifier),
      '{',
      field('key_type', $._type_ref),
      'to',
      field('value_type', $._type_ref),
      '}',
    ),

    array_suffix: _ => seq('[', ']'),

    _type_ref: $ => choice(
      $.basic_type,
      $.integer_interval,
      alias($.qualified_name, $.type_reference),
    ),

    basic_type: _ => choice(
      'undefined',
      'Int8', 'UInt8', 'Int16', 'UInt16', 'Int32', 'UInt32', 'Int64', 'UInt64',
      'Boolean', 'String', 'Float', 'Double', 'ByteBuffer',
    ),

    integer_interval: $ => seq(
      'Integer',
      optional(seq(
        '(',
        field('lower', choice($.interval_bound, 'minInt')),
        ',',
        field('upper', choice($.interval_bound, 'maxInt')),
        ')',
      )),
    ),

    interval_bound: $ => seq(optional('-'), $.integer),

    _initializer: $ => choice(
      $._expression,
      $.compound_initializer,
      $.bracket_initializer,
    ),

    compound_initializer: $ => seq(
      '{',
      optional(seq(
        $.field_initializer,
        repeat(seq(',', $.field_initializer)),
      )),
      '}',
    ),

    field_initializer: $ => seq(
      field('name', $.identifier),
      ':',
      field('value', $._initializer),
    ),

    bracket_initializer: $ => seq(
      '[',
      optional(seq(
        $.element_initializer,
        repeat(seq(',', $.element_initializer)),
      )),
      ']',
    ),

    element_initializer: $ => seq(
      field('first', $._initializer),
      optional(seq('=>', field('second', $._initializer))),
    ),

    _expression: $ => choice(
      $.binary_expression,
      $._primary_expression,
    ),

    binary_expression: $ => {
      const table = [
        [1, '||'],
        [2, '&&'],
        [3, choice('==', '!=')],
        [4, choice('<', '<=', '>=', '>')],
        [5, choice('+', '-')],
        [6, choice('*', '/')],
      ];
      return choice(...table.map(([p, op]) => prec.left(p, seq(
        field('left', $._expression),
        field('operator', op),
        field('right', $._expression),
      ))));
    },

    _primary_expression: $ => choice(
      $.unary_expression,
      $._simple_expression,
    ),

    unary_expression: $ => prec(7, seq(
      field('operator', choice('!', '-')),
      field('operand', $._simple_expression),
    )),

    _simple_expression: $ => choice(
      $.element_reference,
      $.current_error,
      $.error_enumerator_reference,
      $._constant,
      $.parenthesized_expression,
    ),

    element_reference: $ => seq(
      $.qualified_name,
      repeat(seq('->', field('field', $.identifier))),
    ),

    current_error: _ => 'errorval',

    error_enumerator_reference: $ => seq(
      'errordef', '.', field('enumerator', $.identifier),
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    _constant: $ => choice(
      $.double_literal,
      $.float_literal,
      $.integer,
      $.boolean,
      $.string,
    ),

    double_literal: _ => /[0-9]+\.[0-9]+(e-?[0-9]+)?d/,

    float_literal: _ => /[0-9]+\.[0-9]+(e-?[0-9]+)?f/,

    boolean: _ => choice('true', 'false'),

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
