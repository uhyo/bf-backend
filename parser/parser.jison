%lex

%%
(?:\r\n|\r|\n)	/* skip newline */
' '|\t		/* skip whitespace */
'#'.*			/* skip comment */
'%'?[a-zA-Z_][\w\.]*		return 'IDENT'
(?:[+-]?(?:0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][01]+|[0-9a-fA-F]+[xX]|[0-7]+[oO]|[01]+[bB]|[0-9]+))		return 'NUMBER'
','		return ','
':'		return ':'
'*'		return '*'
';'		return ';'
<<EOF>>		return 'EOF'
.		return 'INVALID'

/lex

%start file

%%

file	: blocks EOF { return make.program($1) }
	;

blocks
	: block { $$ = [$1] }
	| blocks block { $$ = $1.concat($2) }
	;

block
	: label expressions { $$ = make.block($1, $2) }
	;

expressions
	: expression { $$ = [$1] }
	| expressions expression { $$ = $1.concat($2) }
	;

expression
	: op ';' { $$ = $1 }
	;

op
	: IDENT { $$ = make.op($1,[]) }
	| IDENT args { $$ = make.op($1,$2) }
	;

args
	: identifier { $$ = [$1] }
	| args ',' identifier { $$ = $1.concat($3) }
	;

label
	: '*' IDENT ':' { $$ = $2 }
	;

identifier
	/* memory addressing */
	: IDENT { $$ = make.addrValue($1) }
	| NUMBER { $$ = make.charValue($1) }
	;
	
%%
/* むりやり展開 */
var make=require('./make-asm').make;

