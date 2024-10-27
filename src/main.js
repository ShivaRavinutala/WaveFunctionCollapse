// debug with extreme prejudice
"use strict"


let config = {
	parent: 'phaser-game',
	type: Phaser.CANVAS,
	width: 30 * 64,
	height: 30 * 64,
	zoom: 0.25,
	autoCenter: true,
	render: {
		pixelArt: true 		// prevent pixel art from getting blurred when scaled
	},
	scene: [WaveFunctionCollapseGeneration]
}

const game = new Phaser.Game(config);