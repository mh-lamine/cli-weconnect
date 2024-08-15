import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditableInput = ({ id, label, type, value, edit, handleChange }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        disabled={!edit}
        id={id}
        type={type}
        value={!edit ? value : null}
        onChange={handleChange}
        className="text-lg"
      />
    </div>
  );
};

export default EditableInput;