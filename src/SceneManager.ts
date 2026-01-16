
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Coordinates, SceneState } from './SceneState'
import { LoadingScreenManager } from './LoadingScreenManager';
import { positionGetter } from './utils';
import { ClickManeger } from './ClickManager';




export class SceneManager {
	private readonly controls: OrbitControls
	private readonly loadingScreenManager = LoadingScreenManager.INSTANCE 
	private readonly scene: THREE.Scene
	private readonly renderer: THREE.WebGLRenderer
	private buttonRight: THREE.Mesh | undefined
	private buttonLeft: THREE.Mesh | undefined
	private currentSkyBox: THREE.Mesh | undefined
	private loadedSalas: number
	readonly camera: THREE.PerspectiveCamera
	readonly mouse: THREE.Vector2
	readonly salaPath: Map<string, SceneState>
	buttons: THREE.Mesh[]
	//private readonly raycaster = new THREE.Raycaster()
	sceneState: SceneState | undefined;

	constructor() {
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.renderer = new THREE.WebGLRenderer()
		this.controls = this.createControls()
		this.mouse = new THREE.Vector2()
		this.salaPath = new Map();
		this.loadedSalas = 0
		this.camera.position.z = 1;
		this.buttons = []
		

		this.renderer.setAnimationLoop(() => this.renderer.render(this.scene, this.camera))
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.init()

		ClickManeger.INSTANCE.sceneManager = this
		ClickManeger.INSTANCE.enableClickEvent()

	}

	private init() {

		window.onresize = this.resize.bind(this)
		document.addEventListener('mousemove', this.mouseMove.bind(this), false)

		document.body.appendChild(this.renderer.domElement)

		this.load()
		this.sceneState = this.salaPath.get('sala-1')
		
		this.loadingScreenManager.beginLoading()
	}

	private async load() {
		this.salaPath.set('sala-1', { stateName: 'sala-1', material: this.loadMaterial('sala-1'), path: [{ prox: 'sala-2', x: 0.014037125161884753, y: -0.1312002660389065, z: -0.9912565002604067}, { prox: 'sala-7', x: 0.5712055958129546, y: -0.0024383980827187932, z: 0.8208034000458073} ] })
		this.salaPath.set('sala-2', { stateName: 'sala-2', material: this.loadMaterial('sala-2'), path: [{ prox: 'sala-1', x: 0.11931521853102935, y: -0.017016097141950372, z: 0.9927105978405533 }, { prox: 'sala-3', x: 0.08742217961029575, y: 0.0038907124492692123, z: -0.9961637540428894 }] })
		this.salaPath.set('sala-3', { stateName: 'sala-3', material: this.loadMaterial('sala-3'), path: [{ prox: 'sala-2', x: 0.9994761760438152, y: 0.012749025922397387, z: 0.029746190661369406 }, { prox: 'sala-4', x: 0.0016124191490489547, y: -0.04017733189994102, z: -0.9991912640260071 }] })
		this.salaPath.set('sala-4', { stateName: 'sala-4', material: this.loadMaterial('sala-4'), path: [{ prox: 'sala-3', x: -0.3010515445337364, y: 0.03133616228951319, z: 0.9530928666540407 }, { prox: 'sala-5', x: 0.9770812032275593, y: -0.0032291553547146544, z: 0.212842417894272 }] })
		this.salaPath.set('sala-5', { stateName: 'sala-5', material: this.loadMaterial('sala-5'), path: [{ prox: 'sala-4', x: 0.15249700464722143, y: -0.04180717281100418, z: 0.9874192746119433 }, { prox: 'sala-6', x: 0.07269717060467756, y: -0.020581301092336014, z: -0.9971416807211608 }] })
		this.salaPath.set('sala-6', { stateName: 'sala-6', material: this.loadMaterial('sala-6'), path: [{ prox: 'sala-5', x: 0.17822299534875732, y: -0.08024040975514948, z: 0.9807130266144335}, { prox: 'sala-7', x: 0.32849138925292004, y: -0.025802457324702023, z: -0.9441544579054284 }] })
		this.salaPath.set('sala-7', { stateName: 'sala-7', material: this.loadMaterial('sala-7'), path: [{ prox: 'sala-6', x: 0.7545973852733406, y: -0.09112020437217606, z: 0.6498306660152401 }, { prox: 'sala-1', x: 0.8414667900676964, y: -0.05837895639903608, z: -0.5371457331701768}] })

	}

	private createControls(): OrbitControls {
		const controls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.enableDamping = true
		controls.rotateSpeed = -0.5
		controls.enableRotate = true
		controls.zoomSpeed = 0
		controls.dampingFactor = 0.05

		controls.addEventListener('change', (e) => {
			this.buttons.forEach(b => {
				b.quaternion.copy(this.camera.quaternion)
			})
		})
		return controls
	}


	private createButton({prox, x, y, z}: Coordinates): THREE.Mesh {

		const geometry = new THREE.CircleGeometry(30)
		const navigation = new THREE.Mesh(geometry, this.loadMaterial('navigator', 'png'))
		navigation.material.transparent = true
		navigation.quaternion.copy(this.camera.quaternion)
		navigation.position.y = y * 450
		navigation.position.x = x * 450 
		navigation.position.z = z * 450
		navigation.name = prox

		return navigation		
	}

	private createAllButtons() {

		this.buttons.forEach(b => this.scene.remove(b))
		this.buttons = []

		this.sceneState!.path.forEach(p => {
			const button = this.createButton(p)
			this.scene.add(button)
			this.buttons.push(button)
		})
		
		
	}

	private createEnvironment() {
		const geometry = new THREE.SphereGeometry(500, 60, 40);
		geometry.scale(1, 1, -1)
		const material = this.sceneState!.material
		const skyBox = new THREE.Mesh(geometry, material)
		if (this.currentSkyBox) {
			this.scene.remove(this.currentSkyBox)
		}

		this.scene.add(skyBox)
		this.currentSkyBox = skyBox
		this.camera.lookAt(new THREE.Vector3(55))
		this.controls.target =new THREE.Vector3(55)
		
		document.addEventListener('click', (e: MouseEvent) => positionGetter(e, this.mouse, this.camera, skyBox))

		this.createAllButtons()
	
		//this.controls.update()
	}

	private mouseMove(e: MouseEvent) {
		this.mouse.set((e.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
		-(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1)
	}

	private resize() {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	private loadMaterial(name: string, fileType: string = 'JPG'): THREE.MeshBasicMaterial {
		const texture = new THREE.TextureLoader().load(`./assets/${name}.${fileType}`, this.salasCounter.bind(this))
		texture.colorSpace = THREE.SRGBColorSpace;

		return new THREE.MeshBasicMaterial({ map: texture });
	}


	private salasCounter() {
		this.loadedSalas++

		if (this.loadedSalas == 7) {
			this.createEnvironment()
			this.loadingScreenManager.endLoading()
		}
	}


	changeSkyBox() {
		if (this.currentSkyBox && this.sceneState?.material) {
			this.currentSkyBox.material = this.sceneState.material
			this.createAllButtons()
		}
	}
}