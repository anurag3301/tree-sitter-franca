; Identifiers and names (generic first, specific overrides below)

(identifier) @variable

; Declarations

(interface_declaration name: (identifier) @type)
(type_collection name: (identifier) @type)
(array_declaration name: (identifier) @type)
(typedef_declaration name: (identifier) @type)
(struct_declaration name: (identifier) @type)
(union_declaration name: (identifier) @type)
(enumeration_declaration name: (identifier) @type)
(map_declaration name: (identifier) @type)

(method_declaration name: (identifier) @function.method)
(method_declaration selector: (identifier) @function.method)
(broadcast_declaration name: (identifier) @function.method)
(broadcast_declaration selector: (identifier) @function.method)

(attribute_declaration name: (identifier) @property)
(field name: (identifier) @variable.member)
(argument name: (identifier) @variable.parameter)
(variable_declaration name: (identifier) @variable)
(constant_declaration name: (identifier) @constant)
(enumerator name: (identifier) @constant)

(state name: (identifier) @label)
(state_graph initial: (identifier) @label)
(transition target: (identifier) @label)

; Namespaces and references

(package_declaration name: (qualified_name (identifier) @module))
(imported_name (qualified_name (identifier) @module))

(type_reference (identifier) @type)
(type_reference (identifier) @module . ".")

(interface_declaration base: (qualified_name (identifier) @type))
(interface_declaration managed: (qualified_name (identifier) @type))
(struct_declaration base: (qualified_name (identifier) @type))
(union_declaration base: (qualified_name (identifier) @type))
(enumeration_declaration base: (qualified_name (identifier) @type))
(error_body base: (qualified_name (identifier) @type))
(error_clause enumeration: (qualified_name (identifier) @type))

(qualified_name (identifier) @module . ".")

(element_reference field: (identifier) @property)
(error_enumerator_reference enumerator: (identifier) @constant)
(selector_reference name: (identifier) @function.method)
(selector_reference selector: (identifier) @function.method)
(trigger attribute: (identifier) @property)

; Types

; The material theme colours @type and @keyword alike, so builtin types use a
; capture it renders differently.
(basic_type) @constant.builtin
"Integer" @constant.builtin
["minInt" "maxInt"] @constant.builtin

; Literals

(integer) @number
(double_literal) @number.float
(float_literal) @number.float
(boolean) @boolean
(string) @string
(current_error) @constant.builtin

; Keywords

["package" "import" "from" "model"] @keyword.import

[
  "typeCollection"
  "interface"
  "struct"
  "union"
  "enumeration"
  "array"
  "map"
  "typedef"
  "attribute"
  "method"
  "broadcast"
  "contract"
] @keyword.storage

[
  "extends"
  "manages"
  "version"
  "major"
  "minor"
  "const"
  "of"
  "is"
  "to"
  "vars"
  "PSM"
  "initial"
  "state"
  "on"
  "call"
  "respond"
  "error"
  "signal"
  "set"
  "update"
  "errordef"
  "in"
  "out"
] @keyword

["if" "else"] @keyword.conditional

[
  "public"
  "polymorphic"
  "fireAndForget"
  "selective"
] @keyword.modifier

(attribute_modifier) @keyword.modifier

; Operators and punctuation

[
  "+" "-" "*" "/"
  "==" "!=" "<" "<=" ">" ">="
  "&&" "||" "!"
  "=" "=>" "->"
  ".*"
] @operator

["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["," ";" ":" "."] @punctuation.delimiter

; Comments

(comment) @comment @spell
(annotation_block) @comment.documentation
(annotation_tag) @attribute
(annotation_text) @comment.documentation
