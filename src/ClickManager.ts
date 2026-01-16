import * as THREE from 'three'
import { SceneManager } from './SceneManager'

export class ClickManeger {
	public static readonly INSTANCE = new ClickManeger()
	private readonly raycaster = new THREE.Raycaster()
	private _sceneManager: SceneManager | undefined

	private constructor() {
		if (ClickManeger.INSTANCE) {
			return ClickManeger.INSTANCE
		}
	}

	set sceneManager(sceneManager: SceneManager) {
		this._sceneManager = sceneManager
	}

	private navigationAction(intersection: THREE.Intersection) {
		if (this._sceneManager!.salaPath.has(intersection.object.name)) {
			this._sceneManager!.sceneState = this._sceneManager!.salaPath.get(intersection.object.name)!
			this._sceneManager!.changeSkyBox()
		}
	}


	public enableClickEvent() {
		if (this._sceneManager) {
			document.addEventListener('click', () => {
				//console.log(CompassManager.INSTANCE.direction)
				this.raycaster.setFromCamera(this._sceneManager!.mouse, this._sceneManager!.camera)
				this._sceneManager!.buttons.forEach(b => {
					this.raycaster.intersectObject(b).forEach(this.navigationAction.bind(this))
				})
			})
		}
	}
}