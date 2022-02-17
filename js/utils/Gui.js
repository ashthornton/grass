import { Pane } from 'tweakpane'
import store from '../store'

export class Gui extends Pane {
	constructor() {
		super({
			title: 'Options'
		})

		this.options = {}

		this.initTorus()
	}

	initTorus() {
		this.options.torus = {
			position: store.WebGL.scene.torus.position
		}
		this.addInput(this.options.torus, 'position')
	}
}