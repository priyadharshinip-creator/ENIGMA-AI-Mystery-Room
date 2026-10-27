
const express = require("express");
const { z } = require("zod");
const Case = require("../models/Case");
const { generateMystery } = require("../services/geminiService");

const router = express.Router();

const createSchema = z.object({
  premise: z.string().trim().min(15).max(500),
  difficulty: z.enum(["easy", "medium", "hard"])
});

router.post("/", async (req, res) => {
  try {
    const input = createSchema.safeParse(req.body);

    if (!input.success) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid premise and difficulty."
      });
    }

    const { premise, difficulty } = input.data;

    const mystery = await generateMystery(
      premise,
      difficulty
    );

    const savedCase = await Case.create({
      ...mystery,
      premise,
      difficulty
    });

    return res.status(201).json({
      success: true,
      caseId: savedCase._id.toString()
    });

  } catch (error) {
    console.error("Case generation failed:", error.message);

    return res.status(503).json({
      success: false,
      message: "Mystery generation failed. Please try again."
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mystery ID"
      });
    }

    const mystery = await Case.findById(req.params.id)
      .select("-culpritId -explanation -__v")
      .lean();

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found"
      });
    }

    if (mystery.completed) {
      return res.status(403).json({
        success: false,
        message: "This mystery is completed"
      });
    }

    return res.json({
      success: true,
      mystery: {
        id: mystery._id,
        title: mystery.title,
        story: mystery.story,
        difficulty: mystery.difficulty,
        suspects: mystery.suspects,
        clues: mystery.clues.map(clue => ({
          id: clue.id,
          title: clue.title,
          discovered: mystery.discoveredClues.includes(clue.id),
          ...(mystery.discoveredClues.includes(clue.id)
            ? { description: clue.description }
            : {})
        })),
        discoveredClues: mystery.discoveredClues,
        hintsUsed: mystery.hintsUsed
      }
    });

  } catch (error) {
    console.error("Get mystery error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve mystery"
    });
  }
});


router.post("/:id/clues/:clueId/discover", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mystery ID"
      });
    }

    const mystery = await Case.findById(req.params.id);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found"
      });
    }

    if (mystery.completed) {
      return res.status(400).json({
        success: false,
        message: "This mystery is already completed"
      });
    }

    const clue = mystery.clues.find(
      c => c.id === req.params.clueId
    );

    if (!clue) {
      return res.status(404).json({
        success: false,
        message: "Clue not found"
      });
    }

    const alreadyDiscovered =
      mystery.discoveredClues.includes(clue.id);

    if (!alreadyDiscovered) {
      await Case.updateOne(
        {
          _id: mystery._id,
          completed: false
        },
        {
          $addToSet: { discoveredClues: clue.id }
        }
      );
    }

    return res.json({
      success: true,
      clue: {
        id: clue.id,
        title: clue.title,
        description: clue.description,
        discovered: true
      }
    });

  } catch (error) {
    console.error("Clue discovery error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to discover clue"
    });
  }
});

router.post("/:id/hints", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mystery ID"
      });
    }

    const mystery = await Case.findOne({
      _id: req.params.id,
      completed: false
    }).select("hints hintsUsed");

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Active mystery not found"
      });
    }

    if (mystery.hintsUsed >= mystery.hints.length) {
      return res.status(400).json({
        success: false,
        message: "No hints remaining"
      });
    }

    const updated = await Case.findOneAndUpdate(
      {
        _id: req.params.id,
        completed: false,
        hintsUsed: mystery.hintsUsed
      },
      {
        $inc: { hintsUsed: 1 }
      },
      { new: true }
    ).select("hints hintsUsed");

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Progress changed. Please try again."
      });
    }

    const hint = updated.hints[updated.hintsUsed - 1];

    return res.json({
      success: true,
      hint,
      hintsUsed: updated.hintsUsed,
      hintsRemaining: updated.hints.length - updated.hintsUsed,
      hintPenalty: updated.hintsUsed * 10
    });

  } catch (error) {
    console.error("Hint error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve hint"
    });
  }
});

router.post("/:id/accuse", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mystery ID"
      });
    }

    const { suspectId } = req.body;

    if (typeof suspectId !== "string" || !suspectId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a suspect"
      });
    }

    const mystery = await Case.findById(req.params.id);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found"
      });
    }

    if (mystery.completed) {
      return res.status(400).json({
        success: false,
        message: "Mystery already completed"
      });
    }

    const selectedSuspect = mystery.suspects.find(
      suspect => suspect.id === suspectId
    );

    if (!selectedSuspect) {
      return res.status(400).json({
        success: false,
        message: "Invalid suspect selected"
      });
    }

    const correct = suspectId === mystery.culpritId;

    const basePoints = {
      easy: 100,
      medium: 150,
      hard: 200
    };

    const score = Math.max(
      0,
      (correct ? basePoints[mystery.difficulty] : 0) +
      mystery.discoveredClues.length * 5 -
      mystery.hintsUsed * 10
    );

    const updated = await Case.findOneAndUpdate(
      {
        _id: mystery._id,
        completed: false
      },
      {
        $set: {
          completed: true,
          accusation: suspectId,
          score
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Mystery was already completed"
      });
    }

    const culprit = updated.suspects.find(
      suspect => suspect.id === updated.culpritId
    );

    return res.json({
      success: true,
      result: {
        correct,
        accusedSuspect: selectedSuspect.name,
        culprit: culprit.name,
        explanation: updated.explanation,
        score: updated.score,
        difficulty: updated.difficulty,
        cluesDiscovered: updated.discoveredClues.length,
        hintsUsed: updated.hintsUsed
      }
    });

  } catch (error) {
    console.error("Accusation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit accusation"
    });
  }
});

router.get("/:id/result", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mystery ID"
      });
    }

    const mystery = await Case.findById(req.params.id);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found"
      });
    }

    if (!mystery.completed) {
      return res.status(403).json({
        success: false,
        message: "Complete the mystery before viewing results"
      });
    }

    const culprit = mystery.suspects.find(
      suspect => suspect.id === mystery.culpritId
    );

    const accusedSuspect = mystery.suspects.find(
      suspect => suspect.id === mystery.accusation
    );

    return res.json({
      success: true,
      result: {
        title: mystery.title,
        correct: mystery.accusation === mystery.culpritId,
        accusedSuspect: accusedSuspect?.name || "Unknown",
        culprit: culprit?.name || "Unknown",
        explanation: mystery.explanation,
        score: mystery.score,
        difficulty: mystery.difficulty,
        cluesDiscovered: mystery.discoveredClues.length,
        hintsUsed: mystery.hintsUsed
      }
    });

  } catch (error) {
    console.error("Result retrieval error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve results"
    });
  }
});

module.exports = router;
