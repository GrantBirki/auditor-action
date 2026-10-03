const assert = require('node:assert/strict')
const fs = require('node:fs')

assert.equal(fs.existsSync('diff.json'), false, 'the composite must remove the diff')
assert.equal(
  fs.existsSync('$ {{ inputs.write_results_path }}'),
  false,
  'the report path must not be a literal expression'
)

if (process.argv[2] === 'disabled') {
  assert.equal(fs.existsSync('results.md'), false, 'the default must disable reports')
} else {
  const line = fs.readFileSync('action.yml', 'utf8').split('\n')
    .findIndex(value => value.includes('uses: GrantBirki/auditor-action-core@')) + 1
  assert.ok(line > 0)
  assert.equal(fs.readFileSync('results.md', 'utf8'),
    '### Auditor Results ⚠️\n\nThe **Auditor** has detected findings in your pull request\n\n' +
    '- Alert 1\n  - **Rule**: core-pin\n  - **Message**: The core pin changed\n' +
    `  - File: \`action.yml\`\n  - Line: [\`${line}\`](https://github.com/action.yml#L${line})\n` +
    '  - Rule Type: `string-exact`\n  - Rule Pattern: `GrantBirki/auditor-action-core@`\n\n'
  )
}
