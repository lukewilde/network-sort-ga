# Network Organising Genetic Algorithm

A GA capable of simplifying the visual organisation of networks of nodes from configuration in JSON.

## Method

The GA initially uses genetic pooling in an attempt to select a number of relatively untangled networks, during this process they ignore network size and mutate heavily. After the pooling phase, a new population is generated from the highest scoring networks. This population mutates more frequently, but with much less magnitude than the pooling phase.

## Ranking

Networks are scored using the following metrics:

* Euclidean distance of lines between all nodes.
* Area of nodes overlapping, including a padding area.
* Line intersections.
* Lines that intersect with other nodes.
* Nodes which are out of bounds.

## Installing

### Node.js and Grunt

You will need to first install [Node.js](http://nodejs.org/download/) and the grunt-cli: `npm install -g grunt-cli`.

### Available Targets

#### `grunt`

Configures and runs an unminified development build optimised for fast watch performance with source maps and live reload.

#### `grunt build`

Creates an uglified, production ready build with no source maps.

#### `grunt optimise`

Lossy compression of all png's in the `src/images/` directory using [pngquant](http://pngquant.org/).

(Linux users will need to have a version of pngquant available on their paths.)

#### `grunt zip`

Compiles the current build into `{title}.zip` with an internal folder. This is intended for use when transferring the build to a third party for webserver upload.

#### `grunt cocoon`

Compiles the current build into `{title}.zip` ready for upload to [CocoonJs](https://www.ludei.com/cocoonjs/).

### Coding Style and Linting

I follow [Ben Gourley's JavaScript Style Guide](https://github.com/bengourley/js-style-guide) (with the exception of using semicolons). I've kept the code footprint low so you can easily include your own `.jshintrc`.

## Created with contributions and inspiration from

  * [Craig Beswetherick](http://grindheadgames.com)
  * [Jesse Freeman's Phaser template](https://github.com/gamecook/phaser-project-template)
  * The retired https://github.com/luizbills/phaser-js-boilerplate
