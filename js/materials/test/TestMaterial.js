import { RawShaderMaterial } from 'three'
import store from '../../store'

import vertexShader from './vert'
import fragmentShader from './frag'

export default class BasicMaterial extends RawShaderMaterial {
	constructor() {
		super({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: store.WebGL.globalUniforms.uTime
			}
		})
	}
}