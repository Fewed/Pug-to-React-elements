const presets = [
  [
    "@babel/env",
    {
      targets: {
        ie: "10"
      },
      useBuiltIns: "usage"
    }
  ]
];

module.exports = { presets };
