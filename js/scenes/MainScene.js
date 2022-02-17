import { Color, Fog, Mesh, PerspectiveCamera, Scene, TorusKnotBufferGeometry } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BasicMaterial } from '../materials'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'

export default class MainScene extends Scene {
	constructor() {
		super()

		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 0.1, 50)
		this.camera.position.z = 10

		this.background = new Color(0x000000)
		this.fog = new Fog(0x000000, this.camera.near, this.camera.far)

		this.controls = new OrbitControls(this.camera, store.WebGL.renderer.domElement)
		this.controls.enableDamping = true

		this.load()

		E.on('App:start', () => {
			this.build()
			this.addEvents()
		})
	}

	build() {
		this.torus = new Mesh(
			new TorusKnotBufferGeometry(1, 0.4, 132, 16),
			new BasicMaterial()
		)

		this.add(this.torus)
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 3)
	}

	onRaf = () => {
		this.controls.update()
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
	}
}