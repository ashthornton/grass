import { ShaderChunk } from 'three'
import { glslifyStrip } from '../utils'
import defaultVert from '../../glsl/includes/default/vert'
import defaultFrag from '../../glsl/includes/default/frag'
import normalsVert from '../../glsl/includes/normals/vert'

import BasicMaterial from './basic/BasicMaterial'
import TestMaterial from './test/TestMaterial'

// Shader #include chunks
ShaderChunk.defaultVert = glslifyStrip(defaultVert)
ShaderChunk.defaultFrag = glslifyStrip(defaultFrag)
ShaderChunk.normalsVert = glslifyStrip(normalsVert)

export {
	BasicMaterial, TestMaterial
}