const mongoose = require("mongoose");

module.exports = async () => {
  try {
    mongoose.set("strictQuery", false);
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`MongoDB Connected... Host: ${connection.host}`);
  } catch (err) {
    console.log(err);
  }
};
