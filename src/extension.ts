import * as vscode from 'vscode';

const boldRegex = /\*\*(?=\S)(.(?!\*\*))*\S(?<!\*)\*\*/g;
const undrRegex = /__(?=\S)(.(?!__))*\S(?<!_)__/g;
const strkRegex = /~~(?=\S)(.(?!~~))*\S(?<!~)~~/g;
const blueRegex = /\^\^(?=\S)(.(?!\^\^))*\S(?<!\^)\^\^/g;

const boldDecoration = vscode.window.createTextEditorDecorationType({ fontWeight: 'bold' });
const undrDecoration = vscode.window.createTextEditorDecorationType({ fontStyle: 'italic' });
const strkDecoration = vscode.window.createTextEditorDecorationType({ textDecoration: 'line-through' });
const blueDecoration = vscode.window.createTextEditorDecorationType({ backgroundColor: '#444' });

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidChangeTextDocument(event => {
    const openEditor = vscode.window.visibleTextEditors.filter(
      editor => editor.document.uri === event.document.uri
    )[0];
    decorate(openEditor, boldRegex, boldDecoration);
    decorate(openEditor, undrRegex, undrDecoration);
    decorate(openEditor, strkRegex, strkDecoration);
    decorate(openEditor, blueRegex, blueDecoration);
  });
}

function decorate(editor: vscode.TextEditor, regex: RegExp, decoration: vscode.TextEditorDecorationType) {
  const sourceCodeLines = editor.document.getText().split('\n');
  let decorationsArray: vscode.DecorationOptions[] = [];
  for (let line = 0; line < sourceCodeLines.length; line++) {
    const matches = sourceCodeLines[line].matchAll(regex);
    for (const match of matches) {
      const range = new vscode.Range(
        new vscode.Position(line, match.index),
        new vscode.Position(line, match.index + match[0].length)
      );
      decorationsArray.push({ range });
    }
  }
  editor.setDecorations(decoration, decorationsArray);
}
