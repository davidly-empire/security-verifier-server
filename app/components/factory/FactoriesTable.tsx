'use client'

import { useEffect, useState } from 'react'
import { FactoryForm } from './FactoryForm'

interface Factory {
  id: string
  name: string
  location?: string
}

export const FactoriesTable = () => {
  const [factories, setFactories] = useState<Factory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')

  // -----------------------
  // Load factories from backend
  // -----------------------
  const loadFactories = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://127.0.0.1:8000/factories')
      if (!res.ok) throw new Error('Failed to fetch factories')
      const data = await res.json()
      const normalized = data.map((f: any) => ({
        id: f.factory_code,
        name: f.factory_name,
        location: f.location || ''
      }))
      setFactories(normalized)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  // -----------------------
  // Add new factory
  // -----------------------
  const addFactory = async (payload: { name: string; code: string; location?: string }) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/factories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          factory_name: payload.name, 
          factory_code: payload.code,
          location: payload.location || ''
        }),
      })
      if (!res.ok) throw new Error('Failed to create factory')
      await loadFactories()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to add factory')
    }
  }

  // -----------------------
  // Start editing a row
  // -----------------------
  const startEdit = (factory: Factory) => {
    setEditingId(factory.id)
    setEditName(factory.name)
    setEditLocation(factory.location || '')
  }

  // -----------------------
  // Save edited factory
  // -----------------------
  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/factories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          factory_name: editName, 
          factory_code: id, 
          location: editLocation
        }),
      })
      if (!res.ok) throw new Error('Failed to update factory')
      setEditingId(null)
      await loadFactories()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to update factory')
    }
  }

  // -----------------------
  // Delete factory
  // -----------------------
  const deleteFactory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this factory?')) return
    try {
      const res = await fetch(`http://127.0.0.1:8000/factories/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete factory')
      await loadFactories()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete factory')
    }
  }

  useEffect(() => {
    loadFactories()
  }, [])

  // -----------------------
  return (
    <div className="space-y-4">
      <FactoryForm onSubmit={addFactory} />

      {error && <p className="text-red-600 font-medium">{error}</p>}
      {loading ? (
        <p>Loading factories...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Code</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Location</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="border p-2">{f.id}</td>

                {/* Edit mode */}
                <td className="border p-2">
                  {editingId === f.id ? (
                    <input 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    f.name
                  )}
                </td>
                <td className="border p-2">
                  {editingId === f.id ? (
                    <input 
                      value={editLocation} 
                      onChange={(e) => setEditLocation(e.target.value)} 
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    f.location
                  )}
                </td>

                {/* Actions */}
                <td className="border p-2 space-x-2">
                  {editingId === f.id ? (
                    <>
                      <button 
                        onClick={() => saveEdit(f.id)} 
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)} 
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => startEdit(f)} 
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteFactory(f.id)} 
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
