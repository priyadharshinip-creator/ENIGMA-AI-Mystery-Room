
const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    story: { type: String, required: true },
    premise: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },

    suspects: [{
      id: String,
      name: String,
      description: String,
      alibi: String
    }],

    clues: [{
      id: String,
      title: String,
      description: String
    }],

    hints: [String],

    culpritId: { type: String, required: true },
    explanation: { type: String, required: true },

    discoveredClues: {
      type: [String],
      default: []
    },

    hintsUsed: { type: Number, default: 0 },

    accusation: { type: String, default: null },
    score: { type: Number, default: null },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);

