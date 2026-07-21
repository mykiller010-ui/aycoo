import { gallery } from "@/data/gallery";

export default function Gallery() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {gallery.map((image, i) => (
        <img
          key={i}
          src={image}
          className="aspect-square object-cover rounded-xl hover:scale-105 transition"
        />
      ))}
    </div>
  );
}