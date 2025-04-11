import React from "react";

function ImageContainer({ images, onSelect }) {
    return (
        <div className="grid grid-cols-2 gap-6 p-4 md:grid-cols-4">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-md-md hover:shadow-xl"
                >
                    <img
                        src={image.webformatURL}
                        alt={image.tags}
                        className="object-cover w-full h-40 transition-transform duration-300 hover:scale-105"
                    />
                    <div className="p-3">
                        <button
                            className="w-full py-2 mt-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                            onClick={() => onSelect(image.largeImageURL)}
                        >
                            Add Captions
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default ImageContainer;