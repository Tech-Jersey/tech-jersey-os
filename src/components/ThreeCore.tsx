'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── MESSAGE DEFINITIONS ──────────────────────────────────────────────
const MESSAGES = [
  { platform: 'User Query', color: '#4F9CF9', icon: '?', sender: 'Lead 204', text: 'Integrate AI chatbot?' },
  { platform: 'System', color: '#25D366', icon: '✓', sender: 'Core Logic', text: 'Onboarding flow activated' },
  { platform: 'System', color: '#25D366', icon: '✓', sender: 'Core Logic', text: 'System qualification check complete' },
  { platform: 'Inquiry', color: '#4F9CF9', icon: '?', sender: 'Lead 309', text: 'Can this connect to our CRM?' },
]

function makeCardTexture(msg: typeof MESSAGES[0]): THREE.CanvasTexture {
  const W = 560, H = 180
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const c = cv.getContext('2d')!

  c.fillStyle = '#0d0d1e'
  c.beginPath()
  // @ts-ignore
  if (c.roundRect) c.roundRect(4, 4, W - 8, H - 8, 16)
  else c.rect(4, 4, W - 8, H - 8)
  c.fill()

  c.strokeStyle = msg.color; c.lineWidth = 3
  c.beginPath()
  // @ts-ignore
  if (c.roundRect) c.roundRect(4, 4, W - 8, H - 8, 16)
  else c.rect(4, 4, W - 8, H - 8)
  c.stroke()

  const stripe = c.createLinearGradient(0, 0, 0, H)
  stripe.addColorStop(0, msg.color); stripe.addColorStop(1, msg.color + '55')
  c.fillStyle = stripe; c.fillRect(4, 4, 8, H - 8)

  const grad = c.createRadialGradient(58, 55, 0, 58, 55, 26)
  grad.addColorStop(0, msg.color); grad.addColorStop(1, msg.color + '99')
  c.fillStyle = grad
  c.beginPath(); c.arc(58, 55, 26, 0, Math.PI * 2); c.fill()

  c.fillStyle = '#ffffff'; c.font = 'bold 26px Arial'
  c.textAlign = 'center'; c.fillText(msg.icon, 58, 65); c.textAlign = 'left'

  c.fillStyle = msg.color; c.font = 'bold 19px Arial'; c.fillText(msg.platform, 98, 38)
  c.fillStyle = '#7788aa'; c.font = '15px Arial'; c.fillText(msg.sender, 98, 60)

  c.strokeStyle = '#1e1e35'; c.lineWidth = 1
  c.beginPath(); c.moveTo(20, 82); c.lineTo(W - 20, 82); c.stroke()

  c.fillStyle = '#dde0f8'; c.font = '600 20px Arial'
  const maxW = W - 36; let line = '', y = 118
  for (const word of msg.text.split(' ')) {
    const test = line + word + ' '
    if (c.measureText(test).width > maxW && line) {
      c.fillText(line.trim(), 20, y); line = word + ' '; y += 26
      if (y > H - 12) break
    } else line = test
  }
  if (y <= H - 10) c.fillText(line.trim(), 20, y)

  return new THREE.CanvasTexture(cv)
}

export default function ThreeCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ─────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x04040a, 0.015)

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 200)
    
    // Default Camera Pos for Hero
    const CAM_HERO_Y = 0.5
    const CAM_HERO_Z = 14
    // Camera Pos for City
    const CAM_CITY_Y = -35
    const CAM_CITY_Z = 20

    camera.position.set(2.5, CAM_HERO_Y, CAM_HERO_Z)

    // ── Lighting ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.45))
    const frontKey = new THREE.DirectionalLight(0xffffff, 2.2)
    frontKey.position.set(2, 5, 12); scene.add(frontKey)
    const neonFill = new THREE.PointLight(0x00ffff, 4, 25) // Blue neon reflection
    neonFill.position.set(0, 1, 6); scene.add(neonFill)

    // ── Materials ─────────────────────────────────────────────────
    // Sleek, brushed gunmetal
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x2b2b36, metalness: 0.95, roughness: 0.35, clearcoat: 0.1 })
    // Glowing circuitry
    const circuitMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: new THREE.Color(0x00ffff), emissiveIntensity: 2.0 })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x090912, metalness: 0.85, roughness: 0.18 })
    const eyeMatL = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: new THREE.Color(0x00ffff), emissiveIntensity: 2.8 })
    const eyeMatR = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: new THREE.Color(0x00ffff), emissiveIntensity: 2.8 })

    const mk = (g: THREE.BufferGeometry, m: THREE.Material): THREE.Mesh => {
      const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; return mesh
    }

    // ── ROBOT GROUP (Y=0) ─────────────────────────────────────────
    const robot = new THREE.Group()
    robot.position.set(2.5, -0.5, 0)
    scene.add(robot)

    const torso = mk(new THREE.BoxGeometry(1.55, 1.8, 1.1, 2, 2, 2), bodyMat)
    torso.position.set(0, 0.3, 0); robot.add(torso)
    const panel = mk(new THREE.BoxGeometry(1.05, 1.15, 0.09), darkMat)
    panel.position.set(0, 0.38, 0.61); robot.add(panel)
    // Circuitry inside chest
    const chestCircuit = mk(new THREE.BoxGeometry(0.8, 0.9, 0.12), circuitMat)
    chestCircuit.position.set(0, 0.38, 0.60); robot.add(chestCircuit)

    // Arms with visible glowing joints
    const leftArmGrp = new THREE.Group(); leftArmGrp.position.set(-1.0, 1.0, 0); robot.add(leftArmGrp)
    const lJoint = mk(new THREE.SphereGeometry(0.3, 16, 16), circuitMat); leftArmGrp.add(lJoint)
    const lUArm = mk(new THREE.CylinderGeometry(0.22, 0.18, 1.0, 12), bodyMat); lUArm.position.y = -0.5; leftArmGrp.add(lUArm)
    const lElbow = mk(new THREE.SphereGeometry(0.2, 16, 16), circuitMat); lElbow.position.y = -1.0; leftArmGrp.add(lElbow)
    const lFArm = mk(new THREE.CylinderGeometry(0.18, 0.14, 0.9, 10), bodyMat); lFArm.position.y = -1.55; leftArmGrp.add(lFArm)
    
    const rightArmGrp = new THREE.Group(); rightArmGrp.position.set(1.0, 1.0, 0); robot.add(rightArmGrp)
    const rJoint = mk(new THREE.SphereGeometry(0.3, 16, 16), circuitMat); rightArmGrp.add(rJoint)
    const rUArm = mk(new THREE.CylinderGeometry(0.22, 0.18, 1.0, 12), bodyMat); rUArm.position.y = -0.5; rightArmGrp.add(rUArm)
    const rElbow = mk(new THREE.SphereGeometry(0.2, 16, 16), circuitMat); rElbow.position.y = -1.0; rightArmGrp.add(rElbow)
    const rFArm = mk(new THREE.CylinderGeometry(0.18, 0.14, 0.9, 10), bodyMat); rFArm.position.y = -1.55; rightArmGrp.add(rFArm)

    // Head
    const headGrp = new THREE.Group(); headGrp.position.set(0, 1.95, 0); robot.add(headGrp)
    const headMain = mk(new THREE.BoxGeometry(1.3, 1.1, 1.05, 2, 2, 2), bodyMat); headGrp.add(headMain)
    const eyeG = new THREE.SphereGeometry(0.155, 14, 14)
    const eyeL = mk(eyeG, eyeMatL); eyeL.position.set(-0.24, 0.07, 0.58); headGrp.add(eyeL)
    const eyeR = mk(eyeG, eyeMatR); eyeR.position.set(0.24, 0.07, 0.58);  headGrp.add(eyeR)

    // Hologram Screen
    const holoScreen = new THREE.Group()
    holoScreen.position.set(-1.4, 0.5, 2.2)
    holoScreen.rotation.y = Math.PI / 8
    robot.add(holoScreen)

    const holoGeo = new THREE.PlaneGeometry(3.8, 2.4)
    const holoMat = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15, side: THREE.DoubleSide, roughness: 0.1, transmission: 0.95 })
    holoScreen.add(new THREE.Mesh(holoGeo, holoMat))
    
    const holoEdges = new THREE.EdgesGeometry(holoGeo)
    const holoLine = new THREE.LineSegments(holoEdges, new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 }))
    holoScreen.add(holoLine)

    // Cards
    const cardMeshes = MESSAGES.map(msg => {
      const m = mk(new THREE.PlaneGeometry(3.6, 1.15), new THREE.MeshStandardMaterial({ map: makeCardTexture(msg), transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }))
      m.visible = false; scene.add(m); return m
    })

    // ── CITY / SHOPS GROUP (Y=-30) ──────────────────────────────────
    const cityGrp = new THREE.Group()
    cityGrp.position.set(0, -35, 0)
    scene.add(cityGrp)

    const cityBaseGeo = new THREE.PlaneGeometry(100, 100)
    const cityBaseMat = new THREE.MeshStandardMaterial({ color: 0x020205, roughness: 0.8, metalness: 0.2 })
    const cityBase = new THREE.Mesh(cityBaseGeo, cityBaseMat)
    cityBase.rotation.x = -Math.PI / 2
    cityGrp.add(cityBase)

    // Generate Shop Storefronts (Center)
    const bldGeo = new THREE.BoxGeometry(1, 1, 1)
    const bldMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.8, roughness: 0.2 })
    const bldEdgeMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 })
    
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 30
      const z = (Math.random() - 0.5) * 30
      if (Math.abs(x) < 4 && Math.abs(z) < 4) continue // clear center
      
      const h = 2 + Math.random() * 6
      const w = 2 + Math.random() * 3
      const d = 2 + Math.random() * 3
      
      const bld = new THREE.Mesh(bldGeo, bldMat)
      bld.scale.set(w, h, d)
      bld.position.set(x, h/2, z)
      cityGrp.add(bld)

      const edges = new THREE.EdgesGeometry(bldGeo)
      const lines = new THREE.LineSegments(edges, bldEdgeMat)
      bld.add(lines)
    }

    // Trash Can for Waste
    const trashMat = new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.7, roughness: 0.5 })
    const trashGrp = new THREE.Group()
    trashGrp.position.set(-18, 0, 5) // Left side
    const trashBase = mk(new THREE.CylinderGeometry(2.5, 2, 4, 16), trashMat)
    trashBase.position.y = 2
    trashGrp.add(trashBase)
    const trashIconGeo = new THREE.PlaneGeometry(2, 2)
    const trashIconCanvas = document.createElement('canvas')
    trashIconCanvas.width = 128; trashIconCanvas.height = 128
    const tc = trashIconCanvas.getContext('2d')!
    tc.fillStyle = '#ff4444'; tc.font = '80px Arial'; tc.textAlign = 'center'; tc.fillText('🗑️', 64, 96)
    const trashIconMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(trashIconCanvas), transparent: true })
    const trashIcon = new THREE.Mesh(trashIconGeo, trashIconMat)
    trashIcon.position.set(0, 4.5, 0)
    trashGrp.add(trashIcon)
    cityGrp.add(trashGrp)

    // Traffic Particles: LEADS (Green)
    const LEADS_COUNT = 300
    const lPos = new Float32Array(LEADS_COUNT * 3)
    const lSpeed = new Float32Array(LEADS_COUNT)
    for(let i=0; i<LEADS_COUNT; i++) {
      lPos[i*3] = (Math.random() - 0.5) * 40
      lPos[i*3+1] = 0.5 
      lPos[i*3+2] = (Math.random() - 0.5) * 40
      lSpeed[i] = 0.1 + Math.random() * 0.2
    }
    const lGeo = new THREE.BufferGeometry()
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3))
    const lMat = new THREE.PointsMaterial({ color: 0x00ffaa, size: 0.4, transparent: true, opacity: 0.9 })
    const leadsPts = new THREE.Points(lGeo, lMat)
    cityGrp.add(leadsPts)

    // Traffic Particles: WASTE (Red/Grey)
    const WASTE_COUNT = 150
    const wPos = new Float32Array(WASTE_COUNT * 3)
    const wSpeed = new Float32Array(WASTE_COUNT)
    for(let i=0; i<WASTE_COUNT; i++) {
      wPos[i*3] = -10 + (Math.random() - 0.5) * 20 // Start mostly on left side
      wPos[i*3+1] = 0.5 
      wPos[i*3+2] = (Math.random() - 0.5) * 40
      wSpeed[i] = 0.05 + Math.random() * 0.15
    }
    const wGeo = new THREE.BufferGeometry()
    wGeo.setAttribute('position', new THREE.BufferAttribute(wPos, 3))
    const wMat = new THREE.PointsMaterial({ color: 0xff4444, size: 0.3, transparent: true, opacity: 0.7 })
    const wastePts = new THREE.Points(wGeo, wMat)
    cityGrp.add(wastePts)

    // ── STATE MACHINE ─────────────────────────────────────────────
    type Phase = 'idle' | 'flying' | 'reading_typing' | 'replying'
    let phase: Phase = 'idle'
    let phaseTime = 0, msgIndex = 0, activeCard: THREE.Mesh | null = null
    const flyStart = new THREE.Vector3()
    const flyArrival = new THREE.Vector3()

    const launchNext = () => {
      const idx = msgIndex % MESSAGES.length
      const card = cardMeshes[idx]
      // Spawn from all angles: random X (-15 to +15), random Y (4 to 12), random Z (-8 to 2)
      const spX = (Math.random() - 0.5) * 30
      const spY = 4 + Math.random() * 8
      const spZ = -8 + Math.random() * 10
      const sp = new THREE.Vector3(spX, spY, spZ)
      
      card.position.copy(sp); card.visible = true; card.scale.setScalar(1)
      ;(card.material as THREE.MeshStandardMaterial).opacity = 0
      flyStart.copy(sp)
      flyArrival.set(robot.position.x - 1.4, robot.position.y + 0.5, 2.2)
      activeCard = card; phase = 'flying'; phaseTime = 0
    }

    // ── SCROLL / MOUSE ────────────────────────────────────────────
    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    const clock = new THREE.Clock()
    let raf: number

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      phaseTime += dt

      // Scroll fraction (0 = Hero, 1 = City)
      const scrollFrac = Math.min(Math.max((scrollY - 100) / 600, 0), 1)

      // Animate Camera
      camera.position.y = lerp(CAM_HERO_Y, CAM_CITY_Y, ease(scrollFrac))
      camera.position.z = lerp(CAM_HERO_Z, CAM_CITY_Z, ease(scrollFrac))
      
      const targetLookAt = new THREE.Vector3()
      if (scrollFrac < 0.5) {
        targetLookAt.set(robot.position.x * 0.4, 0, 0)
      } else {
        targetLookAt.set(0, CAM_CITY_Y - 5, 0)
      }
      camera.lookAt(targetLookAt)

      // Hologram fades out smoothly on scroll
      const hMat = (holoScreen.children[0] as THREE.Mesh).material as THREE.MeshPhysicalMaterial
      const hLineMat = (holoScreen.children[1] as THREE.LineSegments).material as THREE.LineBasicMaterial
      hMat.opacity = lerp(0.15, 0, scrollFrac * 2)
      hLineMat.opacity = lerp(0.5, 0, scrollFrac * 2)

      // Robot animation logic
      if (scrollFrac < 0.8) {
        if (phase === 'idle') {
          leftArmGrp.rotation.x = lerp(leftArmGrp.rotation.x, 0.25, 0.06); leftArmGrp.rotation.z = lerp(leftArmGrp.rotation.z, 0.28, 0.06)
          rightArmGrp.rotation.x = lerp(rightArmGrp.rotation.x, 0.25, 0.06); rightArmGrp.rotation.z = lerp(rightArmGrp.rotation.z, -0.28, 0.06)
          headGrp.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.15
          // Glowing circuitry pulses idle
          circuitMat.emissiveIntensity = 2.0 + Math.sin(clock.elapsedTime * 2) * 0.5

          if (phaseTime >= 1.5) launchNext()
        } else if (phase === 'flying' && activeCard) {
          const p = Math.min(phaseTime / 2.0, 1.0)
          activeCard.position.lerpVectors(flyStart, flyArrival, ease(p))
          ;(activeCard.material as THREE.MeshStandardMaterial).opacity = Math.min(p * 5, 1) * (1 - scrollFrac) // Fade out if scrolling
          activeCard.lookAt(camera.position)
          
          if (p > 0.5) {
            headGrp.rotation.y = lerp(headGrp.rotation.y, 0.3, 0.1)
            leftArmGrp.rotation.x = lerp(leftArmGrp.rotation.x, 0.8, 0.05); leftArmGrp.rotation.z = lerp(leftArmGrp.rotation.z, 0.2, 0.05)
            rightArmGrp.rotation.x = lerp(rightArmGrp.rotation.x, 0.8, 0.05); rightArmGrp.rotation.z = lerp(rightArmGrp.rotation.z, -0.2, 0.05)
            circuitMat.emissiveIntensity = lerp(circuitMat.emissiveIntensity, 3.5, 0.1)
          }
          if (p >= 1.0) { phase = 'reading_typing'; phaseTime = 0 }
        } else if (phase === 'reading_typing' && activeCard) {
          const p = Math.min(phaseTime / 2.5, 1.0)
          activeCard.scale.setScalar(0.7)
          activeCard.position.lerp(flyArrival, 0.1)
          activeCard.rotation.y = lerp(activeCard.rotation.y, Math.PI / 8, 0.1)
          ;(activeCard.material as THREE.MeshStandardMaterial).opacity = 1 - scrollFrac
          
          // Typing motion
          leftArmGrp.rotation.x = 0.8 + Math.sin(phaseTime * 25) * 0.1
          leftArmGrp.rotation.z = 0.2 + Math.cos(phaseTime * 30) * 0.05
          rightArmGrp.rotation.x = 0.8 + Math.cos(phaseTime * 28) * 0.1
          rightArmGrp.rotation.z = -0.2 + Math.sin(phaseTime * 33) * 0.05
          circuitMat.emissiveIntensity = 3.5 + Math.sin(phaseTime * 20) * 1.5

          if (p >= 1.0) {
            ;(activeCard.material as THREE.MeshStandardMaterial).opacity = 0
            activeCard.visible = false; activeCard = null
            phase = 'idle'; phaseTime = 0; msgIndex++
          }
        }
      }

      // City animation logic
      if (scrollFrac > 0.1) {
        // Move LEADS (Green) towards center shops
        const lP = lGeo.attributes.position.array as Float32Array
        for(let i=0; i<LEADS_COUNT; i++) {
          // Attract to center (0,0,0) locally
          lP[i*3] += (0 - lP[i*3]) * 0.01 * lSpeed[i]
          lP[i*3+2] += (0 - lP[i*3+2]) * 0.01 * lSpeed[i]
          
          // Add some forward motion
          lP[i*3+2] += lSpeed[i]
          
          if (Math.abs(lP[i*3]) < 2 && Math.abs(lP[i*3+2]) < 2) {
             // Reached a shop, reset
             lP[i*3] = (Math.random() - 0.5) * 40
             lP[i*3+2] = -20 - Math.random() * 20
          }
        }
        lGeo.attributes.position.needsUpdate = true

        // Move WASTE (Red) towards Trash Can (-18, 0, 5)
        const wP = wGeo.attributes.position.array as Float32Array
        for(let i=0; i<WASTE_COUNT; i++) {
          wP[i*3] += (-18 - wP[i*3]) * 0.02 * wSpeed[i]
          wP[i*3+2] += (5 - wP[i*3+2]) * 0.02 * wSpeed[i]
          
          // Arc up and drop in
          const distToTrash = Math.sqrt(Math.pow(-18 - wP[i*3], 2) + Math.pow(5 - wP[i*3+2], 2))
          if (distToTrash < 4) wP[i*3+1] += 0.1 // Jump up
          if (distToTrash < 2) {
            // Dropped in trash, reset
            wP[i*3] = -10 + (Math.random() - 0.5) * 20
            wP[i*3+1] = 0.5
            wP[i*3+2] = -20 - Math.random() * 20
          }
        }
        wGeo.attributes.position.needsUpdate = true

        cityGrp.rotation.y = Math.sin(clock.elapsedTime * 0.1) * 0.1 // Subtle sway
      }

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
  )
}
