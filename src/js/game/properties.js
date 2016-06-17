var npmProperties = require('../../../package.json');

module.exports =
  { title: 'Network Sort'
  , description: npmProperties.description
  , port: 3017
  , liveReloadPort: 3018
  , mute: false
  , showStats: true
  , disableCharts: true
  , size:
    { x: 900
    , y: 700
    }
  , analyticsId: 'UA-50892214-2'
  };
