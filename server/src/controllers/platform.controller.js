const UserPlatform = require("../models/UserPlatform");
const platformSyncService = require("../services/platformSync.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

async function linkPlatform(req, res) {
  const { platform, username } = req.body;

  const existing = await UserPlatform.findOne({ userId: req.user._id, platform });
  if (existing) {
    existing.username = username;
    await existing.save();
  } else {
    await UserPlatform.create({ userId: req.user._id, platform, username });
  }

  res.status(200).json(new ApiResponse(200, { platform, username }, "Platform linked"));
}

async function getLinkedPlatforms(req, res) {
  const platforms = await UserPlatform.find({ userId: req.user._id }).lean();
  res.status(200).json(new ApiResponse(200, platforms));
}

async function unlinkPlatform(req, res) {
  const { platform } = req.params;
  await UserPlatform.deleteOne({ userId: req.user._id, platform });
  res.status(200).json(new ApiResponse(200, null, "Platform unlinked"));
}

async function syncPlatform(req, res) {
  const results = await platformSyncService.syncAllPlatforms(req.user._id);
  res.status(200).json(new ApiResponse(200, results, "Sync complete"));
}

module.exports = { linkPlatform, getLinkedPlatforms, unlinkPlatform, syncPlatform };
