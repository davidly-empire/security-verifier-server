'use client'

import { useEffect, useState } from 'react'
import { FactoryForm } from './FactoryForm'

interface Factory {
  id: string
  name: string
  location?: string
  address?: string
}

export const FactoriesTable = () => {

  // --- LOGIC (UNCHANGED) ---
  const [factories, setFactories] = useState<Factory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editAddress, setEditAddress] = useState('')

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || '/api'

  const loadFactories = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/factories`)
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      const normalized = data.map((f: any) => ({
        id: f.factory_code,
        name: f.factory_name,
        location: f.location || '',
        address: f.factory_address || ''
      }))
      setFactories(normalized)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addFactory = async (payload: {
    name: string
    code: string
    location?: string
    address?: string
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/factories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factory_name: payload.name,
          factory_code: payload.code,
          location: payload.location || '',
          factory_address: payload.address || '',
        }),
      })
      if (!res.ok) throw new Error('Create failed')
      await loadFactories()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const startEdit = (f: Factory) => {
    setEditingId(f.id)
    setEditName(f.name)
    setEditLocation(f.location || '')
    setEditAddress(f.address || '')
  }

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/factories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factory_name: editName,
          factory_code: id,
          location: editLocation,
          factory_address: editAddress,
        }),
      })
      if (!res.ok) throw new Error('Update failed')
      setEditingId(null)
      await loadFactories()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const deleteFactory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this factory? This action cannot be undone.')) return
    try {
      const res = await fetch(`${API_BASE_URL}/factories/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok && res.status !== 204) {
        throw new Error('Delete failed')
      }
      await loadFactories()
    } catch (err: any) {
      alert(err.message)
    }
  }

  useEffect(() => {
    loadFactories()
  }, [])
  // --- END LOGIC ---


  /* ================= UI COMPONENTS ================= */

  const InlineInput = ({
    value,
    onChange,
    placeholder
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
      autoFocus
    />
  )

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Factories Management
            </h2>
          </div>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-slate-900/5">
          <div className="border-b border-slate-200/80 bg-white px-6 py-5">
            <h3 className="text-lg font-medium leading-6 text-slate-900">
              Add New Factory
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Create a new factory entry by filling out the details below.
            </p>
          </div>
          <div className="px-6 py-6">
            <FactoryForm onSubmit={addFactory} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-slate-900/5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <svg className="h-8 w-8 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm text-slate-500">Loading factories...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Address
                    </th>
                    <th scope="col" className="relative px-6 py-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {factories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                        No factories found. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    factories.map((f) => (
                      <tr key={f.id} className="transition-colors duration-200 hover:bg-slate-50">
                        {/* Code */}
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-slate-600">
                          {f.id}
                        </td>

                        {/* Name */}
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                          {editingId === f.id ? (
                            <InlineInput
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Factory Name"
                            />
                          ) : (
                            <span className="block truncate max-w-[200px]" title={f.name}>{f.name}</span>
                          )}
                        </td>

                        {/* Location */}
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                          {editingId === f.id ? (
                            <InlineInput
                              value={editLocation}
                              onChange={(e) => setEditLocation(e.target.value)}
                              placeholder="Location"
                            />
                          ) : (
                            f.location || <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Address */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {editingId === f.id ? (
                            <InlineInput
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              placeholder="Factory Address"
                            />
                          ) : (
                            <div className="max-w-xs truncate" title={f.address || ''}>
                              {f.address || <span className="text-slate-300">—</span>}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          {editingId === f.id ? (
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={() => saveEdit(f.id)}
                                className="text-emerald-600 hover:text-emerald-900 font-medium transition-colors"
                              >
                                Save
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-slate-500 hover:text-slate-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-4">
                              <button
                                onClick={() => startEdit(f)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteFactory(f.id)}
                                className="text-rose-600 hover:text-rose-900 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}