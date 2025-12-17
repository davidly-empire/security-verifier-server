"use client";

interface QrFiltersProps {
  filters: {
    status: string;
    building: string;
    floor: string;
    search: string;
  };
  setFilters: (filters: any) => void;
  buildings: string[];
  floors: string[];
}

export default function QrFilters({
  filters,
  setFilters,
  buildings,
  floors,
}: QrFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "All",
      building: "All",
      floor: "All",
      search: "",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
            Building
          </label>
          <select
            id="building"
            name="building"
            value={filters.building}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="All">All</option>
            {buildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
            Floor
          </label>
          <select
            id="floor"
            name="floor"
            value={filters.floor}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="All">All</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>
        
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by QR Name / Code
          </label>
          <div className="flex">
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search..."
              className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}