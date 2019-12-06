module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-cond-assign": "error",
        "no-extra-parens": "error",
        "no-prototype-builtins": "off",
        "no-template-curly-in-string": "error",
        "array-callback-return": "error",
        "block-scoped-var": "off",
        "complexity": [
            "warn",
            20
        ],
        "consistent-return": "error",
        "default-case": "off",
        "dot-location": [
            "error",
            "property"
        ],
        "dot-notation": "error",
        "eqeqeq": "error",
        "guard-for-in": 1,
        "no-alert": 1,
        "no-caller": "error",
        "no-empty-function": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extra-bind": "error",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "off",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-octal": 1,
        "no-octal-escape": 1,
        "no-proto": "error",
        "no-redeclare": 1,
        "no-restricted-properties": "error",
        "no-return-await": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": 1,
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-void": "error",
        "radix": "error",
        "wrap-iife": [
            "error",
            "any"
        ],
        "yoda": "error",
        "no-undef-init": "error",
        "no-undefined": "error",
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        "array-bracket-spacing": "error",
        "array-element-newline": [
            "error",
            "consistent"
        ],
        "block-spacing": [
            "error",
            "always"
        ],
        "brace-style": [
            "error",
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "camelcase": "error",
        "comma-dangle": [
            "error",
            "never"
        ],
        "comma-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "comma-style": [
            "error",
            "last"
        ],
        "computed-property-spacing": [
            "error",
            "never"
        ],
        "consistent-this": [
            "error",
            "self"
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "func-call-spacing": [
            "error",
            "never"
        ],
        "func-name-matching": [
            "error",
            "always"
        ],
        "function-paren-newline": [
            "error",
            "multiline"
        ],
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "jsx-quotes": [
            "error",
            "prefer-double"
        ],
        "key-spacing": [
            "error",
            {
                "beforeColon": false,
                "afterColon": true,
                "mode": "strict"
            }
        ],
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-depth": [
            "warn",
            10
        ],
        "max-len": [
            "error",
            {
                "code": 140,
                "tabWidth": 4,
                "ignoreUrls": true,
                "ignoreTemplateLiterals": true,
                "ignoreRegExpLiterals": true
            }
        ],
        "max-lines": [
            "warn",
            {
                "max": 600,
                "skipBlankLines": true
            }
        ],
        "max-lines-per-function": [
            "warn",
            {
                "max": 150
            }
        ],
        "max-nested-callbacks": [
            "error",
            10
        ],
        "max-statements-per-line": [
            "warn",
            {
                "max": 4
            }
        ],
        "new-cap": [
            "error",
            {
                "newIsCap": true
            }
        ],
        "new-parens": "error",
        "no-bitwise": "error",
        "no-continue": "off",
        "no-lonely-if": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2,
                "maxEOF": 1
            }
        ],
        "no-trailing-spaces": "error",
        "no-unneeded-ternary": 1,
        "no-whitespace-before-property": "error",
        "nonblock-statement-body-position": [
            "error",
            "beside"
        ],
        "object-curly-newline": [
            "error",
            {
                "consistent": true
            }
        ],
        "object-curly-spacing": [
            "error",
            "always",
            {
                "objectsInObjects": false
            }
        ],
        "object-property-newline": [
            "error",
            {
                "allowAllPropertiesOnSameLine": true
            }
        ],
        "operator-linebreak": [
            "error",
            "before"
        ],
        "quote-props": [
            "warn",
            "consistent-as-needed"
        ],
        "quotes": [
            "error",
            "single",
            {
                "allowTemplateLiterals": true,
                "avoidEscape": true
            }
        ],
        "semi": [
            "error",
            "always"
        ],
        "semi-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "semi-style": [
            "error",
            "last"
        ],
        "space-before-blocks": [
            "error",
            "always"
        ],
        "space-before-function-paren": [
            "error",
            "never"
        ],
        "space-in-parens": [
            "error",
            "never"
        ],
        "space-infix-ops": [
            "error",
            {
                "int32Hint": false
            }
        ],
        "space-unary-ops": [
            "error",
            {
                "words": true,
                "nonwords": false
            }
        ],
        "spaced-comment": [
            "error",
            "always"
        ],
        "switch-colon-spacing": [
            "error",
            {
                "after": true,
                "before": false
            }
        ],
        "unicode-bom": [
            "error",
            "never"
        ],
        "wrap-regex": "off"
    }
}
