import type * as ESTree from "estree";

export as namespace acorn
export = acorn

declare namespace acorn {
  interface AcornNodeExtras {
    start: number
    end: number
    loc?: SourceLocation
    sourceFile?: string
  }

  // Acorn adds extra properties to each node. This takes an estree nod
  // and constructs a new type with the additional properties.
  type AcornNode<N> =
    N extends ESTree.BaseNode
      // It is a node, so (a) extend with extra properties added by acorn and (b) also extend children
      ? { [P in keyof N]: AcornNode<N[P]> } & AcornNodeExtras
      : N extends Array<unknown>
        // It is an array or tuple, extend each element with the extra properties
        ? { [P in keyof N]: AcornNode<N[P]> }
        : N

  function parse(input: string, options: Options): AcornNode<ESTree.Program>

  function parseExpressionAt(input: string, pos: number, options: Options): AcornNode<ESTree.Program>

  function tokenizer(input: string, options: Options): {
    getToken(): Token
    [Symbol.iterator](): Iterator<Token>
  }

  interface Options {
    ecmaVersion: 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 'latest'
    sourceType?: 'script' | 'module'
    onInsertedSemicolon?: ((lastTokEnd: number, lastTokEndLoc?: Position) => void) | null
    onTrailingComma?: ((lastTokEnd: number, lastTokEndLoc?: Position) => void) | null
    allowReserved?: boolean | 'never' | null
    allowReturnOutsideFunction?: boolean
    allowImportExportEverywhere?: boolean
    allowAwaitOutsideFunction?: boolean | null
    allowSuperOutsideMethod?: boolean | null
    allowHashBang?: boolean
    locations?: boolean
    onToken?: ((token: Token) => unknown) | Token[] | null
    onComment?: ((
      isBlock: boolean, text: string, start: number, end: number, startLoc?: Position,
      endLoc?: Position
    ) => void) | Comment[] | null
    ranges?: boolean
    program?: AcornNode<ESTree.Program>
    sourceFile?: string | null
    directSourceFile?: string | null
    preserveParens?: boolean
  }

  class Parser {
    constructor(options: Options, input: string, startPos?: number)
    parse(this: Parser): AcornNode<ESTree.Program>
    static parse<O extends Options>(this: typeof Parser, input: string, options: O): AcornNode<ESTree.Program>
    static parseExpressionAt<O extends Options>(this: typeof Parser, input: string, pos: number, options: O): AcornNode<ESTree.Program>
    static tokenizer(this: typeof Parser, input: string, options: Options): {
      getToken(): Token
      [Symbol.iterator](): Iterator<Token>
    }
    static extend(this: typeof Parser, ...plugins: ((BaseParser: typeof Parser) => typeof Parser)[]): typeof Parser
  }

  interface Position { line: number; column: number; offset: number }

  const defaultOptions: Required<Options>

  function getLineInfo(input: string, offset: number): Position

  class SourceLocation {
    start: Position
    end: Position
    source?: string | null
    constructor(p: Parser, start: Position, end: Position)
  }

  class Node {
    type: string
    start: number
    end: number
    loc?: SourceLocation
    sourceFile?: string
    range?: [number, number]
    constructor(parser: Parser, pos: number, loc?: SourceLocation)
  }

  interface TokenTypeConfig {
    keyword: string
    beforeExpr: boolean
    startsExpr: boolean
    isLoop: boolean
    isAssign: boolean
    prefix: boolean
    postfix: boolean
    binop: number | null
  }

  class TokenType {
    label: string
    keyword: string
    beforeExpr: boolean
    startsExpr: boolean
    isLoop: boolean
    isAssign: boolean
    prefix: boolean
    postfix: boolean
    binop: number | null
    updateContext: ((prevType: TokenType) => void) | null
    constructor(label: string, conf?: TokenTypeConfig)
  }

  const tokTypes: {
    num: TokenType
    regexp: TokenType
    string: TokenType
    name: TokenType
    privateId: TokenType
    eof: TokenType
    bracketL: TokenType
    bracketR: TokenType
    braceL: TokenType
    braceR: TokenType
    parenL: TokenType
    parenR: TokenType
    comma: TokenType
    semi: TokenType
    colon: TokenType
    dot: TokenType
    question: TokenType
    arrow: TokenType
    template: TokenType
    ellipsis: TokenType
    backQuote: TokenType
    dollarBraceL: TokenType
    eq: TokenType
    assign: TokenType
    incDec: TokenType
    prefix: TokenType
    logicalOR: TokenType
    logicalAND: TokenType
    bitwiseOR: TokenType
    bitwiseXOR: TokenType
    bitwiseAND: TokenType
    equality: TokenType
    relational: TokenType
    bitShift: TokenType
    plusMin: TokenType
    modulo: TokenType
    star: TokenType
    slash: TokenType
    starstar: TokenType
    _break: TokenType
    _case: TokenType
    _catch: TokenType
    _continue: TokenType
    _debugger: TokenType
    _default: TokenType
    _do: TokenType
    _else: TokenType
    _finally: TokenType
    _for: TokenType
    _function: TokenType
    _if: TokenType
    _return: TokenType
    _switch: TokenType
    _throw: TokenType
    _try: TokenType
    _var: TokenType
    _const: TokenType
    _while: TokenType
    _with: TokenType
    _new: TokenType
    _this: TokenType
    _super: TokenType
    _class: TokenType
    _extends: TokenType
    _export: TokenType
    _import: TokenType
    _null: TokenType
    _true: TokenType
    _false: TokenType
    _in: TokenType
    _instanceof: TokenType
    _typeof: TokenType
    _void: TokenType
    _delete: TokenType
  }

  class TokContext {
    token: string
    isExpr: boolean
    preserveSpace: boolean
    override: ((p: Parser) => void) | null | undefined
    generator: boolean
    constructor(token: string, isExpr: boolean, preserveSpace: boolean, override?: (p: Parser) => void, generator?: boolean)
  }

  const tokContexts: {
    b_stat: TokContext
    b_expr: TokContext
    b_tmpl: TokContext
    p_stat: TokContext
    p_expr: TokContext
    q_tmpl: TokContext
    f_expr: TokContext
    f_stat: TokContext
    f_expr_gen: TokContext
    f_gen: TokContext
  }

  function isIdentifierStart(code: number, astral?: boolean): boolean

  function isIdentifierChar(code: number, astral?: boolean): boolean

  interface AbstractToken {
  }

  interface Comment extends AbstractToken {
    type: string
    value: string
    start: number
    end: number
    loc?: SourceLocation
    range?: [number, number]
  }

  class Token {
    type: TokenType
    value: unknown
    start: number
    end: number
    loc?: SourceLocation
    range?: [number, number]
    constructor(p: Parser)
  }

  function isNewLine(code: number): boolean

  const lineBreak: RegExp

  const lineBreakG: RegExp

  const nonASCIIwhitespace: RegExp

  const version: string
}
