import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchBar from './components/SearchBar';
import ImageContainer from './components/ImageContainer';

import ImageEditor from './components/ImageEditor';
import axios from 'axios';
import Pagination from './components/Pagination';

function App() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const[loading, setLoading] = useState(false);
  const handleSelectImage = (imageUrl) => {
    console.log("Selected image URL:", imageUrl);
    setSelectedImage(imageUrl);
  }
  
const perPage = 20;
const totalPages = Math.ceil(totalResults / perPage);

  useEffect(() => {
    const fetchImages = async () => {
      if (!searchQuery) return;
      try {
        setLoading(true);
        const res = await axios.get("https://pixabay.com/api/", {
          params: {
            key: "49705694-e1737249ac30eae87181bfec6",
            q: searchQuery,
            image_type: "photo",
            page: currentPage,
            per_page: perPage,
          },
        });
        if (res.data.hits.length === 0) {
          toast.error("No images found. Please try a different search.");
          setImages([]);
          setTotalResults(0);
          return;
        }
        setImages(res.data.hits);
        setTotalResults(res.data.totalHits);
      } catch (err) {
        console.error("Error fetching:", err);
        toast.error("Failed to fetch images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery, currentPage]);

  return (
    <div className="w-full min-h-screen px-4 py-6 text-gray-800 bg-slate-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto space-y-6 max-w-7xl">

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Name: Karishma</h2>
          <p className="text-sm text-gray-500">Email: karishma.dahiya22@gmail.com</p>
        </div>
       <div className="text-center">
      <h1 className="text-3xl font-bold text-blue-900">
        Image Caption & Shape Editor
      </h1>
    </div>

        <div>
        
          {!selectedImage &&
            <>
            <SearchBar onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }} />
            {loading && <p className="text-center">Loading...</p>}
            {!loading && images.length > 0 &&  (
              <>
                <ImageContainer images={images} onSelect={handleSelectImage} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
                </>
            )}
           
            </>}
          {selectedImage && <ImageEditor imageUrl={selectedImage} onBack={() => setSelectedImage(null)} />}
        </div>

      </div>
    </div>
  );
}

export default App
