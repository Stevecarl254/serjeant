import Resource from "../models/Resource.js";

// ------------------ CREATE RESOURCE ------------------
export const addResource = async (req, res) => {
  try {
    const { title, type, category, description } = req.body;

    if (!req.file && type === "PDF") {
      return res.status(400).json({ message: "PDF file required" });
    }

    const fileUrl = req.file ? `/${req.file.path}` : null;

    const resource = await Resource.create({
      title,
      type,
      category,
      description,
      fileUrl,
    });

    res.status(201).json({
      message: `${resource.title} added successfully`,
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ------------------ GET ALL RESOURCES ------------------
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ------------------ DELETE RESOURCE ------------------
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Optionally delete the physical file
    // fs.unlinkSync("." + resource.fileUrl);

    await resource.deleteOne();

    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
