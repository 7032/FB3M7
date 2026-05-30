/**
 * F-BASIC V3.0 予約語データ（補完・検証用）。
 * シンタックス定義 syntaxes/fbasic.tmLanguage.json と内容を揃える。
 * 対象外: プリンタ(LPRINT/LLIST/LPOS/HARDCOPY)、漢字ROM、V3.0非搭載(STICK/STRIG/PAD/INP/OUT/WAIT/ERASE)。
 */

export const STATEMENTS: string[] = [
  'AUTO', 'BEEP', 'BUBINI', 'BUBR', 'BUBW', 'CHAIN', 'CIRCLE', 'CLEAR',
  'CLOAD', 'CLOADM', 'CLOSE', 'CLS', 'COLOR', 'COM', 'COMMON', 'CONNECT',
  'CONSOLE', 'CONT', 'COPY', 'CSAVE', 'DATA', 'DEF', 'DEFDBL', 'DEFINT',
  'DEFSNG', 'DEFSTR', 'DELETE', 'DIM', 'DSKINI', 'EDIT', 'ELSE', 'END',
  'ERROR', 'EXEC', 'FIELD', 'FILES', 'FN', 'FOR', 'GCURSOR', 'GET', 'GO',
  'GOSUB', 'GOTO', 'IF', 'INPUT', 'INTERVAL', 'KEY', 'KILL', 'LET', 'LINE',
  'LIST', 'LOAD', 'LOADM', 'LOCATE', 'LSET', 'MCOPY', 'MERGE', 'MON',
  'MOTOR', 'NAME', 'NEW', 'NEXT', 'ON', 'OPEN', 'PAINT', 'PLAY', 'POKE',
  'PRESET', 'PRINT', 'PSET', 'PUT', 'RANDOMIZE', 'READ', 'REM', 'RENUM',
  'RESTORE', 'RESUME', 'RETURN', 'RSET', 'RUN', 'SAVE', 'SAVEM', 'SCREEN',
  'SET', 'SKIPF', 'SOUND', 'STEP', 'STOP', 'SUB', 'SWAP', 'SYMBOL', 'TERM',
  'THEN', 'TO', 'TROFF', 'TRON', 'UNLIST', 'USING', 'VERIFY', 'VOLCOPY',
  'WEND', 'WHILE', 'WIDTH', 'WRITE'
];

/** 命令の補助語（ファイルモード等） */
export const CLAUSES: string[] = ['AS', 'OUTPUT', 'APPEND', 'RANDOM', 'OFF', 'ALL'];

export const FUNCTIONS: string[] = [
  'ABS', 'ANPORT', 'ASC', 'ATN', 'CDBL', 'CHR$', 'CINT', 'COS', 'CSNG',
  'CSRLIN', 'CVD', 'CVI', 'CVS', 'DATE$', 'DSKF', 'DSKI$', 'DSKO$', 'EOF',
  'ERL', 'ERR', 'EXP', 'FIX', 'FRE', 'HEX$', 'INKEY$', 'INPUT$', 'INSTR',
  'INT', 'LEFT$', 'LEN', 'LOC', 'LOF', 'LOG', 'MID$', 'MKD$', 'MKI$',
  'MKS$', 'OCT$', 'PEEK', 'PEN', 'POINT', 'POS', 'RIGHT$', 'RND', 'SGN',
  'SIN', 'SPACE$', 'SPC', 'SQR', 'STR$', 'STRING$', 'TAB', 'TAN', 'TIME$',
  'USR', 'VAL', 'VARPTR'
];

export const OPERATORS: string[] = ['AND', 'OR', 'NOT', 'XOR', 'EQV', 'IMP', 'MOD'];
