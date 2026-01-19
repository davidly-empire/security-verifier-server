'use client'

import { useState, useEffect } from 'react'

/* ✅ THIS TYPE MATCHES FactoriesTable EXACTLY */
export interface FactoryFormData {
  name: string
  code: string
  location?: string
}

interface Props {
  onSubmit: (data: FactoryFormData) => void
  initialData?: FactoryFormData
  onCancel?: () => void
}

export const FactoryForm = ({
  onSubmit,
  initialData,
  onCancel,
}: Props) => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [location, setLocation] = useState('')

  // Pre-fill form for edit
  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setCode(initialData.code)
      setLocation(initialData.location || '')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !code) {
      alert('Please fill Name and Code')
      return
    }

    onSubmit({ name, code, location })

    if (!initialData) {
      setName('')
      setCode('')
      setLocation('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 p-4 border rounded bg-white shadow"
    >
      <div className="flex flex-col md:flex-row md:gap-2">
        <input
          type="text"
          placeholder="Factory Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Factory Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={!!initialData}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {initialData ? 'Update Factory' : 'Add Factory'}
        </button>

        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
