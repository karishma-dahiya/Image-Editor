import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (!query.trim()) {
            toast.error("Please enter a valid search term.");
            return;
        }

        onSearch(query); 
    };

    return (
        <div className="flex justify-center mb-6">
            <div className="flex w-full max-w-xl gap-2">
                <input
                    type="text"
                    className="flex-1 p-4 border rounded"
                    placeholder="Search for images..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                    className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded"
                    onClick={handleSearch}
                >
                   
                   <Search className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
