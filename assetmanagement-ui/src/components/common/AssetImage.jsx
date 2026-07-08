import { MdInventory } from "react-icons/md";

export default function AssetImage({ imageUrl, assetName, size = 48 }) {
  return imageUrl ? (
    <img
      src={imageUrl}
      alt={assetName}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius: "8px",
      }}
      onError={(e) => (e.target.style.display = "none")}
    />
  ) : (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "#f3f4f6",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MdInventory color="#9ca3af" size={size / 2} />
    </div>
  );
}