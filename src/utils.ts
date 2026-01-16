import * as THREE from "three"

export const positionGetter = (e: MouseEvent, mouse: THREE.Vector2, camera: THREE.Camera, skyBox: THREE.Mesh) => {
	const raycaster = new THREE.Raycaster() 
			raycaster.setFromCamera(mouse, camera)
			if (raycaster.intersectObject(skyBox)) {
				navigator.clipboard.writeText(`x: ${raycaster.ray.direction.x}, y: ${raycaster.ray.direction.y}, z: ${raycaster.ray.direction.z}`);
			}
}