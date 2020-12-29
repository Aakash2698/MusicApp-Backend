const mongoose = require("mongoose");
const topChartsSchema = mongoose.Schema({
  chartName: {
    type: String,
  },
  chartImage: {
    type: String,
  },
});
module.exports = mongoose.model("TopCharts", topChartsSchema);
