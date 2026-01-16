import { MeshBasicMaterial } from "three" 

export interface SceneState {
	stateName: string
	material: MeshBasicMaterial
	path: Coordinates []
}

export interface Coordinates {
	prox: string
	x: number
	y: number
	z: number
}
