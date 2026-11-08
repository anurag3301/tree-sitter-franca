(identifier) @variable

; Specifications
(specification
  name: (qualified_name
    (identifier) @type))

(specification
  base: (qualified_name
    (identifier) @type))

(specification_host
  host: (identifier) @type)

(property_declaration
  name: (identifier) @property)

(property_type
  (identifier) @type)

(enum_type
  (identifier) @constant)

(predefined_type) @type.builtin

; Deployment headers
(_
  spec: (qualified_name
    (identifier) @type))

(extension_root
  tag: (identifier) @keyword)

(extension_element
  tag: (identifier) @keyword)

(extension_root
  target: (qualified_name
    (identifier) @type))

(extension_element
  target: (qualified_name
    (identifier) @type))

(type_collection_deployment
  target: (qualified_name
    (identifier) @type))

(interface_deployment
  target: (qualified_name
    (identifier) @type))

(_
  alias: (qualified_name
    (identifier) @type))

(use_declaration
  (qualified_name
    (identifier) @type))

; Targets
(attribute_deployment
  target: (qualified_name
    (identifier) @property))

(operation_name
  (qualified_name
    (identifier) @function.method))

(operation_name
  selector: (identifier) @function.method)

(argument_deployment
  target: (qualified_name
    (identifier) @variable.parameter))

(array_deployment
  target: (qualified_name
    (identifier) @type))

(struct_deployment
  target: (qualified_name
    (identifier) @type))

(union_deployment
  target: (qualified_name
    (identifier) @type))

(typedef_deployment
  target: (qualified_name
    (identifier) @type))

(enumeration_deployment
  target: (qualified_name
    (identifier) @type))

(map_deployment
  target: (qualified_name
    (identifier) @type))

(field_deployment
  target: (qualified_name
    (identifier) @variable.member))

(enumerator_deployment
  target: (qualified_name
    (identifier) @constant))

; Namespaces
(package_declaration
  name: (qualified_name
    (identifier) @module))

(import_declaration
  name: (qualified_name
    (identifier) @module))

(qualified_name
  (identifier) @module
  .
  ".")

; Properties and values
(property
  name: (identifier) @property)

(property
  value: (qualified_name
    (identifier) @constant))

(property_flag
  (qualified_name
    (identifier) @constant))

(value_array
  (qualified_name
    (identifier) @constant))

(interface_reference
  (qualified_name
    (identifier) @type))

(integer) @number

(string) @string

(boolean) @boolean

; Keywords
[
  "package"
  "import"
] @keyword.import

[
  "typeCollection"
  "interface"
  "array"
  "struct"
  "union"
  "typedef"
  "enumeration"
  "map"
  "specification"
] @keyword.type

[
  "attribute"
  "method"
  "broadcast"
  "extends"
  "for"
  "define"
  "as"
  "use"
  "in"
  "out"
  "key"
  "value"
  "optional"
  "default"
] @keyword

[
  "#"
  "#struct"
  "#union"
  "#enumeration"
] @keyword.directive

[
  "="
  "&"
] @operator

[
  "("
  ")"
  "[]"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  ";"
  ":"
  "."
] @punctuation.delimiter

(comment) @comment @spell
