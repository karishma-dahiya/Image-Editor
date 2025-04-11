import React, { useEffect, useRef, useState } from "react";
import {
    Canvas,
    IText,
    Rect,
    Circle,
    Triangle,
    Polygon,
    FabricImage,
} from "fabric";
import {
    ArrowLeft,
    Type,
    Square,
    Circle as CircleIcon,
    Triangle as TriangleIcon,
    Pentagon,
    Download,
    Delete,
    Trash2,
   
} from "lucide-react";
import { toast } from "react-toastify";


const ToolButton = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center w-full gap-2 px-3 py-2 text-left text-blue-700 transition rounded-md hover:text-blue-900 hover:bg-blue-50"
    >
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </button>
);

 function ImageEditor({ imageUrl, onBack }) {
    const canvasRef = useRef(null);
     const [canvas, setCanvas] = useState(null);
     const [selectedColor, setSelectedColor] = useState("#ff0000");
     const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
     const [showLayers, setShowLayers] = useState(false);
    //  const [history, setHistory] = useState([]);
    //  const [step, setStep] = useState(0);

    const[canvasLayers, setCanvasLayers] = useState([]); 

   
     useEffect(() => {
         const container = canvasRef.current?.parentElement;
         const { width, height } = container.getBoundingClientRect();
         const fabricCanvas = new Canvas(canvasRef.current, {
             width: width,
             height: height,
         });

         setCanvas(fabricCanvas);
         
      
         if (imageUrl) {
            FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" }).then((img) => {
         
                const canvasWidth = width;
                const canvasHeight = height;



                const scale = 0.5

                img.set({
                    left: (canvasWidth - img.width * scale) / 2,
                    top: (canvasHeight - img.height * scale) / 2,
                    scaleX: 0.7,
                    scaleY: 0.7,
                    selectable: true,
                    hasControls: true,
                    lockUniScaling: false,
                });

                fabricCanvas.add(img);
                fabricCanvas.setActiveObject(img);
                fabricCanvas.requestRenderAll();
            }).catch((err) => {
                console.error("Image loading failed:", err);
                toast.error("Failed to load image. Please try again.");
            });
            }

         

         const logChanges = () => {
           //  const activeObject = fabricCanvas.getActiveObject();
             //console.log("Canvas objects:", fabricCanvas.getObjects());
            //  const objects = fabricCanvas.getObjects();
            //  objects.forEach((obj, index) => {
            //      console.log(`Object ${index + 1}:`, obj.toObject());
            //  });
             const layers = fabricCanvas.getObjects().map((obj, i) => (
                 {
                 
                 index: i,
                 type: obj.type,
                 left: obj.left,
                 top: obj.top,
                 scaleX: obj.scaleX,
                 scaleY: obj.scaleY,
                 angle: obj.angle,
                 ...(obj.type === "image" && { src: obj.getSrc?.() }),
                 ...(obj.type === "textbox" || obj.type === "i-text" ? {
                     text: obj.text,
                     fontSize: obj.fontSize,
                     fill: obj.fill,
                 } : {})
             }));

             console.log("Canvas Updated:", layers);
             setCanvasLayers(layers); 
             
         };

         // Attach debounced to events
         fabricCanvas.on("object:added", logChanges);
         fabricCanvas.on("object:modified", logChanges);
         fabricCanvas.on("object:removed", logChanges);
         fabricCanvas.on("object:scaled", logChanges);
         fabricCanvas.on("object:moved", logChanges);
         fabricCanvas.on("object:rotated", logChanges);

         return () => {
             fabricCanvas.dispose();
           
         };
     }, [imageUrl]);
     
     function updateColor(e) {
         const obj = e.selected?.[0];
         if (obj && obj.fill) {
             setSelectedColor(obj.fill);
         }
     }
    
    const addText = () => {
        const text = new IText("Edit me", {
            left: 100,
            top: 100,
            fontSize: 24,
            fill: selectedColor,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    };

    const addShape = (shape) => {
        let obj;
        switch (shape) {
            case "rect":
                obj = new Rect({ left: 150, top: 150, fill: selectedColor, width: 80, height: 60 });
                break;
            case "circle":
                obj = new Circle({ left: 200, top: 200, fill: selectedColor, radius: 40 });
                break;
            case "triangle":
                obj = new Triangle({ left: 250, top: 250, fill: selectedColor, width: 60, height: 80 });
                break;
            case "polygon":
                obj = new Polygon(
                    [
                        { x: 300, y: 100 },
                        { x: 350, y: 150 },
                        { x: 320, y: 200 },
                        { x: 280, y: 180 },
                    ],
                    { fill: selectedColor }
                );
                break;
            default:
                return;
        }
        canvas.add(obj);
        canvas.setActiveObject(obj);
    };
     
    const downloadImage = () => {
        const dataURL = canvas.toDataURL({ format: "png" });
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "edited-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
     };
     const handleDelete = () => {
         if (!canvas) return;

         const activeObject = canvas.getActiveObject();
         if (activeObject) {
             canvas.remove(activeObject);
             canvas.discardActiveObject(); 
             canvas.requestRenderAll();
         }
     };

     return (
        <div>
             
            <div className="flex flex-col items-start justify-center min-h-screen gap-4 p-4 bg-gray-700 max-w-screen md:flex-row">

                <div className="flex items-center justify-around w-full p-2 mb-4 bg-white rounded-md shadow-md md:hidden">
                    <button onClick={onBack} title="Back"><ArrowLeft className="w-6 h-6 text-blue-700" /></button>
                    <button onClick={addText} title="Text"><Type className="w-6 h-6 text-blue-700" /></button>
                    <button onClick={() => addShape("rect")} title="Rectangle"><Square className="w-6 h-6 text-blue-700" /></button>
                    <button onClick={() => addShape("circle")} title="Circle"><CircleIcon className="w-6 h-6 text-blue-700" /></button>
                    <button onClick={() => addShape("triangle")} title="Triangle"><TriangleIcon className="w-6 h-6 text-blue-700" /></button>
                    <button onClick={() => addShape("polygon")} title="Polygon"><Pentagon className="w-6 h-6 text-blue-700" /></button>
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => {
                            const obj = canvas?.getActiveObject();
                            if (obj) {
                                obj.set("fill", e.target.value);
                                setSelectedColor(e.target.value);
                                canvas.requestRenderAll();
                            }
                        }}
                        className="w-6 h-6 border border-gray-300 rounded-full cursor-pointer"
                        title="Fill Color"
                     />
                     <button onClick={handleDelete} title="Polygon"><Trash2 className="w-6 h-6 text-blue-700" /></button>
                 
                    <button onClick={downloadImage} title="Download"><Download className="w-6 h-6 text-green-600" /></button>
                </div>

            
                <div className="flex-1 w-full p-4 bg-white rounded-md shadow-md">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-auto border border-gray-200 rounded-md"
                        id="canvas"
                    />
                </div>

                <div className="flex-col items-start hidden w-56 gap-5 p-4 bg-white border border-gray-200 shadow-lg md:flex rounded-xl">
                    <h3 className="self-center text-lg font-semibold text-blue-800">Tools</h3>
                    <ToolButton icon={<ArrowLeft />} label="Back" onClick={onBack} />
                    <ToolButton icon={<Type />} label="Text" onClick={addText} />
                    <ToolButton icon={<Square />} label="Rect" onClick={() => addShape("rect")} />
                    <ToolButton icon={<CircleIcon />} label="Circle" onClick={() => addShape("circle")} />
                    <ToolButton icon={<TriangleIcon />} label="Triangle" onClick={() => addShape("triangle")} />
                     <ToolButton icon={<Pentagon />} label="Polygon" onClick={() => addShape("polygon")} />
                     <ToolButton icon={<Delete/>} label="Delete " onClick={handleDelete} />
                    <div className="flex items-center w-full gap-3">
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => {
                                const obj = canvas?.getActiveObject();
                                if (obj) {
                                    obj.set("fill", e.target.value);
                                    setSelectedColor(e.target.value);
                                    canvas.requestRenderAll();
                                }
                            }}
                            className="w-8 h-8 border border-gray-300 rounded-full shadow-sm cursor-pointer"
                            title="Choose Fill Color"
                        />
                        <span className="text-sm font-medium text-gray-700">Fill Color</span>
                    </div>
                    <ToolButton icon={<Download />} label="Download" onClick={downloadImage} />
                </div>
             </div>
             <button
                 onClick={() => setShowLayers(!showLayers)}
                 className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
             >
                 Show/Hide Canvas Logs
             </button>

             {showLayers && (
                 <div className="mt-4 p-4 bg-white rounded shadow-md max-h-[300px] overflow-y-auto text-sm">
                     {canvasLayers.length === 0 ? (
                         <p className="text-gray-500">No logs to show.</p>
                     ) : (
                       
                             <div  className="pb-2 mb-3 border-b">
                                 {/* <p><strong>Layer {i + 1}</strong></p> */}
                                 <pre className="whitespace-pre-wrap">{JSON.stringify(canvasLayers, null, 2)}</pre>
                             </div>
                      
                     )}
                 </div>
             )}
        </div>
    );
}

export default ImageEditor;