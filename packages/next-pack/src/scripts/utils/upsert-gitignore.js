const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const { projectDir, workspaceRoot } = require('./paths');
const targetDir = workspaceRoot || projectDir;

const userGitIgnorePath = path.resolve(targetDir, '.gitignore');
const gitIgnorePath = path.resolve(__dirname, '../../../config/gitignore.txt');
const sharedGitIgnoreRegExp = /# Created by https:\/\/www.gitignore.io.+[^]+# End of next-pack/;

(() => {
  const hasUserGitIgnore = fs.existsSync(userGitIgnorePath);
  if (!hasUserGitIgnore) shell.touch(userGitIgnorePath);
  const userGitIgnore = fs.readFileSync(userGitIgnorePath, 'utf8');
  const userSharedGitIgnore = (
    userGitIgnore.match(sharedGitIgnoreRegExp) || []
  ).pop();
  const gitIgnore = fs.readFileSync(gitIgnorePath, 'utf8');
  const sharedGitIgnore = gitIgnore.match(sharedGitIgnoreRegExp).pop();

  if (userSharedGitIgnore === sharedGitIgnore) return;

  // Create .gitignore in project root
  // Update text between # Created by ~ # End of next-pack
  fs.writeFileSync(
    userGitIgnorePath,
    `${sharedGitIgnore.trim()}\n\n${userGitIgnore
      .replace(userSharedGitIgnore, '')
      .trim()}`.trim()
  );
})();
