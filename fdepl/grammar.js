/**
 * @file Franca deployment (.fdepl) grammar for tree-sitter
 * @author Anurag Kumar Singh
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'fdepl',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => seq(
      optional($.package_declaration),
      repeat($.import_declaration),
      repeat($.specification),
      repeat($._deployment),
    ),

    package_declaration: $ => seq('package', field('name', $.qualified_name)),

    import_declaration: $ => seq(
      'import',
      choice(field('uri', $.string), field('name', $.qualified_name)),
    ),

    // Specifications

    specification: $ => seq(
      'specification',
      field('name', $.qualified_name),
      optional(seq('extends', field('base', $.qualified_name))),
      '{',
      repeat($.specification_host),
      '}',
    ),

    specification_host: $ => seq(
      'for',
      field('host', $.identifier),
      '{',
      repeat($.property_declaration),
      '}',
    ),

    property_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.property_type),
      optional(seq('(', $.property_flag, repeat(seq(',', $.property_flag)), ')')),
      ';',
    ),

    property_flag: $ => choice(
      'optional',
      seq('default', ':', $._complex_value),
    ),

    property_type: $ => seq(
      choice($.predefined_type, $.enum_type, $.identifier),
      optional('[]'),
    ),

    predefined_type: _ => choice('Integer', 'String', 'Boolean', 'Interface'),

    enum_type: $ => seq('{', $.identifier, repeat(seq(',', $.identifier)), '}'),

    // Deployments

    _deployment: $ => choice(
      $.type_collection_deployment,
      $.interface_deployment,
      $.extension_root,
    ),

    _deployment_header: $ => seq(
      'define',
      field('spec', $.qualified_name),
      'for',
    ),

    _alias: $ => seq('as', field('alias', $.qualified_name)),

    use_declaration: $ => seq('use', $.qualified_name),

    type_collection_deployment: $ => seq(
      $._deployment_header,
      'typeCollection',
      field('target', $.qualified_name),
      optional($._alias),
      '{',
      repeat($.use_declaration),
      repeat($._property),
      repeat($._type_definition),
      '}',
    ),

    interface_deployment: $ => seq(
      $._deployment_header,
      'interface',
      field('target', $.qualified_name),
      optional($._alias),
      '{',
      repeat($.use_declaration),
      repeat($._property),
      repeat(choice(
        $.attribute_deployment,
        $.method_deployment,
        $.broadcast_deployment,
        $._type_definition,
      )),
      '}',
    ),

    extension_root: $ => seq(
      $._deployment_header,
      field('tag', $.identifier),
      optional(field('target', $.qualified_name)),
      optional($._alias),
      '{',
      repeat($.use_declaration),
      repeat($._property),
      repeat($.extension_element),
      '}',
    ),

    extension_element: $ => seq(
      field('tag', $.identifier),
      optional(field('target', $.qualified_name)),
      optional($._alias),
      '{',
      repeat($._property),
      repeat($.extension_element),
      '}',
    ),

    // Interface members

    attribute_deployment: $ => seq(
      'attribute',
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      optional($.type_overwrites),
      '}',
    ),

    method_deployment: $ => seq(
      'method',
      field('target', $.operation_name),
      '{',
      repeat($._property),
      optional(seq('in', $.argument_list)),
      optional(seq('out', $.argument_list)),
      '}',
    ),

    broadcast_deployment: $ => seq(
      'broadcast',
      field('target', $.operation_name),
      '{',
      repeat($._property),
      optional(seq('out', $.argument_list)),
      '}',
    ),

    operation_name: $ => seq($.qualified_name, optional(seq(':', field('selector', $.identifier)))),

    argument_list: $ => seq('{', repeat($.argument_deployment), '}'),

    argument_deployment: $ => seq(
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      optional($.type_overwrites),
      '}',
    ),

    // Types

    _type_definition: $ => choice(
      $.array_deployment,
      $.struct_deployment,
      $.union_deployment,
      $.typedef_deployment,
      $.enumeration_deployment,
      $.map_deployment,
    ),

    array_deployment: $ => seq(
      'array',
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      optional($.type_overwrites),
      '}',
    ),

    struct_deployment: $ => seq(
      'struct',
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      repeat($.field_deployment),
      '}',
    ),

    union_deployment: $ => seq(
      'union',
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      repeat($.field_deployment),
      '}',
    ),

    typedef_deployment: $ => seq(
      'typedef',
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      '}',
    ),

    enumeration_deployment: $ => seq(
      'enumeration',
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      repeat($.enumerator_deployment),
      '}',
    ),

    map_deployment: $ => seq(
      'map',
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      optional($.map_key),
      optional($.map_value),
      '}',
    ),

    map_key: $ => seq('key', '{', repeat($._property), '}'),

    map_value: $ => seq('value', '{', repeat($._property), '}'),

    field_deployment: $ => seq(
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      optional($.type_overwrites),
      '}',
    ),

    enumerator_deployment: $ => seq(
      field('target', $.qualified_name),
      '{',
      repeat($._property),
      '}',
    ),

    type_overwrites: $ => choice(
      seq('#', '{', repeat($._property), '}'),
      seq(choice('#struct', '#union'), '{', repeat($._property), repeat($.field_deployment), '}'),
      seq('#enumeration', '{', repeat($._property), repeat($.enumerator_deployment), '}'),
    ),

    // Properties and values

    _property: $ => seq($.property, optional(',')),

    property: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', $._complex_value),
    ),

    _complex_value: $ => choice($._value, $.value_array),

    value_array: $ => seq('{', $._value, repeat(seq(',', $._value)), '}'),

    _value: $ => choice(
      $.integer,
      $.string,
      $.boolean,
      $.interface_reference,
      $.qualified_name,
    ),

    interface_reference: $ => seq('&', $.qualified_name),

    boolean: _ => choice('true', 'false'),

    integer: _ => token(choice(
      /-[0-9]+/,
      /0[xX][0-9a-fA-F]+/,
      /0[bB][01]+/,
      /[0-9]+/,
    )),

    string: _ => token(choice(
      /"([^"\\]|\\[\s\S])*"/,
      /'([^'\\]|\\[\s\S])*'/,
    )),

    qualified_name: $ => seq($.identifier, repeat(seq('.', $.identifier))),

    identifier: _ => /\^?[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: _ => token(choice(
      seq('//', /[^\r\n]*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
    )),
  },
});
