 

export default function crudRepository(model) {
  return {
 

    create: async (data) => {
      const newDoc = await model.create(data);
      return newDoc;
    },

    getAll: async () => {
      const allDocs = await model.find();
      return allDocs;
    },
    getById: async (id) => {
      const doc = await model.findById(id);
      return doc;
    },

    update: async (id) => {
      const updatedDoc = await model.findByIdAndUpdate(id);
      return updatedDoc;
    },

    delete: async (id, data) => {
      const response = await model.findByIdAndDelete(id, data, {
        new: true,
      });
      return response;
    },
  };
}
