import { RawShaderMaterial } from 'three'

import vertexShader from './vert'
import fragmentShader from './frag'

export default class BasicMaterial extends RawShaderMaterial {
	constructor() {
		super({
			vertexShader,
			fragmentShader
		})
	}
}