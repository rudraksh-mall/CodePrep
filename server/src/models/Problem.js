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
    solutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
      },
    ],
    sourceUrl: {
      type: String,
    },
    sourceLabel: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

problemSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    trim: true,
  });
  next();
});

problemSchema.index(
  { title: "text", description: "text" },
  { weights: { title: 3, description: 1 } },
);

const { upsertProblemInPinecone, removeProblemFromPinecone } = require("../services/pineconeSync.service");

problemSchema.post("save", async function () {
  try {
    await upsertProblemInPinecone(this);
  } catch {
    // non-blocking; Pinecone may not be configured
  }
});

problemSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      await removeProblemFromPinecone(doc.slug);
    } catch {
      // non-blocking
    }
  }
});

module.exports = mongoose.model("Problem", problemSchema);
