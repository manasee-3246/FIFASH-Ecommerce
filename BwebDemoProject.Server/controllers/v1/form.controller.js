import Form from "../../models/FormModel.js";
import { buildPublicUrl } from "../../utils/publicUrl.js";

// SUBMIT FORM
export const submitForm = async (req, res) => {
  try {
    const form = new Form({
      ...req.body,
      image: req.file
        ? buildPublicUrl(req, `/uploads/${req.file.filename}`)
        : "",
    });

    await form.save();

    res.json({
      msg: "Form Submitted Successfully",
    });

  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

// GET ALL FORMS
export const getForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const total = await Form.countDocuments();

    const data = await Form.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// SEARCH FORMS
export const searchForms = async (req, res) => {
  try {
    const query = req.query.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        {
          First_name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          Last_name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    };

    const total = await Form.countDocuments(filter);

    const forms = await Form.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: forms,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// UPDATE FORM
export const updateForm = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = buildPublicUrl(req, `/uploads/${req.file.filename}`);
    }

    const updated = await Form.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        msg: "Form not found",
      });
    }

    res.json({
      msg: "Form updated",
      data: updated,
    });

  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};
// DELETE FORM
export const deleteForm = async (req, res) => {
  const deleted = await Form.findByIdAndDelete(
    req.params.id
  );

  if (!deleted) {
    return res.status(404).json({
      msg: "Form not found",
    });
  }

  res.json({
    msg: "Deleted",
  });
};
