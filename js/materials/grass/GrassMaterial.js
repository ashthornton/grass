import { DoubleSide, RawShaderMaterial, Vector3 } from 'three'

import vertexShader from './vert'
import fragmentShader from './frag'

export default class GrassMaterial extends RawShaderMaterial {
	constructor(options) {
		super({
			vertexShader,
			fragmentShader,
			uniforms: {
				mouse: { value: new Vector3() },
				time: { value: 0 },
				blade: { value: options.texture },
				noise: { value: options.noise },
				matcap: { value: options.matcap }
			},
			side: DoubleSide,
			transparent: true
		})
	}
}