# semantic-release-elixir

[semantic-release](https://github.com/semantic-release/semantic-release) plugin for managing Elixir apps versions.

Step | Description
------------ | -------------
`verifyConditions` | Locate and validate `VERSION` file.
`prepare` | Update the version in `VERSION` file.

## Install

```
npm install semantic-release-elixir -D
```

## Usage

Add the plugin to the [semantic-release configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "semantic-release-elixir",
  ]
}
```

## Publishing

It publishes automatically if you follow semantic-release comments style.