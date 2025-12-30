'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, Lock, User, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import * as THREE from 'three'

// ==========================================
// ORIGINAL LOGIC PRESERVED BELOW (Enhanced)
// ==========================================
export default function LoginPage() {
  const router = useRouter()

  // --- State ---
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- Refs for Animations ---
  const formRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // --- ORIGINAL LOGIC: handleLogin ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    setTimeout(() => {
      // 🔐 UPDATED TEMP LOGIN CREDENTIALS
      if (userId === '1234' && password === '1234') {
        router.push('/dashboard')
      } else {
        setError('Invalid User ID or Password')
        if (formRef.current) {
          formRef.current.classList.add('animate-[shake_0.5s_ease-in-out]')
          setTimeout(
            () => formRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'),
            500
          )
        }
      }
      setLoading(false)
    }, 800)
  }

  // --- Animation Effects (Entry) ---
  useEffect(() => {
    const inputs = inputRefs.current
    inputs.forEach((input, index) => {
      if (input) {
        input.style.opacity = '0'
        input.style.transform = 'translateY(20px)'
        setTimeout(() => {
          input.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
          input.style.opacity = '1'
          input.style.transform = 'translateY(0)'
        }, 100 * index)
      }
    })
  }, [])

  return (
    <>
      {/* Hide navbar on this page */}
      <div className="hidden">
        {/* NavbarClient removed intentionally */}
      </div>

      <div id="canvas-container" className="fixed inset-0 z-0 bg-slate-950" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-900/30 via-slate-950/50 to-indigo-900/30 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div
          ref={formRef}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.3)] p-8 transition-all duration-500 hover:shadow-[0_0_70px_rgba(59,130,246,0.5)]"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-4 rounded-full mb-4 shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Admin Portal</h1>
            <p className="text-sm text-blue-200/70 mt-2 flex items-center gap-2">
              <Sparkles size={14} /> Secure Access System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs text-blue-100">User ID</label>
              <input
                ref={(el) => (inputRefs.current[0] = el)}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-slate-900/40 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-xs text-blue-100">Password</label>
              <div className="relative">
                <input
                  ref={(el) => (inputRefs.current[1] = el)}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 bg-slate-900/40 border border-white/10 rounded-xl text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-5 text-blue-300"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-500">
            © 2025 Security Verifier
          </p>
        </div>
      </div>

      <BackgroundInjector />
      <CustomStyles />
    </>
  )
}

// ==========================================
// 3D SCENE EFFECTS (Three.js)
// ==========================================
const SceneEffect = () => {
  useEffect(() => {
    const container = document.getElementById('canvas-container')
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(15, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, opacity: 0.05, transparent: true })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const animate = () => {
      requestAnimationFrame(animate)
      mesh.rotation.x += 0.002
      mesh.rotation.y += 0.002
      renderer.render(scene, camera)
    }

    animate()
  }, [])

  return null
}

const BackgroundInjector = () => <SceneEffect />

const CustomStyles = () => (
  <style jsx global>{`
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      50% { transform: translateX(-5px); }
    }
  `}</style>
)
