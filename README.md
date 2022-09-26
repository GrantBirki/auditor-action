# auditor-action 👮

> *The Auditor*

A GitHub Action that audits changes made in a pull request, using a customizable configuration.

## About 💡

> This is a composite GitHub Action which does a few things under the hood. It will be explained in this section

**The Auditor** looks at every single line of changes in a pull request and then audits each line based on a custom configuration which you provide to it. The config file contains a rule set of string and regex matches to look for violations on each line of the diff. If a violation is found, The Auditor will comment on the pull request with your custom violation message and a link to the line of code where the violation was found.

All the collective pieces that make up this composite Action are referred to as **The Auditor**

### How It Works 🔨

As mentioned earlier, The Auditor is a composite GitHub Action. This means that it is composed of multiple GitHub Actions that work together. In fact, the Actions that it is composed of, were designed specifcally for this purpose.

Below is a high level over view of how this composite Action works:

1. [actions/checkout](https://github.com/actions/checkout) is called and checks out your entire repository
2. [GrantBirki/git-diff-action](https://github.com/GrantBirki/git-diff-action) is called and a diff in JSON format is generated for the pull request
3. [GrantBirki/auditor-action-core](https://github.com/GrantBirki/auditor-action-core) is called and the JSON diff from the previous step is passed into the `auditor-action-core` Action
4. The `auditor-action-core` Action reads your `auditor.yml` config file and audits the diff for violations
5. If violations are found, the `auditor-action-core` Action will comment on the pull request with your custom violation message and a link to the line of code where the violation was found

The composite Action will either pass or fail based on the inputs you provide it. You can optionally disable the comment feature as well if necessary. Please see the [Inputs](#inputs-) section for more information.

> It should be noted that this Action **only** works for pull requests. It will not work properly in any other Actions context

## Inputs 📥

Rather than using Actions inputs, this Action component uses environment variables for configuration to make local testing easier

| Name | Required? | Default | Description |
| --- | --- | --- | --- |
| `config` | yes | `auditor.yml` | The path to the [`auditor.yml`](#configuration-) configuration file |
| `json_diff_path` | yes | `git-diff-action-output.json` | The path to the JSON diff file to load (provided for you) |
| `alert_level` | yes | `fail` | The alert level to use when reporting violations. Can be `fail` or `warn` |
| `COMMENT_ON_PR` | yes | `true` | Whether or not to comment on the PR. Can be `true` or `false` |

## Configuration 📝

The following is an example of an `auditor.yml` configuration file will all available options:

### Configuration Options

```yaml
# rules is an array of auditor 'rules' that will be used to detect violations
rules: # array of rules
  - name: <string> # the name of the rule
    type: <string-exact|string-case-insensitive|regex> # the type of rule
    pattern: <string> # the matching pattern to use
    message: <string> # the message to display if a match is found

# global configuration options
global_options:
  exclude_auditor_config: <boolean> # exclude the auditor config file from the audit (this file) - default is true
  exclude_regex: # array of regex patterns to exclude files from the audit globally
   - <string> # the regex pattern to exclude
   - <string> # the regex pattern to exclude (can have multiple)
   - <string> # ... (do as many as you want!)
```

### Live Example

Below is a live example (truly just an example) of what your `auditor.yml` file might look like:

```yaml
# rules is an array of auditor 'rules' that will be used to detect violations
rules:
  - name: "Root User Detected" # the name of the rule
    type: string-exact # an exact string match - case sensitive
    pattern: "user root" # the string to match on
    message: root user detected - this is not allowed, please try again # the message to display if a match is found

  - name: "Root User Detected - Case Insensitive"
    type: string-case-insensitive # a case insensitive string match
    pattern: "UseR rOoT"
    message: root user detected - nice try...

  - name: "Root User Detected - Regex"
    type: regex # a regular expression match (regex)
    pattern: "user\\s+root" # the regex pattern to use for matching (global matchl for the line contents)
    message: root user detected - gotcha with regex

  - name: "should not find anything"
    type: regex
    pattern: "p{100}"
    message: this should not match anything - if it did I broke

# global configuration options
global_options:
  # exclude_auditor_config: false # exclude the auditor config file from the audit (this file) - default is true
  exclude_regex: # list of regex patterns to exclude files from the audit globally
   - "\\.md$"
```
