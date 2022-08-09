# openscb
xxxx.ext を開いているときに xxxx.scb ファイルをつくる VSCode 拡張機能

## Overview
これは vscode-scb を用いたメモグラミングを実現するものです。

具体的には指定ファイルに対応するメモファイル(.scb)を即座につくります。

参考: [メモグラミング - stakiran研究所](https://scrapbox.io/sta/%E3%83%A1%E3%83%A2%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0)

## Requirement
- vscode-scb を使っていることが前提です
    - https://github.com/stakiran/vscode-scb

## How to use
- 1 workspaceを開く
- 2 何かファイル xxxx.ext を開いた後、shift + enterを押す
    - すると `(workspaceRoot)/scb/xxxx.ext.scb` が開かれる

## Future plan
- `.memo.scb` みたいな dotfile によりオプションを実装する
    - 保存先ディレクトリ（今は `(workspaceRoot)/scb/` 決め打ち）

## LICENSE
[MIT](LICENSE)

## Author
[stakiran](https://github.com/stakiran)
