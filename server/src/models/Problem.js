const mongoose = require("mongoose");
const slugify = require("slugify");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true,
    },
    topics: {
      type: [String],
      required: true,
      index: true,
    },
    companies: {
      type: [String],
      default: [],
      index: true,
    },
    examples: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
        explanation: String,
      },
    ],
    constraints: {
      type: String,
    },
    testCases: [
      {
        input: String,
        output: String,
      },
    ],
    solutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    acceptedSubmissions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Pre-save hook to auto-generate slug from title
problemSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  next();
});

// Compound text index for full-text search with weights
problemSchema.index(
  { title: "text", description: "text" },
  { weights: { title: 3, description: 1 } },
);

module.exports = mongoose.model("Problem", problemSchema);
