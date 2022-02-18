import { Color, Fog, InstancedMesh, MathUtils, Matrix4, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneBufferGeometry, Raycaster, RepeatWrapping, Scene, Vector3 } from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import GrassMaterial from '../materials/grass/GrassMaterial'

export default class MainScene extends Scene {
	constructor() {
		super()

		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 0.1, 50)
		this.camera.position.z = 1
		this.camera.position.y = -3

		this.background = new Color(0x000000)
		this.fog = new Fog(0x000000, this.camera.near, this.camera.far)

		this.controls = new OrbitControls(this.camera, store.WebGL.renderer.domElement)
		this.controls.enableDamping = true

		this.raycaster = new Raycaster()
		this.pointerVec = new Vector3()

		this.load()

		E.on('App:start', () => {
			this.build()
			this.addEvents()
		})
	}

	build() {
		this.floor = new Mesh(
			new PlaneBufferGeometry(4, 4),
			new MeshBasicMaterial({ color: 0x000000 })
		)

		this.add(this.floor)

		this.buildGrass()
	}

	buildGrass() {
		const geometry = new PlaneBufferGeometry(0.01, 1, 2, 10)
		const trans = new Matrix4().makeTranslation(0, -0.5, 0)
		geometry.applyMatrix4(trans)
		const rot = new Matrix4().makeRotationX(-Math.PI / 2)
		geometry.applyMatrix4(rot)

		const vertices = geometry.attributes.position.array
		for (let i = 0; i < vertices.length; i += 3) {
			if (vertices[i + 0] === 0) {
				vertices[i + 1] = 0.005
			}
		}

		const count = 20000
		const _position = new Vector3()
		const sampleGeometry = this.floor.geometry.clone().toNonIndexed()
		const sampleMesh = new Mesh(sampleGeometry)
		const sampler = new MeshSurfaceSampler(sampleMesh).build()

		this.grass = new InstancedMesh(
			geometry,
			new GrassMaterial({
				texture: this.assets.textures.blade,
				noise: this.assets.textures.noise,
				matcap: this.assets.textures.matcap
			}),
			count
		)

		const instanceDummy = new Object3D()

		for (let i = 0; i < count; i++) {
			sampler.sample(_position)

			instanceDummy.position.copy(_position)
			instanceDummy.scale.set(1, 1, 0.15)
			instanceDummy.rotation.y = MathUtils.randFloat(-0.5, 0.5)
			instanceDummy.updateMatrix()

			this.grass.setMatrixAt(i, instanceDummy.matrix)

			this.grass.setColorAt(
				i,
				new Vector3(i, (i % 256) / 256, Math.floor(i / 256) / 256)
			)
		}

		this.add(this.grass)
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 3)
	}

	onRaf = (time) => {
		this.controls.update()

		this.raycaster.setFromCamera(store.pointer.glNormalized, this.camera)
		const intersects = this.raycaster.intersectObject(this.floor)

		if (intersects.length) {
			this.pointerVec.copy(intersects[0].point)
			const n = intersects[0].point.clone()
			this.grass.material.uniforms.mouse.value.copy(this.pointerVec).add(n.multiplyScalar(0.05))
		}

		this.grass.material.uniforms.time.value = time

		store.WebGL.renderer.render(this, this.camera)
	}

	onResize = () => {
		this.camera.aspect = store.window.w / store.window.h
		this.camera.updateProjectionMatrix()
	}

	load() {
		this.assets = {
			textures: {},
			models: {}
		}

		store.AssetLoader.loadTexture('/assets/images/blade.jpg').then(texture => {
			this.assets.textures.blade = texture
		})

		store.AssetLoader.loadTexture('/assets/images/grass-matcap.jpg').then(texture => {
			this.assets.textures.matcap = texture
		})

		store.AssetLoader.loadTexture('/assets/images/gradient-noise.jpg', { wrapping: RepeatWrapping }).then(texture => {
			this.assets.textures.noise = texture
		})
	}
}