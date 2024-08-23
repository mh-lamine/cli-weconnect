import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditableInput = ({ id, label, type, defaultValue, handleChange }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        defaultValue={defaultValue}
        onChange={handleChange}
        className="text-lg"
      />
    </div>
  );
};

export default EditableInput;