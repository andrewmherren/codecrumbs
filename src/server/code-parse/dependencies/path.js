const convertRelativeToAbsolutePath = (base, relative = '') => {
  const stack = base.split('/'),
    parts = relative.split('/');

  // TODO: here also webpack paths/aliases could be, now skip 'react', etc
  if (parts.length <= 1) {
    return null;
  }

  stack.pop();

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '.') continue;
    if (parts[i] === '..') stack.pop();
    else stack.push(parts[i]);
  }

  return stack.join('/');
};

module.exports = {
  convertRelativeToAbsolutePath
};
