export default function ToggleSpotsControl({
  showRacks,
  showSigns,
  handleToggleRacks,
  handleToggleSigns,
}) {
  return (
    <div className="flex flex-col gap-2 absolute z-[800] top-[75px] right-3 bg-white p-2 rounded border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding">
      <label>
        <input
          type="checkbox"
          checked={showRacks}
          onChange={handleToggleRacks}
          className="mr-1"
        />
        Bike Racks
      </label>
      <label>
        <input
          type="checkbox"
          checked={showSigns}
          onChange={handleToggleSigns}
          className="mr-1"
        />
        Street Signs
      </label>
    </div>
  );
}
