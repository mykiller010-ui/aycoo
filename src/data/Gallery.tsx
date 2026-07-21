import { useState } from "react";
import { gallery } from "@/data/gallery";

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen bg-black p-10">
        <h1 className="text-4xl font-bold text-white mb-8">
          Instagram Gallery
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {gallery.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className="group overflow-hidden rounded-2xl"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full aspect-square object-cover transition duration-300 group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 rounded-2xl overflow-hidden max-w-4xl w-[90%]"
          >
            <img
              src={gallery[selected].image}
              className="w-full object-contain max-h-[75vh]"
            />

            <div className="p-6">
              <h2 className="text-white text-2xl">
                {gallery[selected].title}
              </h2>

              <p className="text-zinc-400">
                {gallery[selected].date}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
