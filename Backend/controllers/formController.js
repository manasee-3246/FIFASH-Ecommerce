import Form from "../models/Form.js";

// ✅ Named export
export const submitForm = async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.json({ msg: "Form submitted" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const getForms = async (req, res) => {
  const data = await Form.find().sort({ createdAt: -1 });
  res.json(data);
};

export const updateForm = async (req, res) => {
  try {
    const updated = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: "Form not found" });
    }

    res.json({ msg: "Form updated", data: updated });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const deleteForm = async (req, res) => {
  const deleted = await Form.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ msg: "Form not found" });
  }

  res.json({ msg: "Deleted" });
};
