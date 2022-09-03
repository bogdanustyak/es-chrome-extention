interface ToggleSwitchProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch = ({
  name,
  checked,
  onChange,
}: ToggleSwitchProps) => {
  return (
    <div>
      <input
        id="toggle-switch"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="checkbox-label " htmlFor="toggle-switch">
        {name}
      </label>
    </div>
  );
};
